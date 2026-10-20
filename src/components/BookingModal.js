import React, { useState, useEffect } from 'react';
import { X, User, Plus, Waves, Clock } from 'lucide-react';

const BookingModal = ({ 
  isOpen, 
  onClose, 
  targetSlot, // { machineId, time }
  savedUserName, 
  onConfirmBooking 
}) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setName(savedUserName || '');
      setError('');
    }
  }, [isOpen, savedUserName]);

  if (!isOpen || !targetSlot) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanName = name.trim();
    if (!cleanName) {
      setError("Por favor, digite seu nome.");
      return;
    }
    onConfirmBooking(targetSlot.machineId, targetSlot.time, cleanName);
    onClose();
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
      zIndex: 1000,
      padding: '20px'
    }} className="animate-fade-in">
      
      <div className="glass-panel" style={{
        maxWidth: '420px',
        width: '100%',
        padding: '24px',
        position: 'relative'
      }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'rgba(0, 180, 216, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-primary)'
            }}>
              <Waves size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', margin: 0 }}>
                Reservar Máquina {targetSlot.machineId}
              </h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={13} /> Horário: <strong>{targetSlot.time}</strong>
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

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
              Seu Nome (Morador) *
            </label>
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                className="input-field" 
                placeholder="Ex: Edgar, Lucas, Marina..." 
                value={name} 
                onChange={(e) => { setName(e.target.value); setError(''); }}
                autoFocus
                style={{ paddingLeft: '40px' }}
              />
              <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-primary)' }} />
            </div>
            {error && (
              <span style={{ color: 'var(--color-danger)', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>
                {error}
              </span>
            )}
          </div>

          <div style={{
            background: 'rgba(0, 180, 216, 0.08)',
            border: '1px solid var(--border-color)',
            padding: '10px 14px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.8rem',
            color: 'var(--text-secondary)'
          }}>
            ℹ️ <strong>Lembrete importante:</strong> Entre 2h antes e 25min depois do horário ({targetSlot.time}), você precisará entrar no app e clicar em <strong>"Confirmar Uso"</strong> para não perder a vaga.
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
              <Plus size={16} /> Confirmar Reserva
            </button>
          </div>
        </form>

      </div>

    </div>
  );
};

export default BookingModal;
