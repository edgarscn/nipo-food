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
  // Count how many confirmed/booked slots this machine has on this selected day
  const bookedCount = TIMES.filter(time => {
    const keyWithDate = `${dateKey}_${machineId}_${time}`;
    const legacyKey = `${machineId}_${time}`;
    return slots[keyWithDate] || (dateKey === todayDateKey && slots[legacyKey]);
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
            background: 'linear-gradient(135deg, rgba(0, 180, 216, 0.2) 0%, rgba(0, 119, 182, 0.3) 100%)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-primary)'
          }}>
            <Waves size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', margin: 0 }}>
              Máquina {machineId}
            </h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {bookedCount === 0 ? "3 horários livres" : `${3 - bookedCount} livres de 3`}
            </span>
          </div>
        </div>

        <span style={{
          fontSize: '0.8rem',
          fontWeight: 700,
          padding: '4px 10px',
          borderRadius: '12px',
          background: bookedCount === 3 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(0, 180, 216, 0.15)',
          color: bookedCount === 3 ? 'var(--color-danger)' : 'var(--color-primary)',
          border: `1px solid ${bookedCount === 3 ? 'rgba(239, 68, 68, 0.3)' : 'var(--border-color)'}`
        }}>
          {bookedCount === 3 ? "Ocupada" : "Disponível"}
        </span>
      </div>

      {/* The 3 slots (08:00, 14:00, 21:00) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {TIMES.map(time => {
          const keyWithDate = `${dateKey}_${machineId}_${time}`;
          const legacyKey = `${machineId}_${time}`;
          const booking = slots[keyWithDate] || (dateKey === todayDateKey ? slots[legacyKey] : null);

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
