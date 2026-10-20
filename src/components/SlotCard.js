import React from 'react';
import { Clock, CheckCircle2, AlertTriangle, User, Plus, X, Sun, Sunset, Moon, Sparkles, Calendar, ShieldCheck } from 'lucide-react';

const SLOT_CONFIGS = {
  "08:00": { 
    minutes: 480, 
    period: "Manhã", 
    windowOpen: "6:30", 
    windowClose: "8h25", 
    openMin: 390, 
    closeMin: 505, 
    icon: Sun, 
    color: "#00B4D8" 
  },
  "14:00": { 
    minutes: 840, 
    period: "Tarde", 
    windowOpen: "12:30", 
    windowClose: "14h25", 
    openMin: 750, 
    closeMin: 865, 
    icon: Sunset, 
    color: "#F59E0B" 
  },
  "21:00": { 
    minutes: 1260, 
    period: "Noite", 
    windowOpen: "19:30", 
    windowClose: "21h25", 
    openMin: 1170, 
    closeMin: 1285, 
    icon: Moon, 
    color: "#8B5CF6" 
  }
};

const SlotCard = ({ 
  machineId, 
  time, 
  dateKey,
  todayDateKey,
  dayName,
  booking, 
  currentTime, 
  currentUserName, 
  isAdmin,
  onBook, 
  onConfirm, 
  onCancel 
}) => {
  const config = SLOT_CONFIGS[time] || { 
    minutes: 0, 
    period: "", 
    windowOpen: "", 
    windowClose: "",
    openMin: 0,
    closeMin: 0
  };

  const isToday = dateKey === todayDateKey;
  const isFutureDay = dateKey > todayDateKey;
  const isPastDay = dateKey < todayDateKey;

  const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();

  // Confirmation window only applies on the actual day
  const isWindowOpen = isToday && (currentMinutes >= config.openMin && currentMinutes <= config.closeMin);
  const isPastSlotToday = isToday && (currentMinutes > (config.minutes + 150));

  const PeriodIcon = config.icon || Clock;

  // Render when slot is FREE
  if (!booking) {
    return (
      <div className="slot-card free animate-fade-in" style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '145px',
        gap: '12px',
        opacity: isPastDay ? 0.6 : 1
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(0, 180, 216, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-primary)'
            }}>
              <PeriodIcon size={18} />
            </div>
            <div>
              <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
                {time}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '6px' }}>
                {config.period}
              </span>
            </div>
          </div>

          <span style={{
            fontSize: '0.75rem',
            padding: '3px 8px',
            borderRadius: '12px',
            background: isPastDay ? 'rgba(255, 255, 255, 0.05)' : 'rgba(16, 185, 129, 0.12)',
            color: isPastDay ? 'var(--text-muted)' : 'var(--color-success)',
            fontWeight: 700,
            border: `1px solid ${isPastDay ? 'var(--border-color)' : 'rgba(16, 185, 129, 0.3)'}`
          }}>
            {isPastDay ? 'Encerrado' : 'Livre ✨'}
          </span>
        </div>

        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {isPastDay ? (
            <span>Dia já transcorrido</span>
          ) : isFutureDay ? (
            <span>Disponível para {dayName}</span>
          ) : isPastSlotToday ? (
            <span>Horário de hoje já transcorrido</span>
          ) : (
            <span>Confirmação: {config.windowOpen} até {config.windowClose}</span>
          )}
        </div>

        {isPastDay ? (
          <button 
            disabled
            className="btn btn-secondary"
            style={{ width: '100%', padding: '9px 14px', fontSize: '0.85rem', opacity: 0.5, cursor: 'not-allowed' }}
          >
            Encerrado
          </button>
        ) : (
          <button 
            onClick={() => onBook(machineId, time, dateKey, dayName)}
            className="btn btn-primary"
            style={{ width: '100%', padding: '9px 14px', fontSize: '0.85rem' }}
          >
            <Plus size={16} /> Reservar Horário
          </button>
        )}
      </div>
    );
  }

  // Render when slot is BOOKED
  const isConfirmed = booking.confirmed;
  const isCurrentUser = currentUserName && booking.userName && booking.userName.toLowerCase() === currentUserName.toLowerCase();

  return (
    <div className={`slot-card booked ${isConfirmed ? 'confirmed' : (isWindowOpen ? 'needs-confirmation' : '')} animate-fade-in`} style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      minHeight: '145px',
      gap: '12px',
      opacity: isPastDay ? 0.75 : 1
    }}>
      
      {/* Top Header */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: isConfirmed ? 'rgba(16, 185, 129, 0.2)' : 'rgba(0, 180, 216, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isConfirmed ? 'var(--color-success)' : 'var(--color-primary)'
            }}>
              <PeriodIcon size={18} />
            </div>
            <div>
              <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
                {time}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '6px' }}>
                {config.period}
              </span>
            </div>
          </div>

          {/* Status Badge */}
          {isPastDay ? (
            <span style={{
              fontSize: '0.75rem',
              padding: '3px 8px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.08)',
              color: 'var(--text-muted)',
              fontWeight: 600
            }}>
              Concluído
            </span>
          ) : isConfirmed ? (
            <span style={{
              fontSize: '0.75rem',
              padding: '3px 8px',
              borderRadius: '12px',
              background: 'rgba(16, 185, 129, 0.2)',
              color: 'var(--color-success)',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              border: '1px solid var(--color-success)'
            }}>
              <CheckCircle2 size={12} /> Confirmado
            </span>
          ) : isWindowOpen ? (
            <span style={{
              fontSize: '0.75rem',
              padding: '3px 8px',
              borderRadius: '12px',
              background: 'rgba(245, 158, 11, 0.2)',
              color: 'var(--color-warning)',
              fontWeight: 800,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              border: '1px solid var(--color-warning)'
            }}>
              <AlertTriangle size={12} /> Confirmar Agora!
            </span>
          ) : isFutureDay ? (
            <span style={{
              fontSize: '0.75rem',
              padding: '3px 8px',
              borderRadius: '12px',
              background: 'rgba(0, 180, 216, 0.15)',
              color: 'var(--color-primary)',
              fontWeight: 700,
              border: '1px solid var(--border-color)'
            }}>
              Agendado
            </span>
          ) : (
            <span style={{
              fontSize: '0.75rem',
              padding: '3px 8px',
              borderRadius: '12px',
              background: 'rgba(0, 180, 216, 0.15)',
              color: 'var(--color-primary)',
              fontWeight: 600,
              border: '1px solid var(--border-color)'
            }}>
              Aguardando Horário
            </span>
          )}
        </div>

        {/* Resident Name & Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '26px',
            height: '26px',
            borderRadius: '50%',
            background: isConfirmed ? 'var(--color-success)' : 'var(--color-primary)',
            color: '#0B132B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.75rem',
            fontWeight: 800
          }}>
            {booking.userName ? booking.userName.charAt(0).toUpperCase() : "?"}
          </div>
          <div>
            <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)', margin: 0, lineHeight: 1.2 }}>
              {booking.userName} {isCurrentUser && <span style={{ fontSize: '0.75rem', color: 'var(--color-primary)' }}>(Você)</span>}
            </h4>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              {isPastDay ? (
                `Reservado para ${dayName}`
              ) : isConfirmed ? (
                `Confirmado às ${booking.confirmedAt || 'hoje'}`
              ) : isWindowOpen ? (
                `Confirmação fecha às ${config.windowClose}!`
              ) : isFutureDay ? (
                `Confirmação no dia (${config.windowOpen} até ${config.windowClose})`
              ) : (
                `Confirmar de ${config.windowOpen} até ${config.windowClose}`
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '8px' }}>
        
        {/* If pending confirmation & window is open: BIG Confirm Button! */}
        {!isConfirmed && isWindowOpen && (
          <button 
            onClick={() => onConfirm(machineId, time, dateKey)}
            className="btn btn-warning"
            style={{ flex: 1, padding: '8px 12px', fontSize: '0.85rem', fontWeight: 800 }}
          >
            <CheckCircle2 size={16} /> Confirmar Uso
          </button>
        )}

        {/* Already Confirmed Banner */}
        {isConfirmed && !isPastDay && (
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.8rem',
            color: 'var(--color-success)',
            fontWeight: 600
          }}>
            <Sparkles size={14} /> Presença Garantida
          </div>
        )}

        {/* Future day notice */}
        {isFutureDay && !isConfirmed && (
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            fontSize: '0.75rem',
            color: 'var(--text-muted)'
          }}>
            Confirmar no dia às {config.windowOpen}
          </div>
        )}

        {/* Past day notice */}
        {isPastDay && (
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            fontSize: '0.75rem',
            color: 'var(--text-muted)'
          }}>
            Agendamento encerrado
          </div>
        )}

        {/* Cancel / Release Button */}
        <button 
          onClick={() => onCancel(machineId, time, dateKey, dayName)}
          className="btn btn-danger"
          style={{ padding: '8px 10px', fontSize: '0.8rem' }}
          title={isAdmin ? "Liberar este horário (Ação de Administrador)" : "Liberar este horário"}
        >
          {isAdmin ? <ShieldCheck size={14} /> : <X size={15} />}
          <span style={{ marginLeft: '4px' }}>Liberar</span>
        </button>

      </div>

    </div>
  );
};

export default SlotCard;
