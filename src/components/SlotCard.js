import React from 'react';
import { Clock, CheckCircle2, AlertTriangle, User, Plus, X, Sun, Sunset, Moon, Sparkles } from 'lucide-react';

const SLOT_CONFIGS = {
  "08:00": { minutes: 480, period: "Manhã", windowOpen: "06:00", windowClose: "08:25", icon: Sun, color: "#00B4D8" },
  "14:00": { minutes: 840, period: "Tarde", windowOpen: "12:00", windowClose: "14:25", icon: Sunset, color: "#F59E0B" },
  "21:00": { minutes: 1260, period: "Noite", windowOpen: "19:00", windowClose: "21:25", icon: Moon, color: "#8B5CF6" }
};

const SlotCard = ({ 
  machineId, 
  time, 
  booking, 
  currentTime, 
  currentUserName, 
  onBook, 
  onConfirm, 
  onCancel 
}) => {
  const config = SLOT_CONFIGS[time] || { minutes: 0, period: "", windowOpen: "", windowClose: "" };
  const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();

  const windowOpenMin = config.minutes - 120; // 2h antes
  const windowCloseMin = config.minutes + 25;  // 25min depois

  const isWindowOpen = currentMinutes >= windowOpenMin && currentMinutes <= windowCloseMin;
  const isPastSlot = currentMinutes > (config.minutes + 150); // mais de 2h30 após o início

  const PeriodIcon = config.icon || Clock;

  // Render if slot is free
  if (!booking) {
    return (
      <div className="slot-card free animate-fade-in" style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '145px',
        gap: '12px'
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
            background: 'rgba(16, 185, 129, 0.12)',
            color: 'var(--color-success)',
            fontWeight: 700,
            border: '1px solid rgba(16, 185, 129, 0.3)'
          }}>
            Livre ✨
          </span>
        </div>

        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {isPastSlot ? (
            <span>Turno já transcorrido hoje</span>
          ) : (
            <span>Confirmação: {config.windowOpen} às {config.windowClose}</span>
          )}
        </div>

        <button 
          onClick={() => onBook(machineId, time)}
          className="btn btn-primary"
          style={{ width: '100%', padding: '9px 14px', fontSize: '0.85rem' }}
        >
          <Plus size={16} /> Reservar Horário
        </button>
      </div>
    );
  }

  // Render when booked
  const isConfirmed = booking.confirmed;
  const isCurrentUser = currentUserName && booking.userName && booking.userName.toLowerCase() === currentUserName.toLowerCase();

  return (
    <div className={`slot-card booked ${isConfirmed ? 'confirmed' : (isWindowOpen ? 'needs-confirmation' : '')} animate-fade-in`} style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      minHeight: '145px',
      gap: '12px'
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
          {isConfirmed ? (
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
              Agendado
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
              {isConfirmed ? (
                `Confirmado às ${booking.confirmedAt || 'hoje'}`
              ) : isWindowOpen ? (
                `Confirmação fecha às ${config.windowClose}!`
              ) : (
                `Confirmação abre às ${config.windowOpen}`
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
            onClick={() => onConfirm(machineId, time)}
            className="btn btn-warning"
            style={{ flex: 1, padding: '8px 12px', fontSize: '0.85rem', fontWeight: 800 }}
          >
            <CheckCircle2 size={16} /> Confirmar Uso
          </button>
        )}

        {/* Already Confirmed Banner */}
        {isConfirmed && (
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

        {/* If window not open yet */}
        {!isConfirmed && !isWindowOpen && (
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            fontSize: '0.75rem',
            color: 'var(--text-muted)'
          }}>
            Abre às {config.windowOpen}
          </div>
        )}

        {/* Cancel / Release Button */}
        <button 
          onClick={() => onCancel(machineId, time)}
          className="btn btn-danger"
          style={{ padding: '8px 10px', fontSize: '0.8rem' }}
          title="Liberar este horário"
        >
          <X size={15} /> Liberar
        </button>

      </div>

    </div>
  );
};

export default SlotCard;
