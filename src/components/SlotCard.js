import React from 'react';
import { Clock, CheckCircle2, AlertTriangle, User, Plus, X, Sun, Sunset, Moon, Sparkles, Calendar, ShieldCheck, Lock, Zap } from 'lucide-react';

const SLOT_CONFIGS = {
  "08:00": { 
    minutes: 480, 
    period: "Manhã", 
    windowOpen: "6:30", 
    windowClose: "8h25", 
    lockTime: "09:00",
    openMin: 390, 
    closeMin: 505, 
    lockMin: 540,
    icon: Sun, 
    color: "#00B4D8" 
  },
  "14:00": { 
    minutes: 840, 
    period: "Tarde", 
    windowOpen: "12:30", 
    windowClose: "14h25", 
    lockTime: "15:00",
    openMin: 750, 
    closeMin: 865, 
    lockMin: 900,
    icon: Sunset, 
    color: "#F59E0B" 
  },
  "21:00": { 
    minutes: 1260, 
    period: "Noite", 
    windowOpen: "19:30", 
    windowClose: "21h25", 
    lockTime: "22:00",
    openMin: 1170, 
    closeMin: 1285, 
    lockMin: 1320,
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
    lockTime: "",
    openMin: 0,
    closeMin: 0,
    lockMin: 0
  };

  const isToday = dateKey === todayDateKey;
  const isFutureDay = dateKey > todayDateKey;
  const isPastDay = dateKey < todayDateKey;

  const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();

  // Confirmation window only applies on the actual day
  const isWindowOpen = isToday && (currentMinutes >= config.openMin && currentMinutes <= config.closeMin);
  
  // Last-minute window: between closeMin (e.g. 8h25) and lockMin (e.g. 9h00)
  const isLastChanceWindow = isToday && (currentMinutes > config.closeMin && currentMinutes <= config.lockMin);
  
  // Locked: after lockMin on today (e.g. after 9h00, 15h00, 22h00)
  const isLocked = isToday && (currentMinutes > config.lockMin);

  const PeriodIcon = config.icon || Clock;

  // ==========================================
  // Render when slot is FREE (UNBOOKED)
  // ==========================================
  if (!booking) {
    return (
      <div className={`slot-card free ${isLastChanceWindow ? 'needs-confirmation' : ''} animate-fade-in`} style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '155px',
        gap: '12px',
        opacity: (isPastDay || isLocked) ? 0.6 : 1,
        border: isLastChanceWindow ? '1px solid rgba(245, 158, 11, 0.6)' : undefined,
        background: isLastChanceWindow ? 'rgba(245, 158, 11, 0.05)' : undefined
      }}>
        
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: isLastChanceWindow ? 'rgba(245, 158, 11, 0.2)' : 'rgba(0, 180, 216, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isLastChanceWindow ? '#F59E0B' : 'var(--color-primary)'
            }}>
              {isLastChanceWindow ? <Zap size={18} /> : <PeriodIcon size={18} />}
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
              background: 'rgba(255, 255, 255, 0.05)',
              color: 'var(--text-muted)',
              fontWeight: 700,
              border: '1px solid var(--border-color)'
            }}>
              Encerrado
            </span>
          ) : isLocked ? (
            <span style={{
              fontSize: '0.75rem',
              padding: '3px 8px',
              borderRadius: '12px',
              background: 'rgba(239, 68, 68, 0.12)',
              color: 'var(--color-danger)',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              border: '1px solid rgba(239, 68, 68, 0.3)'
            }}>
              <Lock size={12} /> Trancado
            </span>
          ) : isLastChanceWindow ? (
            <span style={{
              fontSize: '0.75rem',
              padding: '3px 8px',
              borderRadius: '12px',
              background: 'rgba(245, 158, 11, 0.2)',
              color: '#F59E0B',
              fontWeight: 800,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              border: '1px solid #F59E0B'
            }}>
              <Zap size={12} /> Vaga Liberada!
            </span>
          ) : (
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
          )}
        </div>

        {/* Message / Notice */}
        <div style={{ fontSize: '0.8rem', lineHeight: 1.4 }}>
          {isPastDay ? (
            <span style={{ color: 'var(--text-muted)' }}>Dia já transcorrido</span>
          ) : isLocked ? (
            <span style={{ color: 'var(--color-danger)' }}>
              🔒 <strong>Trancado às {config.lockTime}:</strong> Este horário não está mais disponível para reservas.
            </span>
          ) : isLastChanceWindow ? (
            <span style={{ color: '#F59E0B' }}>
              ⚡ <strong>Vaga liberada!</strong> Você tem até às <strong>{config.lockTime}</strong> para reservar e usar. Às {config.lockTime} o horário será trancado!
            </span>
          ) : isFutureDay ? (
            <span style={{ color: 'var(--text-secondary)' }}>Disponível para agendamento em {dayName}</span>
          ) : (
            <span style={{ color: 'var(--text-muted)' }}>Confirmação: {config.windowOpen} até {config.windowClose}</span>
          )}
        </div>

        {/* Action Button */}
        {isPastDay ? (
          <button 
            disabled
            className="btn btn-secondary"
            style={{ width: '100%', padding: '9px 14px', fontSize: '0.85rem', opacity: 0.5, cursor: 'not-allowed' }}
          >
            Encerrado
          </button>
        ) : isLocked ? (
          <button 
            disabled
            className="btn btn-secondary"
            style={{ width: '100%', padding: '9px 14px', fontSize: '0.85rem', opacity: 0.5, cursor: 'not-allowed' }}
          >
            <Lock size={15} /> Horário Trancado
          </button>
        ) : isLastChanceWindow ? (
          <button 
            onClick={() => onBook(machineId, time, dateKey, dayName, true, config.lockTime)}
            className="btn btn-warning"
            style={{ width: '100%', padding: '9px 14px', fontSize: '0.85rem', fontWeight: 800 }}
          >
            <Zap size={16} /> Reservar e Usar Agora (até {config.lockTime})
          </button>
        ) : (
          <button 
            onClick={() => onBook(machineId, time, dateKey, dayName, false, config.lockTime)}
            className="btn btn-primary"
            style={{ width: '100%', padding: '9px 14px', fontSize: '0.85rem' }}
          >
            <Plus size={16} /> Reservar Horário
          </button>
        )}
      </div>
    );
  }

  // ==========================================
  // Render when slot is BOOKED
  // ==========================================
  const isConfirmed = booking.confirmed;
  const isCurrentUser = currentUserName && booking.userName && booking.userName.toLowerCase() === currentUserName.toLowerCase();

  return (
    <div className={`slot-card booked ${isConfirmed ? 'confirmed' : (isWindowOpen ? 'needs-confirmation' : '')} animate-fade-in`} style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      minHeight: '155px',
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
