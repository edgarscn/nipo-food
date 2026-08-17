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
      
      {/* Brand Identity */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <img 
          src={logoImg} 
          alt="Logo Nipo Food" 
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            objectFit: 'cover',
            border: '2px solid var(--accent-purple)',
            boxShadow: '0 4px 12px rgba(168, 85, 247, 0.3)'
          }}
        />
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '1.75rem', margin: 0 }} className="gradient-text">
              Nipo Food
            </h1>
            {isManager && (
              <span style={{
                background: 'rgba(236, 72, 153, 0.2)',
                color: '#f472b6',
                border: '1px solid rgba(236, 72, 153, 0.4)',
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
                <ShieldCheck size={13} /> Gerenciador
              </span>
            )}
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0 }}>
            Cardápio & Marmitas da República
          </p>
        </div>
      </div>

      {/* Action Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        
        {/* Connection Status Badge */}
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          borderRadius: '20px',
          fontSize: '0.8rem',
          fontWeight: 600,
          background: isOnline ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
          color: isOnline ? '#34d399' : '#fbbf24',
          border: `1px solid ${isOnline ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`
        }} title={isOnline ? "Conectado" : "Modo Offline PWA Ativo"}>
          {isOnline ? <Wifi size={14} /> : <WifiOff size={14} />}
          {isOnline ? "Online" : "Offline"}
        </span>

        {/* PWA Install Button */}
        {canInstallPWA && (
          <button 
            onClick={handleInstallPWA} 
            className="btn btn-sunset"
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
          {theme === 'dark' ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#8b5cf6" />}
        </button>

        {/* Login / Logout Button */}
        {isManager ? (
          <button 
            onClick={onLogoutManager}
            className="btn btn-secondary"
            style={{ fontSize: '0.85rem', color: '#fca5a5', border: '1px solid rgba(239, 68, 68, 0.3)' }}
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
