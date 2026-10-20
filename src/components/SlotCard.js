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
  currentDeviceId,
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
  
  // Last-minute emergency window: between closeMin (e.g. 8h25) and lockMin (e.g. 9h00)
  const isLastChanceWindow = isToday && (currentMinutes > config.closeMin && currentMinutes <= config.lockMin);
  
  // Locked: after lockMin on today (e.g. after 9h00, 15h00, 22h00)
  const isLocked = isToday && (currentMinutes > config.lockMin);

  // If a booking was unconfirmed and passed closeMin on today, treat it as released
  const isUnconfirmedExpired = booking && !booking.confirmed && isToday && (currentMinutes > config.closeMin);
  const effectiveBooking = isUnconfirmedExpired ? null : booking;

  const PeriodIcon = config.icon || Clock;

  // ==========================================
  // 1. FREE (UNBOOKED) OR RELEASED SLOTS
  // ==========================================
  if (!effectiveBooking) {

    // 1A. LOCKED OR PAST SLOTS -> Entire card turns completely GRAY and disabled
    if (isLocked || isPastDay) {
      return (
        <div className="slot-card locked-card animate-fade-in" style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: '155px',
          gap: '12px',
          background: 'rgba(30, 41, 59, 0.55)',
          border: '1px solid rgba(148, 163, 184, 0.25)',
          opacity: 0.65,
          cursor: 'not-allowed'
        }}>
          {/* Top Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(148, 163, 184, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#94A3B8'
              }}>
                <Lock size={17} />
              </div>
              <div>
                <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#94A3B8', lineHeight: 1 }}>
                  {time}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#64748B', marginLeft: '6px' }}>
                  {config.period}
                </span>
              </div>
            </div>

            <span style={{
              fontSize: '0.75rem',
              padding: '3px 8px',
              borderRadius: '12px',
              background: 'rgba(100, 116, 139, 0.2)',
              color: '#94A3B8',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              border: '1px solid rgba(148, 163, 184, 0.3)'
            }}>
              <Lock size={12} /> {isPastDay ? 'Dia Encerrado' : 'Trancado'}
            </span>
          </div>

          {/* Message */}
          <div style={{ fontSize: '0.8rem', color: '#94A3B8', lineHeight: 1.4 }}>
            {isPastDay ? (
              <span>Turno já encerrado neste dia anterior.</span>
            ) : (
              <span>
                🔒 <strong>Trancado às {config.lockTime}:</strong> O horário limite para reserva encerrou. Máquina indisponível para este turno.
              </span>
            )}
          </div>

          {/* Disabled Button */}
          <button 
            disabled
            className="btn btn-secondary"
            style={{ 
              width: '100%', 
              padding: '9px 14px', 
              fontSize: '0.85rem', 
              background: 'rgba(148, 163, 184, 0.12)', 
              color: '#94A3B8', 
              border: '1px solid rgba(148, 163, 184, 0.25)', 
              cursor: 'not-allowed',
              fontWeight: 600
            }}
          >
            <Lock size={15} /> Impossibilitado de Reservar
          </button>
        </div>
      );
    }

    // 1B. LAST-MINUTE EMERGENCY WINDOW (e.g. 8h25 to 9h00)
    if (isLastChanceWindow) {
      return (
        <div className="slot-card free needs-confirmation animate-fade-in" style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: '155px',
          gap: '12px',
          border: '1px solid rgba(245, 158, 11, 0.6)',
          background: 'rgba(245, 158, 11, 0.05)'
        }}>
          {/* Top Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(245, 158, 11, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#F59E0B'
              }}>
                <Zap size={18} />
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
          </div>

          {/* Alert Message */}
          <div style={{ fontSize: '0.8rem', lineHeight: 1.4, color: '#F59E0B' }}>
            ⚡ <strong>Vaga liberada!</strong> Você tem até às <strong>{config.lockTime}</strong> para reservar e usar. Às {config.lockTime} o horário será trancado!
          </div>

          {/* Action Button */}
          <button 
            onClick={() => onBook(machineId, time, dateKey, dayName, true, config.lockTime)}
            className="btn btn-warning"
            style={{ width: '100%', padding: '9px 14px', fontSize: '0.85rem', fontWeight: 800 }}
          >
            <Zap size={16} /> Reservar e Usar Agora (até {config.lockTime})
          </button>
        </div>
      );
    }

    // 1C. STANDARD FREE SLOT (Future days or today before closeMin)
    return (
      <div className="slot-card free animate-fade-in" style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '155px',
        gap: '12px'
      }}>
        {/* Top Header */}
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

        {/* Message */}
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {isFutureDay ? (
            <span>Disponível para agendamento em {dayName}</span>
          ) : (
            <span>Confirmação: {config.windowOpen} até {config.windowClose}</span>
          )}
        </div>

        {/* Action Button */}
        <button 
          onClick={() => onBook(machineId, time, dateKey, dayName, false, config.lockTime)}
          className="btn btn-primary"
          style={{ width: '100%', padding: '9px 14px', fontSize: '0.85rem' }}
        >
          <Plus size={16} /> Reservar Horário
        </button>
      </div>
    );
  }

  // ==========================================
  // 2. BOOKED SLOTS (CONFIRMED OR PENDING CONFIRMATION)
  // ==========================================
  const isConfirmed = effectiveBooking.confirmed;
  
  // Ownership verification: deviceId match OR userName match OR admin
  const isOwner = Boolean(
    isAdmin || 
    (effectiveBooking.deviceId && currentDeviceId && effectiveBooking.deviceId === currentDeviceId) ||
    (currentUserName && effectiveBooking.userName && currentUserName.trim().toLowerCase() === effectiveBooking.userName.trim().toLowerCase())
  );
  const isCurrentUser = isOwner;

  // Colors:
  // - RESERVADO (Pending Confirmation) -> AMARELO (#F59E0B)
  // - CONFIRMADO -> VERMELHO (#EF4444)
  const cardBorderColor = isConfirmed ? '#EF4444' : '#F59E0B';
  const cardBgColor = isConfirmed ? 'rgba(239, 68, 68, 0.25)' : 'rgba(245, 158, 11, 0.25)';
  const cardBgSolid = isConfirmed ? '#2A1115' : '#261D0C';
  const accentColor = isConfirmed ? '#EF4444' : '#F59E0B';
  const iconBgColor = isConfirmed ? 'rgba(239, 68, 68, 0.3)' : 'rgba(245, 158, 11, 0.3)';
  const avatarBgColor = isConfirmed ? '#EF4444' : '#F59E0B';
  const avatarTextColor = isConfirmed ? '#FFFFFF' : '#0B132B';

  return (
    <div 
      className={`slot-card booked ${isConfirmed ? 'confirmed' : 'reserved-pending'} animate-fade-in`} 
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '155px',
        gap: '12px',
        border: `2px solid ${cardBorderColor}`,
        backgroundColor: cardBgSolid,
        background: cardBgColor,
        boxShadow: `0 0 20px ${isConfirmed ? 'rgba(239, 68, 68, 0.35)' : 'rgba(245, 158, 11, 0.35)'}`,
        opacity: isPastDay ? 0.75 : 1
      }}
    >
      
      {/* Top Header */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: iconBgColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: accentColor
            }}>
              <PeriodIcon size={18} />
            </div>
            <div>
              <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF', lineHeight: 1 }}>
                {time}
              </span>
              <span style={{ fontSize: '0.75rem', color: isConfirmed ? '#FCA5A5' : '#FDE68A', marginLeft: '6px' }}>
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
              padding: '3px 9px',
              borderRadius: '12px',
              background: '#EF4444',
              color: '#FFFFFF',
              fontWeight: 800,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              boxShadow: '0 2px 8px rgba(239, 68, 68, 0.4)'
            }}>
              <CheckCircle2 size={12} /> Confirmado
            </span>
          ) : (
            <span style={{
              fontSize: '0.75rem',
              padding: '3px 9px',
              borderRadius: '12px',
              background: '#F59E0B',
              color: '#0B132B',
              fontWeight: 800,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              boxShadow: '0 2px 8px rgba(245, 158, 11, 0.4)'
            }}>
              <Clock size={12} /> {isWindowOpen ? 'Confirmar Agora!' : 'Agendado (Pendente)'}
            </span>
          )}
        </div>

        {/* Resident Name & Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '26px',
            height: '26px',
            borderRadius: '50%',
            background: avatarBgColor,
            color: avatarTextColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.75rem',
            fontWeight: 800
          }}>
            {effectiveBooking.userName ? effectiveBooking.userName.charAt(0).toUpperCase() : "?"}
          </div>
          <div>
            <h4 style={{ fontSize: '1rem', color: '#FFFFFF', margin: 0, lineHeight: 1.2 }}>
              {effectiveBooking.userName} {isCurrentUser && <span style={{ fontSize: '0.75rem', color: accentColor, fontWeight: 700 }}>(Você)</span>}
            </h4>
            <span style={{ fontSize: '0.75rem', color: isConfirmed ? '#FCA5A5' : '#FDE68A', fontWeight: 500 }}>
              {isPastDay ? (
                `Reservado para ${dayName}`
              ) : isConfirmed ? (
                `Confirmado às ${effectiveBooking.confirmedAt || 'hoje'}`
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
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        
        {/* If the current viewer is the OWNER (or Admin): */}
        {isOwner ? (
          <>
            {/* If pending confirmation (YELLOW state): */}
            {!isConfirmed && !isPastDay && (
              isWindowOpen ? (
                /* Inside the established window -> ACTIVE Confirm button! */
                <button 
                  onClick={() => onConfirm(machineId, time, dateKey)}
                  className="btn btn-warning"
                  style={{ 
                    flex: 1, 
                    padding: '8px 12px', 
                    fontSize: '0.85rem', 
                    fontWeight: 800,
                    background: '#F59E0B',
                    color: '#0B132B',
                    border: 'none',
                    boxShadow: '0 2px 10px rgba(245, 158, 11, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                  title={`Confirmação aberta até ${config.windowClose}`}
                >
                  <CheckCircle2 size={16} /> Confirmar Presença (até {config.windowClose})
                </button>
              ) : (
                /* Outside the window -> Disabled notice explaining when it opens */
                <div 
                  style={{
                    flex: 1,
                    padding: '7px 10px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(245, 158, 11, 0.15)',
                    border: '1px solid rgba(245, 158, 11, 0.35)',
                    fontSize: '0.75rem',
                    color: '#FDE68A',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontWeight: 600
                  }}
                >
                  <Clock size={14} color="#F59E0B" />
                  <span>
                    {isToday 
                      ? `Confirmação abre às ${config.windowOpen}` 
                      : `Confirmação no dia (${config.windowOpen} até ${config.windowClose})`}
                  </span>
                </div>
              )
            )}

            {/* Already Confirmed Banner in Red */}
            {isConfirmed && !isPastDay && (
              <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.82rem',
                color: '#EF4444',
                fontWeight: 800
              }}>
                <Sparkles size={15} /> Presença Confirmada (Em Uso)
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

            {/* Cancel / Release Button: ONLY the owner or admin can see & click this */}
            <button 
              onClick={() => onCancel(machineId, time, dateKey, dayName)}
              className="btn btn-danger"
              style={{ padding: '8px 10px', fontSize: '0.8rem' }}
              title={isAdmin ? "Liberar este horário (Ação de Administrador)" : "Liberar minha reserva"}
            >
              {isAdmin ? <ShieldCheck size={14} /> : <X size={15} />}
              <span style={{ marginLeft: '4px' }}>Liberar</span>
            </button>
          </>
        ) : (
          /* NOT THE OWNER: Display informational state only (cannot confirm or cancel) */
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.8rem',
            color: isConfirmed ? '#EF4444' : '#F59E0B',
            fontWeight: 600,
            padding: '6px 0'
          }}>
            {isConfirmed ? (
              <>
                <CheckCircle2 size={16} color="#EF4444" />
                <span>Uso confirmado por {effectiveBooking.userName}</span>
              </>
            ) : (
              <>
                <Clock size={16} color="#F59E0B" />
                <span>Reservado por {effectiveBooking.userName} (aguardando confirmação)</span>
              </>
            )}
          </div>
        )}

      </div>

    </div>
  );
};

export default SlotCard;
