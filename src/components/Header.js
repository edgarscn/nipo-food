import React, { useState, useEffect } from 'react';
import { Waves, Sun, Moon, Wifi, Smartphone, User, RefreshCw, Clock, ShieldCheck } from 'lucide-react';

const Header = ({ 
  currentUserName, 
  onEditUserName, 
  theme, 
  toggleTheme, 
  currentTime, 
  isSyncing, 
  onManualRefresh,
  isAdmin,
  onOpenAdmin
}) => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [canInstallPWA, setCanInstallPWA] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstallPWA(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallPWA = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          setCanInstallPWA(false);
        }
        setDeferredPrompt(null);
      });
    }
  };

  const formattedTime = currentTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const formattedDate = currentTime.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <header className="glass-panel animate-fade-in" style={{
      marginBottom: '20px',
      padding: '20px 24px',
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '16px'
    }}>
      
      {/* Brand & Digital Clock */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          width: '54px',
          height: '54px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF',
          boxShadow: '0 4px 16px rgba(0, 180, 216, 0.4)',
          flexShrink: 0
        }}>
          <Waves size={28} />
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: '1.6rem', margin: 0, color: 'var(--color-primary)', letterSpacing: '-0.02em' }}>
              Nipo Lavanderia
            </h1>
            
            {/* Live Clock Pill */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              background: 'rgba(0, 180, 216, 0.15)',
              border: '1px solid var(--border-color)',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: 'var(--color-primary)'
            }}>
              <Clock size={13} />
              <span>{formattedTime}</span>
            </div>
          </div>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '2px 0 0 0', textTransform: 'capitalize' }}>
            {formattedDate} • Máquinas 1, 3 e 4
          </p>
        </div>
      </div>

      {/* Action Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        
        {/* User Identity Pill */}
        <button 
          onClick={onEditUserName}
          className="btn btn-secondary"
          style={{ padding: '6px 12px', fontSize: '0.85rem', borderRadius: '20px' }}
          title="Clique para alterar seu nome"
        >
          <User size={15} color="var(--color-primary)" />
          <span>{currentUserName ? currentUserName : "Definir meu nome"}</span>
        </button>

        {/* Admin Access Button */}
        <button
          onClick={onOpenAdmin}
          className="btn btn-secondary"
          style={{
            padding: '6px 12px',
            fontSize: '0.85rem',
            borderRadius: '20px',
            background: isAdmin ? 'rgba(245, 158, 11, 0.18)' : undefined,
            color: isAdmin ? '#F59E0B' : undefined,
            borderColor: isAdmin ? '#F59E0B' : undefined,
            fontWeight: isAdmin ? 700 : 500
          }}
          title={isAdmin ? "Painel de Administrador (Autenticado)" : "Acesso de Administrador"}
        >
          <ShieldCheck size={16} color={isAdmin ? "#F59E0B" : "var(--color-primary)"} />
          <span>{isAdmin ? "Admin 👑" : "Admin"}</span>
        </button>

        {/* Sync Indicator / Refresh */}
        <button
          onClick={onManualRefresh}
          className="btn btn-secondary"
          style={{ width: '38px', height: '38px', padding: 0, borderRadius: '50%' }}
          title={isSyncing ? "Sincronizando..." : "Atualizar dados da nuvem"}
        >
          <RefreshCw size={16} className={isSyncing ? "animate-spin" : ""} color="var(--color-primary)" />
        </button>

        {/* PWA Install Button */}
        {canInstallPWA && (
          <button 
            onClick={handleInstallPWA} 
            className="btn btn-primary"
            style={{ padding: '6px 12px', fontSize: '0.85rem' }}
          >
            <Smartphone size={15} /> Instalar App
          </button>
        )}

        {/* Theme Toggle Button */}
        <button 
          onClick={toggleTheme}
          className="btn btn-secondary"
          style={{ width: '38px', height: '38px', padding: 0, borderRadius: '50%' }}
          title={theme === 'dark' ? "Modo Claro" : "Modo Escuro"}
        >
          {theme === 'dark' ? <Sun size={17} color="#F59E0B" /> : <Moon size={17} color="var(--color-primary)" />}
        </button>

      </div>

    </header>
  );
};

export default Header;
