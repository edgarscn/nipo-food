import React from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

const WeekSelector = ({ 
  weekDays, 
  selectedDateKey, 
  onSelectDate, 
  todayDateKey,
  bookingsCountByDay 
}) => {
  return (
    <div className="glass-panel animate-fade-in" style={{
      marginBottom: '20px',
      padding: '12px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calendar size={18} color="var(--color-primary)" />
          <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
            Selecione o Dia da Semana
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            (Reservas abertas para toda a semana)
          </span>
        </div>

        {selectedDateKey !== todayDateKey && (
          <button 
            onClick={() => onSelectDate(todayDateKey)}
            className="btn btn-secondary"
            style={{ padding: '4px 10px', fontSize: '0.75rem', borderRadius: '14px' }}
          >
            Voltar para Hoje
          </button>
        )}
      </div>

      {/* Week day pills */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(95px, 1fr))',
        gap: '8px'
      }}>
        {weekDays.map((day) => {
          const isSelected = day.dateKey === selectedDateKey;
          const isToday = day.dateKey === todayDateKey;
          const count = bookingsCountByDay[day.dateKey] || 0;

          return (
            <button
              key={day.dateKey}
              onClick={() => onSelectDate(day.dateKey)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '8px 6px',
                borderRadius: 'var(--radius-sm)',
                border: isSelected 
                  ? '2px solid var(--color-primary)' 
                  : isToday 
                    ? '1px solid rgba(0, 180, 216, 0.4)'
                    : '1px solid var(--border-color)',
                background: isSelected 
                  ? 'rgba(0, 180, 216, 0.2)' 
                  : isToday
                    ? 'rgba(0, 180, 216, 0.08)'
                    : 'rgba(255, 255, 255, 0.03)',
                boxShadow: isSelected ? '0 0 12px rgba(0, 180, 216, 0.3)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
            >
              {/* Today indicator badge */}
              {isToday && (
                <span style={{
                  position: 'absolute',
                  top: '-7px',
                  right: '6px',
                  background: 'var(--color-primary)',
                  color: '#0B132B',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  padding: '1px 5px',
                  borderRadius: '10px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em'
                }}>
                  Hoje
                </span>
              )}

              <span style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: isSelected ? 'var(--color-primary)' : 'var(--text-secondary)',
                textTransform: 'capitalize'
              }}>
                {day.shortName}
              </span>

              <span style={{
                fontSize: '1rem',
                fontWeight: 800,
                color: isSelected ? '#FFFFFF' : 'var(--text-primary)',
                margin: '2px 0'
              }}>
                {day.dayNumber}/{day.monthNumber}
              </span>

              <span style={{
                fontSize: '0.7rem',
                color: count > 0 ? (isSelected ? 'var(--color-primary)' : 'var(--text-secondary)') : 'var(--text-muted)',
                fontWeight: count > 0 ? 600 : 400
              }}>
                {count === 0 ? 'Livre' : `${count} ${count === 1 ? 'reserva' : 'reservas'}`}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default WeekSelector;
