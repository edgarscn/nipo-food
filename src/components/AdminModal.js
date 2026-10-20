import React, { useState } from 'react';
import { ShieldCheck, Lock, Trash2, LogOut, X, AlertTriangle, KeyRound, Check } from 'lucide-react';

const ADMIN_PASSWORD = "1531";

const AdminModal = ({ 
  isOpen, 
  onClose, 
  isAdmin, 
  onLoginSuccess, 
  onLogoutAdmin, 
  onResetEntireWeek, 
  onResetSelectedDay, 
  selectedDayName, 
  totalWeekBookings 
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e) => {
    e.preventDefault();
    if (pin.trim() === ADMIN_PASSWORD) {
      onLoginSuccess();
      setPin('');
      setError('');
    } else {
      setError("Senha de admin incorreta. Tente novamente.");
    }
  };

  const handleResetWeek = () => {
    if (window.confirm("⚠️ ATENÇÃO: Deseja realmente ZERAR TODOS os agendamentos da SEMANA INTEIRA? Esta ação apagará todas as reservas de segunda a domingo.")) {
      onResetEntireWeek();
      onClose();
    }
  };

  const handleResetDay = () => {
    if (window.confirm(`Deseja realmente ZERAR todos os agendamentos de ${selectedDayName}?`)) {
      onResetSelectedDay();
      onClose();
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(11, 19, 43, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1100,
      padding: '20px'
    }} className="animate-fade-in">
      
      <div className="glass-panel" style={{
        maxWidth: '440px',
        width: '100%',
        padding: '24px',
        position: 'relative'
      }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
              color: '#0B132B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800
            }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', margin: 0 }}>
                Painel do Administrador
              </h3>
              <span style={{ fontSize: '0.8rem', color: '#F59E0B' }}>
                {isAdmin ? "Status: Autenticado como Admin" : "Acesso restrito"}
              </span>
            </div>
          </div>

          <button 
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Not Logged In -> Ask for PIN */}
        {!isAdmin ? (
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
              Digite a senha de administrador para gerenciar e zerar o quadro de horários da república.
            </p>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
                Senha de Acesso
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="password"
                  className="input-field"
                  placeholder="Digite a senha..."
                  value={pin}
                  onChange={(e) => { setPin(e.target.value); setError(''); }}
                  autoFocus
                  required
                  style={{ paddingLeft: '40px' }}
                />
                <KeyRound size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#F59E0B' }} />
              </div>
              {error && (
                <span style={{ color: 'var(--color-danger)', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>
                  {error}
                </span>
              )}
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
              <button type="button" onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary" style={{ flex: 1, background: '#F59E0B', color: '#0B132B' }}>
                <Check size={16} /> Entrar
              </button>
            </div>
          </form>
        ) : (
          /* Admin Logged In -> Controls */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: 'var(--radius-sm)',
              padding: '12px 14px',
              fontSize: '0.85rem',
              color: 'var(--text-secondary)'
            }}>
              ℹ️ O quadro é zerado <strong>automaticamente todo domingo às 23:59</strong>. Você também pode zerar manualmente a qualquer momento abaixo:
            </div>

            {/* Action 1: Reset Entire Week */}
            <button 
              onClick={handleResetWeek}
              className="btn btn-danger"
              style={{ padding: '12px', fontSize: '0.9rem', justifyContent: 'flex-start' }}
            >
              <Trash2 size={18} />
              <div style={{ textAlign: 'left', marginLeft: '6px' }}>
                <div style={{ fontWeight: 700 }}>Zerar Semana Inteira</div>
                <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Limpa todas as reservas ({totalWeekBookings} ativas)</div>
              </div>
            </button>

            {/* Action 2: Reset Selected Day */}
            <button 
              onClick={handleResetDay}
              className="btn btn-secondary"
              style={{ padding: '12px', fontSize: '0.9rem', justifyContent: 'flex-start', border: '1px solid var(--border-color)' }}
            >
              <Trash2 size={18} color="var(--color-primary)" />
              <div style={{ textAlign: 'left', marginLeft: '6px' }}>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Zerar apenas {selectedDayName}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Limpa apenas as 3 máquinas deste dia</div>
              </div>
            </button>

            {/* Logout Admin */}
            <button 
              onClick={() => { onLogoutAdmin(); onClose(); }}
              className="btn btn-secondary"
              style={{ marginTop: '8px', fontSize: '0.85rem' }}
            >
              <LogOut size={16} /> Sair do Modo Administrador
            </button>
          </div>
        )}

      </div>

    </div>
  );
};

export default AdminModal;
