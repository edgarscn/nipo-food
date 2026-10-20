import React from 'react';
import SlotCard from './SlotCard';
import { Waves } from 'lucide-react';

const TIMES = ["08:00", "14:00", "21:00"];

const MachineColumn = ({ 
  machineId, 
  slots = {}, 
  dateKey,
  todayDateKey,
  dayName,
  currentTime, 
  currentUserName, 
  isAdmin,
  onBook, 
  onConfirm, 
  onCancel 
}) => {
  const isToday = dateKey === todayDateKey;
  const isPastDay = dateKey < todayDateKey;
  const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();

  // Count how many slots are open and can actually be reserved right now
  const availableSlotsCount = TIMES.filter(time => {
    const keyWithDate = `${dateKey}_${machineId}_${time}`;
    const legacyKey = `${machineId}_${time}`;
    const booking = slots[keyWithDate] || (isToday ? slots[legacyKey] : null);
    
    // If booked, not free
    if (booking) return false;
    // If in the past, not available
    if (isPastDay) return false;
    // If today and passed lock limit, not available
    if (isToday) {
      const lockMin = time === "08:00" ? 540 : (time === "14:00" ? 900 : 1320);
      if (currentMinutes > lockMin) return false;
    }
    return true;
  }).length;

  return (
    <div className="glass-panel animate-fade-in" style={{
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }}>
      
      {/* Machine Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: '12px',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: availableSlotsCount > 0 
              ? 'linear-gradient(135deg, rgba(0, 180, 216, 0.2) 0%, rgba(0, 119, 182, 0.3) 100%)'
              : 'rgba(100, 116, 139, 0.15)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: availableSlotsCount > 0 ? 'var(--color-primary)' : '#94A3B8'
          }}>
            <Waves size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', color: availableSlotsCount > 0 ? 'var(--text-primary)' : 'var(--text-secondary)', margin: 0 }}>
              Máquina {machineId}
            </h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {isPastDay ? (
                "Dia encerrado"
              ) : availableSlotsCount === 0 ? (
                "Sem horários livres"
              ) : availableSlotsCount === 1 ? (
                "1 horário disponível"
              ) : (
                `${availableSlotsCount} horários disponíveis`
              )}
            </span>
          </div>
        </div>

        <span style={{
          fontSize: '0.8rem',
          fontWeight: 700,
          padding: '4px 10px',
          borderRadius: '12px',
          background: availableSlotsCount === 0 ? 'rgba(100, 116, 139, 0.15)' : 'rgba(0, 180, 216, 0.15)',
          color: availableSlotsCount === 0 ? '#94A3B8' : 'var(--color-primary)',
          border: `1px solid ${availableSlotsCount === 0 ? 'rgba(100, 116, 139, 0.3)' : 'var(--border-color)'}`
        }}>
          {availableSlotsCount === 0 ? "Indisponível" : "Disponível"}
        </span>
      </div>

      {/* The 3 slots (08:00, 14:00, 21:00) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {TIMES.map(time => {
          const keyWithDate = `${dateKey}_${machineId}_${time}`;
          const legacyKey = `${machineId}_${time}`;
          const booking = slots[keyWithDate] || (isToday ? slots[legacyKey] : null);

          return (
            <SlotCard
              key={`${dateKey}_${machineId}_${time}`}
              machineId={machineId}
              time={time}
              dateKey={dateKey}
              todayDateKey={todayDateKey}
              dayName={dayName}
              booking={booking}
              currentTime={currentTime}
              currentUserName={currentUserName}
              isAdmin={isAdmin}
              onBook={onBook}
              onConfirm={onConfirm}
              onCancel={onCancel}
            />
          );
        })}
      </div>

    </div>
  );
};

export default MachineColumn;
