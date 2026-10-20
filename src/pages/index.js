import React, { useState, useEffect, useRef, useMemo } from 'react';
import Header from '../components/Header';
import RulesBanner from '../components/RulesBanner';
import WeekSelector from '../components/WeekSelector';
import MachineColumn from '../components/MachineColumn';
import BookingModal from '../components/BookingModal';
import UserNameModal from '../components/UserNameModal';
import AdminModal from '../components/AdminModal';
import ActionBar from '../components/ActionBar';
import '../styles/global.css';

const SYNC_API_ENDPOINT = "https://extendsclass.com/api/json-storage/bin/aaadcbe";
const MACHINES = [1, 2, 4];
const TIMES = ["08:00", "14:00", "21:00"];

const SLOT_CONFIGS = {
  "08:00": { openMin: 390, closeMin: 505 },   // 6:30 até 8h25
  "14:00": { openMin: 750, closeMin: 865 },   // 12:30 até 14h25
  "21:00": { openMin: 1170, closeMin: 1285 }  // 19:30 até 21h25
};

const formatDateKey = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getWeekDates = (baseDate = new Date()) => {
  const d = new Date(baseDate);
  const day = d.getDay(); // 0 is Sunday, 1 is Monday...
  const diffToMonday = day === 0 ? -6 : 1 - day;
  
  const monday = new Date(d);
  monday.setDate(d.getDate() + diffToMonday);
  monday.setHours(0, 0, 0, 0);

  const weekDays = [];
  const dayNames = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'];
  const shortNames = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

  for (let i = 0; i < 7; i++) {
    const current = new Date(monday);
    current.setDate(monday.getDate() + i);
    const dateKey = formatDateKey(current);

    weekDays.push({
      dateKey,
      dayName: dayNames[i],
      shortName: shortNames[i],
      dayNumber: String(current.getDate()).padStart(2, '0'),
      monthNumber: String(current.getMonth() + 1).padStart(2, '0'),
      dateObj: current
    });
  }

  return {
    mondayKey: weekDays[0].dateKey,
    sundayKey: weekDays[6].dateKey,
    weekDays
  };
};

