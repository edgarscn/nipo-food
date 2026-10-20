import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import RulesBanner from '../components/RulesBanner';
import MachineColumn from '../components/MachineColumn';
import BookingModal from '../components/BookingModal';
import UserNameModal from '../components/UserNameModal';
import ActionBar from '../components/ActionBar';
import '../styles/global.css';

const SYNC_API_ENDPOINT = "https://api.restful-api.dev/objects/ff808181a09d98f701a1594354602d55";
const MACHINES = [1, 2, 4];
const TIMES = ["08:00", "14:00", "21:00"];

const SLOT_MINUTES = {
  "08:00": 480,
  "14:00": 840,
  "21:00": 1260
};

const IndexPage = () => {
  const [theme, setTheme] = useState('dark');
  const [currentUserName, setCurrentUserName] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [slots, setSlots] = useState({});
  const [boardDate, setBoardDate] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  // Modals
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [targetSlot, setTargetSlot] = useState(null);
  const [userNameModalOpen, setUserNameModalOpen] = useState(false);

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

      const savedDate = localStorage.getItem('nipo_laundry_date');
      const savedSlots = localStorage.getItem('nipo_laundry_slots');

      const today = new Date().toLocaleDateString('pt-BR');
      if (savedDate === today && savedSlots) {
        setBoardDate(savedDate);
        setSlots(JSON.parse(savedSlots));
      } else {
        setBoardDate(today);
        setSlots({});
      }
    } catch (e) {
      console.error("Erro ao carregar dados locais", e);
    }
  }, []);

  // 3. Real-Time Cloud Synchronization
  const fetchCloudState = async () => {
    try {
      setIsSyncing(true);
      const res = await fetch(SYNC_API_ENDPOINT, { cache: 'no-store' });
      if (!res.ok) return;
      const json = await res.json();
      const cloudData = json.data;
      if (cloudData && cloudData.updatedAt && cloudData.updatedAt > lastSyncTimestamp.current) {
        lastSyncTimestamp.current = cloudData.updatedAt;
        const today = new Date().toLocaleDateString('pt-BR');

        // Check if cloud state is from today or needs daily reset
        if (cloudData.date === today && cloudData.slots) {
          setSlots(cloudData.slots);
          setBoardDate(cloudData.date);
          localStorage.setItem('nipo_laundry_slots', JSON.stringify(cloudData.slots));
          localStorage.setItem('nipo_laundry_date', cloudData.date);
        } else if (cloudData.date !== today) {
          // Cloud state is from another day, reset for today
          const freshSlots = {};
          setSlots(freshSlots);
          setBoardDate(today);
          syncToCloud(freshSlots, today);
        }
      }
    } catch (e) {
      console.warn("Erro ao buscar dados na nuvem", e);
    } finally {
      setIsSyncing(false);
    }
  };

  const syncToCloud = async (newSlots, newDate) => {
    const timestamp = Date.now();
    lastSyncTimestamp.current = timestamp;
    const dateToSave = newDate || boardDate || new Date().toLocaleDateString('pt-BR');
    const payload = {
      name: "nipo_laundry",
      data: {
        date: dateToSave,
        slots: newSlots,
        updatedAt: timestamp
      }
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

  // 4. Polling & Focus listener
  useEffect(() => {
    fetchCloudState();
    const interval = setInterval(fetchCloudState, 3500);
    const handleFocus = () => fetchCloudState();
    window.addEventListener('focus', handleFocus);
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [boardDate]);

  // 5. Background Clock & Automated Rules Check (Every 1 second)
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);

      const today = now.toLocaleDateString('pt-BR');
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const currentMinutes = hours * 60 + minutes;

      // RULE 1: Daily Reset at 23:59 or when date changes
      if (currentMinutes >= 23 * 60 + 59 || (boardDate && boardDate !== today)) {
        if (Object.keys(slots).length > 0) {
          const emptySlots = {};
          setSlots(emptySlots);
          setBoardDate(today);
          localStorage.setItem('nipo_laundry_slots', JSON.stringify(emptySlots));
          localStorage.setItem('nipo_laundry_date', today);
          syncToCloud(emptySlots, today);
          return;
        }
      }

      // RULE 2: Auto-Release unconfirmed slots (Tolerance window: 25 min after slot)
      let needsAutoRelease = false;
      const updatedSlots = { ...slots };

      Object.keys(updatedSlots).forEach(key => {
        const booking = updatedSlots[key];
        if (booking && !booking.confirmed) {
          const parts = key.split('_');
          const slotTime = parts[1]; // e.g. "08:00"
          const slotMin = SLOT_MINUTES[slotTime];

          if (slotMin !== undefined) {
            const windowCloseMin = slotMin + 25; // 25min após o horário marcado
            // If current time passed windowCloseMin and booking was not confirmed:
            if (currentMinutes > windowCloseMin) {
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
  }, [slots, boardDate]);

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

  // Open booking modal for slot
  const handleOpenBookModal = (machineId, time) => {
    setTargetSlot({ machineId, time });
    setBookingModalOpen(true);
  };

  // Confirm booking submission
  const handleConfirmBooking = (machineId, time, name) => {
    handleSaveUserName(name);

    const slotKey = `${machineId}_${time}`;
    const slotMin = SLOT_MINUTES[time];
    const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();

    const windowOpenMin = slotMin - 120;
    const windowCloseMin = slotMin + 25;
    const isWindowOpen = currentMinutes >= windowOpenMin && currentMinutes <= windowCloseMin;

    const newBooking = {
      userName: name,
      bookedAt: currentTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      confirmed: isWindowOpen, // If booking directly during the window, auto-confirm
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
  const handleConfirmAttendance = (machineId, time) => {
    const slotKey = `${machineId}_${time}`;
    const existing = slots[slotKey];
    if (!existing) return;

    const updatedBooking = {
      ...existing,
      confirmed: true,
      confirmedAt: currentTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    const nextSlots = {
      ...slots,
      [slotKey]: updatedBooking
    };

    setSlots(nextSlots);
    localStorage.setItem('nipo_laundry_slots', JSON.stringify(nextSlots));
    syncToCloud(nextSlots);
  };

  // Cancel reservation
  const handleCancelBooking = (machineId, time) => {
    const slotKey = `${machineId}_${time}`;
    const existing = slots[slotKey];
    const name = existing ? existing.userName : 'este horário';

    if (window.confirm(`Deseja realmente liberar a Máquina ${machineId} às ${time} (${name})?`)) {
      const nextSlots = { ...slots };
      delete nextSlots[slotKey];

      setSlots(nextSlots);
      localStorage.setItem('nipo_laundry_slots', JSON.stringify(nextSlots));
      syncToCloud(nextSlots);
    }
  };

  // Reset entire board
  const handleResetEntireBoard = () => {
    const empty = {};
    setSlots(empty);
    localStorage.setItem('nipo_laundry_slots', JSON.stringify(empty));
    syncToCloud(empty);
  };

  return (
    <div style={{ minHeight: '100vh', padding: '16px 12px 48px 12px' }}>
      <div style={{ maxWidth: '1020px', margin: '0 auto' }}>
        
        {/* Top Header */}
        <Header 
          currentUserName={currentUserName}
          onEditUserName={() => setUserNameModalOpen(true)}
          theme={theme}
          toggleTheme={toggleTheme}
          currentTime={currentTime}
          isSyncing={isSyncing}
          onManualRefresh={fetchCloudState}
        />

        {/* Rules Explainer */}
        <RulesBanner />

        {/* 3 Machines Grid (1, 2, 4) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
          gap: '18px',
          marginBottom: '20px'
        }}>
          {MACHINES.map(mId => (
            <MachineColumn
              key={mId}
              machineId={mId}
              slots={slots}
              currentTime={currentTime}
              currentUserName={currentUserName}
              onBook={handleOpenBookModal}
              onConfirm={handleConfirmAttendance}
              onCancel={handleCancelBooking}
            />
          ))}
        </div>

        {/* Action Bar & Stats */}
        <ActionBar 
          slots={slots}
          onResetBoard={handleResetEntireBoard}
          currentDateStr={currentTime.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
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
            🧺 <strong>Nipo Lavanderia</strong> • Máquinas 1, 2 e 4
          </p>
          <p style={{ fontSize: '0.75rem' }}>
            Reset automático diário às 23:59 • Confirmação obrigatória até 25min após o horário.
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

    </div>
  );
};

export default IndexPage;

export const Head = () => (
  <>
    <title>Nipo Lavanderia - Agendamento das Máquinas de Lavar</title>
    <meta name="description" content="Sistema inteligente de agendamento e confirmação das máquinas de lavar da república Nipo." />
    <meta name="theme-color" content="#0B132B" />
    <link rel="icon" href="/icon.jpg" />
  </>
);
