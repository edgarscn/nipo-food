import React, { useState, useEffect } from 'react';
import { LogIn, LogOut, ShieldCheck, Sun, Moon, Wifi, WifiOff, Smartphone } from 'lucide-react';
import logoImg from '../images/logo.jpg';

const Header = ({ isManager, onLogoutManager, theme, toggleTheme, onRequestManagerAccess }) => {
  const [isOnline, setIsOnline] = useState(true);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [canInstallPWA, setCanInstallPWA] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    setIsOnline(navigator.onLine);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstallPWA(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
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

  return (
    <header style={{
      marginBottom: '24px',
      padding: '20px 24px',
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '16px'
    }} className="glass-panel animate-fade-in">
      
      {/* Brand Identity with 3-color palette */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <img 
          src={logoImg} 
          alt="Logo NipoFood" 
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '16px',
            objectFit: 'cover',
            border: '2px solid var(--color-yellow)',
            boxShadow: '0 4px 14px rgba(245, 194, 59, 0.35)'
          }}
        />
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '1.8rem', margin: 0, color: 'var(--color-yellow)' }}>
              NipoFood
            </h1>
            {isManager && (
              <span style={{
                background: 'var(--color-blue)',
                color: '#FFFFFF',
                border: '1px solid var(--color-yellow)',
                padding: '2px 10px',
                borderRadius: '12px',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <ShieldCheck size={13} color="var(--color-yellow)" /> Gerenciador
              </span>
            )}
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0 }}>
            Cardápio & Marmitas da República
          </p>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        
        {/* Connection Status Badge (Blue / Yellow) */}
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          borderRadius: '20px',
          fontSize: '0.8rem',
          fontWeight: 600,
          background: isOnline ? 'rgba(30, 101, 181, 0.25)' : 'rgba(245, 194, 59, 0.25)',
          color: isOnline ? '#FFFFFF' : 'var(--color-yellow)',
          border: `1px solid ${isOnline ? 'var(--color-blue)' : 'var(--color-yellow)'}`
        }} title={isOnline ? "Conectado" : "Modo Offline PWA Ativo"}>
          {isOnline ? <Wifi size={14} color="var(--color-yellow)" /> : <WifiOff size={14} />}
          {isOnline ? "Online" : "Offline"}
        </span>

        {/* PWA Install Button */}
        {canInstallPWA && (
          <button 
            onClick={handleInstallPWA} 
            className="btn btn-primary"
            style={{ padding: '8px 14px', fontSize: '0.85rem' }}
          >
            <Smartphone size={16} /> Instalar PWA
          </button>
        )}

        {/* Theme Toggle Button */}
        <button 
          onClick={toggleTheme}
          className="btn btn-secondary"
          style={{ width: '40px', height: '40px', padding: 0, borderRadius: '50%' }}
          title={theme === 'dark' ? "Modo Claro" : "Modo Escuro"}
        >
          {theme === 'dark' ? <Sun size={18} color="var(--color-yellow)" /> : <Moon size={18} color="#FFFFFF" />}
        </button>

        {/* Login / Logout Button */}
        {isManager ? (
          <button 
            onClick={onLogoutManager}
            className="btn btn-secondary"
            style={{ fontSize: '0.85rem', color: 'var(--color-yellow)', border: '1px solid var(--color-yellow)' }}
            title="Sair do modo gerenciador"
          >
            <LogOut size={16} /> Sair (Logout)
          </button>
        ) : (
          <button 
            onClick={onRequestManagerAccess}
            className="btn btn-primary"
            style={{ fontSize: '0.85rem' }}
          >
            <LogIn size={16} /> Login Gerenciador
          </button>
        )}

      </div>

    </header>
  );
};

export default Header;
