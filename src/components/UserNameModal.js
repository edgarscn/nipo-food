import React, { useState, useEffect } from 'react';
import { X, User, Check } from 'lucide-react';

const UserNameModal = ({ 
  isOpen, 
  onClose, 
  currentName, 
  onSaveName 
}) => {
  const [name, setName] = useState('');

  useEffect(() => {
    if (isOpen) {
      setName(currentName || '');
    }
  }, [isOpen, currentName]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const clean = name.trim();
    if (clean) {
      onSaveName(clean);
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
        maxWidth: '380px',
        width: '100%',
        padding: '24px',
        position: 'relative'
      }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={18} color="var(--color-primary)" /> Seu Nome de Morador
          </h3>
          <button 
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
          Salvamos seu nome neste aparelho para você agendar suas lavagens com apenas 1 clique.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ position: 'relative' }}>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Digite seu nome..." 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              autoFocus
              required
              style={{ paddingLeft: '40px' }}
            />
            <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-primary)' }} />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
              <Check size={16} /> Salvar Nome
            </button>
          </div>
        </form>

      </div>

    </div>
  );
};

export default UserNameModal;