const IndexPage = () => {
  const [theme, setTheme] = useState('dark');
  const [currentUserName, setCurrentUserName] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [slots, setSlots] = useState({});
  const [weekStart, setWeekStart] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  // Today and Selected Date Keys
  const todayDateKey = useMemo(() => formatDateKey(currentTime), [currentTime]);
  const [selectedDateKey, setSelectedDateKey] = useState(todayDateKey);

  // Compute Current Week Days
  const { mondayKey, weekDays } = useMemo(() => getWeekDates(currentTime), [currentTime]);

  // Selected Day Details
  const selectedDay = useMemo(() => {
    return weekDays.find(d => d.dateKey === selectedDateKey) || {
      dateKey: selectedDateKey,
      dayName: 'Hoje',
      shortName: 'Hoje',
      dayNumber: '',
      monthNumber: ''
    };
  }, [weekDays, selectedDateKey]);

  // Modals
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [targetSlot, setTargetSlot] = useState(null);
  const [userNameModalOpen, setUserNameModalOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const lastSyncTimestamp = useRef(0);

  // 1. Force PWA Service Worker to update fresh bundles
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        for (let registration of registrations) {
          registration.update();
        }
      });
    }
  }, []);

  // 2. Load LocalStorage on Mount
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('nipo_laundry_theme') || 'dark';
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);

      const savedUser = localStorage.getItem('nipo_laundry_user_name') || '';
      setCurrentUserName(savedUser);

      const savedAdmin = sessionStorage.getItem('nipo_laundry_admin_auth') === 'true';
      setIsAdmin(savedAdmin);

      const savedWeekStart = localStorage.getItem('nipo_laundry_week_start');
      const savedSlots = localStorage.getItem('nipo_laundry_slots');

      if (savedWeekStart === mondayKey && savedSlots) {
        setWeekStart(savedWeekStart);
        setSlots(JSON.parse(savedSlots));
      } else {
        setWeekStart(mondayKey);
        setSlots({});
      }
    } catch (e) {
      console.error("Erro ao carregar dados locais", e);
    }
  }, [mondayKey]);

  // 3. Real-Time Cloud Synchronization
  const fetchCloudState = async () => {
    try {
      setIsSyncing(true);
      const res = await fetch(SYNC_API_ENDPOINT, { cache: 'no-store' });
      if (!res.ok) return;
      const cloudData = await res.json();
      
      if (cloudData && cloudData.updatedAt && cloudData.updatedAt > lastSyncTimestamp.current) {
        lastSyncTimestamp.current = cloudData.updatedAt;

        // Check if cloud state matches current week
        if (cloudData.weekStart === mondayKey && cloudData.slots) {
          setSlots(cloudData.slots);
          setWeekStart(cloudData.weekStart);
          localStorage.setItem('nipo_laundry_slots', JSON.stringify(cloudData.slots));
          localStorage.setItem('nipo_laundry_week_start', cloudData.weekStart);
        } else if (cloudData.weekStart !== mondayKey) {
          // Cloud state is from a previous week! Automated week reset for Sunday 23:59 rollover
          const freshSlots = {};
          setSlots(freshSlots);
          setWeekStart(mondayKey);
          localStorage.setItem('nipo_laundry_slots', JSON.stringify(freshSlots));
          localStorage.setItem('nipo_laundry_week_start', mondayKey);
          syncToCloud(freshSlots, mondayKey);
        }
      }
    } catch (e) {
      console.warn("Erro ao buscar dados na nuvem", e);
    } finally {
      setIsSyncing(false);
    }
  };

  const syncToCloud = async (newSlots, newWeekStart) => {
    const timestamp = Date.now();
    lastSyncTimestamp.current = timestamp;
    const weekStartToSave = newWeekStart || weekStart || mondayKey;
    const payload = {
      weekStart: weekStartToSave,
      slots: newSlots,
      updatedAt: timestamp
    };

    try {
      setIsSyncing(true);
      await fetch(SYNC_API_ENDPOINT, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (e) {
      console.warn("Erro ao sincronizar com nuvem", e);
    } finally {
      setIsSyncing(false);
    }
  };

  // 4. Polling & Window Focus Listener
  useEffect(() => {
    fetchCloudState();
    const interval = setInterval(fetchCloudState, 12000); // 12 seconds interval
    const handleFocus = () => fetchCloudState();
    window.addEventListener('focus', handleFocus);
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [mondayKey]);

  // 5. Background Clock & Automated Rules Check (Every 1 second)
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);

      const hours = now.getHours();
      const minutes = now.getMinutes();
      const currentMinutes = hours * 60 + minutes;
      const isSunday = now.getDay() === 0;

      // RULE 1: Automatic Reset every Sunday at 23:59
      if (isSunday && hours === 23 && minutes >= 59) {
        if (Object.keys(slots).length > 0) {
          const emptySlots = {};
          setSlots(emptySlots);
          localStorage.setItem('nipo_laundry_slots', JSON.stringify(emptySlots));
          syncToCloud(emptySlots, mondayKey);
          return;
        }
      }

      // RULE 2: Auto-Release unconfirmed slots for TODAY (Tolerance: up to 25 min after slot start)
      let needsAutoRelease = false;
      const updatedSlots = { ...slots };

      Object.keys(updatedSlots).forEach(key => {
        const booking = updatedSlots[key];
        if (booking && !booking.confirmed) {
          const parts = key.split('_');
          let slotDateKey = todayDateKey;
          let slotTime = "08:00";

          if (parts.length >= 3) {
            slotDateKey = parts[0];
            slotTime = parts[2];
          } else if (parts.length === 2) {
            slotTime = parts[1];
          }

          // Auto-release only applies to slots on TODAY
          if (slotDateKey === todayDateKey) {
            const config = SLOT_CONFIGS[slotTime];
            if (config && currentMinutes > config.closeMin) {
              delete updatedSlots[key];
              needsAutoRelease = true;
            }
          }
        }
      });

      if (needsAutoRelease) {
        setSlots(updatedSlots);
        localStorage.setItem('nipo_laundry_slots', JSON.stringify(updatedSlots));
        syncToCloud(updatedSlots);
      }

    }, 1000);

    return () => clearInterval(timer);
  }, [slots, mondayKey, todayDateKey]);

  // Compute counts of reservations per day
  const bookingsCountByDay = useMemo(() => {
    const counts = {};
    weekDays.forEach(day => { counts[day.dateKey] = 0; });

    Object.keys(slots).forEach(key => {
      if (slots[key] && slots[key].userName) {
        const parts = key.split('_');
        if (parts.length >= 3) {
          const dKey = parts[0];
          if (counts[dKey] !== undefined) {
            counts[dKey]++;
          }
        } else {
          // Legacy key for today
          if (counts[todayDateKey] !== undefined) {
            counts[todayDateKey]++;
          }
        }
      }
    });

    return counts;
  }, [slots, weekDays, todayDateKey]);

  // Actions
  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('nipo_laundry_theme', nextTheme);
  };

  const handleSaveUserName = (name) => {
    setCurrentUserName(name);
    localStorage.setItem('nipo_laundry_user_name', name);
  };

  const handleAdminLogin = () => {
    setIsAdmin(true);
    sessionStorage.setItem('nipo_laundry_admin_auth', 'true');
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    sessionStorage.removeItem('nipo_laundry_admin_auth');
  };

  // Open booking modal
  const handleOpenBookModal = (machineId, time, dateKey, dayName) => {
    setTargetSlot({ 
      machineId, 
      time, 
      dateKey: dateKey || selectedDateKey, 
      dayName: dayName || selectedDay.dayName 
    });
    setBookingModalOpen(true);
  };

  // Confirm booking submission
  const handleConfirmBooking = (machineId, time, dateKey, name) => {
    handleSaveUserName(name);

    const slotKey = `${dateKey}_${machineId}_${time}`;
    const isToday = dateKey === todayDateKey;
    const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
    const config = SLOT_CONFIGS[time];
    const isWindowOpen = isToday && config && (currentMinutes >= config.openMin && currentMinutes <= config.closeMin);

    const newBooking = {
      userName: name,
      bookedAt: currentTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      confirmed: isWindowOpen, // If booking directly during the window today, auto-confirm
      confirmedAt: isWindowOpen ? currentTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : null
    };

    const nextSlots = {
      ...slots,
      [slotKey]: newBooking
    };

    setSlots(nextSlots);
    localStorage.setItem('nipo_laundry_slots', JSON.stringify(nextSlots));
    syncToCloud(nextSlots);
  };

  // Confirm attendance (Check-in)
  const handleConfirmAttendance = (machineId, time, dateKey) => {
    const keyWithDate = `${dateKey}_${machineId}_${time}`;
    const legacyKey = `${machineId}_${time}`;
    const targetKey = slots[keyWithDate] ? keyWithDate : (slots[legacyKey] ? legacyKey : keyWithDate);
    const existing = slots[targetKey];
    if (!existing) return;

    const updatedBooking = {
      ...existing,
      confirmed: true,
      confirmedAt: currentTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    const nextSlots = {
      ...slots,
      [targetKey]: updatedBooking
    };

    setSlots(nextSlots);
    localStorage.setItem('nipo_laundry_slots', JSON.stringify(nextSlots));
    syncToCloud(nextSlots);
  };

  // Cancel reservation
  const handleCancelBooking = (machineId, time, dateKey, dayName) => {
    const keyWithDate = `${dateKey}_${machineId}_${time}`;
    const legacyKey = `${machineId}_${time}`;
    const targetKey = slots[keyWithDate] ? keyWithDate : (slots[legacyKey] ? legacyKey : keyWithDate);
    const existing = slots[targetKey];
    const name = existing ? existing.userName : 'este horário';

    if (window.confirm(`Deseja realmente liberar a Máquina ${machineId} às ${time} (${name})?`)) {
      const nextSlots = { ...slots };
      delete nextSlots[targetKey];

      setSlots(nextSlots);
      localStorage.setItem('nipo_laundry_slots', JSON.stringify(nextSlots));
      syncToCloud(nextSlots);
    }
  };

  // Admin: Reset entire week
  const handleResetEntireWeek = () => {
    const empty = {};
    setSlots(empty);
    localStorage.setItem('nipo_laundry_slots', JSON.stringify(empty));
    syncToCloud(empty);
  };

  // Admin: Reset selected day
  const handleResetSelectedDay = () => {
    const nextSlots = { ...slots };
    const prefix = `${selectedDateKey}_`;

    Object.keys(nextSlots).forEach(key => {
      if (key.startsWith(prefix)) {
        delete nextSlots[key];
      } else if (selectedDateKey === todayDateKey && !key.includes('-')) {
        // Legacy keys for today
        delete nextSlots[key];
      }
    });

    setSlots(nextSlots);
    localStorage.setItem('nipo_laundry_slots', JSON.stringify(nextSlots));
    syncToCloud(nextSlots);
  };

  const totalWeekBookings = Object.keys(slots).filter(k => slots[k] && slots[k].userName).length;

  return (
    <div style={{ minHeight: '100vh', padding: '16px 12px 48px 12px' }}>
      <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
        
        {/* Top Header */}
        <Header 
          currentUserName={currentUserName}
          onEditUserName={() => setUserNameModalOpen(true)}
          theme={theme}
          toggleTheme={toggleTheme}
          currentTime={currentTime}
          isSyncing={isSyncing}
          onManualRefresh={fetchCloudState}
          isAdmin={isAdmin}
          onOpenAdmin={() => setAdminModalOpen(true)}
        />

        {/* Rules Explainer */}
        <RulesBanner />

        {/* 7-Day Week Navigation Pill Bar */}
        <WeekSelector 
          weekDays={weekDays}
          selectedDateKey={selectedDateKey}
          onSelectDate={setSelectedDateKey}
          todayDateKey={todayDateKey}
          bookingsCountByDay={bookingsCountByDay}
        />

        {/* 3 Machines Grid (1, 2, 4) for the selected day */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
          gap: '18px',
          marginBottom: '20px'
        }}>
          {MACHINES.map(mId => (
            <MachineColumn
              key={`${selectedDateKey}_${mId}`}
              machineId={mId}
              slots={slots}
              dateKey={selectedDateKey}
              todayDateKey={todayDateKey}
              dayName={selectedDay.dayName}
              currentTime={currentTime}
              currentUserName={currentUserName}
              isAdmin={isAdmin}
              onBook={handleOpenBookModal}
              onConfirm={handleConfirmAttendance}
              onCancel={handleCancelBooking}
            />
          ))}
        </div>

        {/* Action Bar & Stats */}
        <ActionBar 
          slots={slots}
          selectedDateKey={selectedDateKey}
          selectedDayName={selectedDay.dayName}
          todayDateKey={todayDateKey}
          isAdmin={isAdmin}
          onOpenAdmin={() => setAdminModalOpen(true)}
          onResetBoard={handleResetSelectedDay}
        />

        {/* Footer */}
        <footer style={{
          textAlign: 'center',
          marginTop: '36px',
          paddingTop: '20px',
          borderTop: '1px solid var(--border-color)',
          color: 'var(--text-muted)',
          fontSize: '0.85rem'
        }}>
          <p style={{ marginBottom: '4px' }}>
            🧺 <strong>Nipo Lavanderia</strong> • Máquinas 1, 2 e 4 • Agendamento Semanal
          </p>
          <p style={{ fontSize: '0.75rem' }}>
            Reset automático todo domingo às 23:59 • Confirmação de presença até 25min após o horário • Senha Admin: 1531
          </p>
        </footer>

      </div>

      {/* Booking Modal */}
      <BookingModal 
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        targetSlot={targetSlot}
        savedUserName={currentUserName}
        onConfirmBooking={handleConfirmBooking}
      />

      {/* User Name Customization Modal */}
      <UserNameModal 
        isOpen={userNameModalOpen}
        onClose={() => setUserNameModalOpen(false)}
        currentName={currentUserName}
        onSaveName={handleSaveUserName}
      />

      {/* Admin Panel Modal */}
      <AdminModal
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
        isAdmin={isAdmin}
        onLoginSuccess={handleAdminLogin}
        onLogoutAdmin={handleAdminLogout}
        onResetEntireWeek={handleResetEntireWeek}
        onResetSelectedDay={handleResetSelectedDay}
        selectedDayName={selectedDay.dayName}
        totalWeekBookings={totalWeekBookings}
      />

    </div>
  );
};

export default IndexPage;

export const Head = () => (
  <>
    <title>Nipo Lavanderia - Agendamento Semanal das Máquinas de Lavar</title>
    <meta name="description" content="Sistema inteligente de agendamento semanal e confirmação das máquinas de lavar da república Nipo." />
    <meta name="theme-color" content="#0B132B" />
    <link rel="icon" href="/icon.jpg" />
  </>
);
