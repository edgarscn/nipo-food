import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import MenuCard from '../components/MenuCard';
import KitchenSummary from '../components/KitchenSummary';
import OrderForm from '../components/OrderForm';
import OrderList from '../components/OrderList';
import ManagerModal from '../components/ManagerModal';
import { KeyRound, Lock, Eye, EyeOff, ShieldCheck, LogIn, CheckCircle } from 'lucide-react';
import '../styles/global.css';

const DEFAULT_MENU = {
  mealType: 'Almoço',
  date: 'Segunda-feira, 17 de Agosto',
  mainDish: 'Strogonoff de Frango Especial & Yakisoba Tradicional',
  sides: 'Arroz Branco, Batata Palha Crocante, Salada Sunomono de Pepino e Tomate',
  notes: 'Pedidos somente até 10h!'
};

const DEFAULT_ORDERS = [
  { id: 'edgar', name: 'Edgar', meals: 1, boxes: 1, note: '1 marmita para levar', updatedAt: '09:15' },
  { id: 'lucas', name: 'Lucas', meals: 1, boxes: 0, note: '', updatedAt: '09:20' },
  { id: 'marina', name: 'Marina', meals: 0, boxes: 2, note: 'Deixar na geladeira', updatedAt: '09:45' },
  { id: 'beatriz', name: 'Beatriz', meals: 1, boxes: 0, note: 'Sem cebola', updatedAt: '09:55' }
];

const IndexPage = () => {
  const [theme, setTheme] = useState('dark');
  const [isManager, setIsManager] = useState(false);
  const [managerPin, setManagerPin] = useState('1234');
  const [isManagerModalOpen, setIsManagerModalOpen] = useState(false);
  const [pinPromptOpen, setPinPromptOpen] = useState(false);
  const [inputPin, setInputPin] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [pinError, setPinError] = useState('');
  const [loginSuccessMsg, setLoginSuccessMsg] = useState('');
  const [deadlineTime, setDeadlineTime] = useState('10:00');

  // Persistent States
  const [menu, setMenu] = useState(DEFAULT_MENU);
  const [orders, setOrders] = useState(DEFAULT_ORDERS);

  // Force PWA Service Worker to update fresh bundles
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        for (let registration of registrations) {
          registration.update();
        }
      });
    }
  }, []);

  useEffect(() => {
    try {
      const savedMenu = localStorage.getItem('nipo_food_menu');
      if (savedMenu) {
        const parsedMenu = JSON.parse(savedMenu);
        if (parsedMenu.notes && parsedMenu.notes.toLowerCase().includes('servid')) {
          parsedMenu.notes = 'Pedidos somente até 10h!';
        }
        setMenu(parsedMenu);
      }

      const savedOrders = localStorage.getItem('nipo_food_orders');
      if (savedOrders) setOrders(JSON.parse(savedOrders));

      const savedTheme = localStorage.getItem('nipo_food_theme');
      if (savedTheme) setTheme(savedTheme);

      const savedPin = localStorage.getItem('nipo_food_pin');
      if (savedPin) setManagerPin(savedPin);

      const savedDeadline = localStorage.getItem('nipo_food_deadline');
      if (savedDeadline) setDeadlineTime(savedDeadline);

      const savedManagerAuth = localStorage.getItem('nipo_food_is_manager');
      if (savedManagerAuth === 'true') setIsManager(true);
    } catch (e) {
      console.error("Erro ao carregar dados do localStorage", e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('nipo_food_menu', JSON.stringify(menu));
    } catch (e) {}
  }, [menu]);

  useEffect(() => {
    try {
      localStorage.setItem('nipo_food_orders', JSON.stringify(orders));
    } catch (e) {}
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('nipo_food_theme', theme);
      document.documentElement.setAttribute('data-theme', theme);
    } catch (e) {}
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem('nipo_food_pin', managerPin);
    } catch (e) {}
  }, [managerPin]);

  useEffect(() => {
    try {
      localStorage.setItem('nipo_food_deadline', deadlineTime);
    } catch (e) {}
  }, [deadlineTime]);

  useEffect(() => {
    try {
      localStorage.setItem('nipo_food_is_manager', isManager ? 'true' : 'false');
    } catch (e) {}
  }, [isManager]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleRequestManagerAccess = () => {
    setPinPromptOpen(true);
    setInputPin('');
    setPinError('');
    setLoginSuccessMsg('');
  };

  const handleLogoutManager = () => {
    setIsManager(false);
    setIsManagerModalOpen(false);
  };

  // Strict single active PIN validation directly from state / localStorage
  const handleVerifyPin = (e) => {
    e.preventDefault();
    const activePin = (localStorage.getItem('nipo_food_pin') || managerPin).trim();
    if (inputPin.trim() === activePin) {
      setLoginSuccessMsg('Login realizado com sucesso!');
      setTimeout(() => {
        setIsManager(true);
        setPinPromptOpen(false);
        setLoginSuccessMsg('');
      }, 800);
    } else {
      setPinError('Senha/PIN incorreto. Tente novamente.');
    }
  };

  const handleAddOrUpdateOrder = (newOrder) => {
    setOrders(prev => {
      const index = prev.findIndex(o => o.name.toLowerCase() === newOrder.name.toLowerCase());
      if (index >= 0) {
        const updated = [...prev];
        updated[index] = { ...updated[index], ...newOrder };
        return updated;
      }
      return [newOrder, ...prev];
    });
  };

  const handleDeleteOrder = (nameToDelete) => {
    setOrders(prev => prev.filter(o => o.name.toLowerCase() !== nameToDelete.toLowerCase()));
  };

  const handleResetOrders = () => {
    setOrders([]);
  };

  const checkDeadlinePassed = () => {
    if (!deadlineTime) return false;
    const now = new Date();
    const [hours, minutes] = deadlineTime.split(':').map(Number);
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const deadlineMinutes = hours * 60 + minutes;
    return currentMinutes >= deadlineMinutes;
  };

  const isOrderDeadlinePassed = checkDeadlinePassed();

  return (
    <div style={{ minHeight: '100vh', padding: '16px 12px 40px 12px' }}>
      <div style={{ maxWidth: '760px', margin: '0 auto' }}>
        
        {/* Top Header */}
        <Header 
          isManager={isManager} 
          onLogoutManager={handleLogoutManager} 
          theme={theme} 
          toggleTheme={toggleTheme}
          onRequestManagerAccess={handleRequestManagerAccess}
        />

        {/* Manager Connected Alert Bar */}
        {isManager && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(74, 46, 99, 0.4) 0%, rgba(30, 101, 181, 0.4) 100%)',
            border: '1px solid var(--color-yellow)',
            padding: '12px 20px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '10px'
          }} className="animate-fade-in">
            <span style={{ fontSize: '0.9rem', color: 'var(--color-yellow)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={18} color="var(--color-yellow)" /> Você está autenticado como Gerenciador.
            </span>
            <button 
              onClick={() => setIsManagerModalOpen(true)}
              className="btn btn-primary"
              style={{ padding: '6px 14px', fontSize: '0.8rem' }}
            >
              Configurações & Administrar Lista
            </button>
          </div>
        )}

        {/* Cardápio do Dia */}
        <MenuCard 
          menu={menu} 
          setMenu={setMenu} 
          isManager={isManager}
          isOrderDeadlinePassed={isOrderDeadlinePassed}
        />

        {/* Totais da Cozinha */}
        <KitchenSummary 
          orders={orders} 
          menu={menu}
        />

        {/* Form para o Morador colocar seu nome */}
        <OrderForm 
          onAddOrUpdateOrder={handleAddOrUpdateOrder}
          existingNames={orders.map(o => o.name)}
          isOrderDeadlinePassed={isOrderDeadlinePassed}
          isManager={isManager}
          deadlineTime={deadlineTime}
        />

        {/* Lista de Confirmados do Dia */}
        <OrderList 
          orders={orders}
          onDeleteOrder={handleDeleteOrder}
          onEditOrder={handleAddOrUpdateOrder}
          isManager={isManager}
          isOrderDeadlinePassed={isOrderDeadlinePassed}
          deadlineTime={deadlineTime}
        />

        {/* Footer */}
        <footer style={{
          textAlign: 'center',
          marginTop: '32px',
          paddingTop: '20px',
          borderTop: '1px solid var(--border-color)',
          color: 'var(--text-muted)',
          fontSize: '0.85rem'
        }}>
          <p style={{ marginBottom: '4px' }}>
            🍱 <strong>NipoFood</strong> • Cardápio & Marmitas da República
          </p>
          <p style={{ fontSize: '0.75rem' }}>
            Pedidos somente até {deadlineTime}h.
          </p>
        </footer>

      </div>

      {/* Login Modal for Manager */}
      {pinPromptOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(26, 13, 40, 0.9)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1100,
          padding: '20px'
        }} className="animate-fade-in">
          
          <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '28px', position: 'relative' }}>
            
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                background: 'var(--color-yellow)',
                color: '#1A0D28',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '12px',
                boxShadow: '0 4px 15px rgba(245, 194, 59, 0.4)'
              }}>
                <KeyRound size={26} color="#1A0D28" />
              </div>
              <h3 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', margin: 0 }}>
                Login de Gerenciador
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Digite a senha de gerenciador para liberar edições e configurações.
              </p>
            </div>

            {loginSuccessMsg ? (
              <div style={{
                background: 'rgba(30, 101, 181, 0.3)',
                border: '1px solid var(--color-yellow)',
                color: 'var(--color-yellow)',
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontWeight: 600
              }}>
                <CheckCircle size={18} color="var(--color-yellow)" /> {loginSuccessMsg}
              </div>
            ) : (
              <form onSubmit={handleVerifyPin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block', fontWeight: 600 }}>
                    Senha de Acesso (PIN)
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type={showPassword ? "text" : "password"} 
                      className="input-field" 
                      placeholder="Digite a senha..." 
                      value={inputPin}
                      onChange={(e) => setInputPin(e.target.value)}
                      autoFocus
                      required
                      style={{ paddingLeft: '40px', paddingRight: '40px' }}
                    />
                    <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-yellow)' }} />
                    
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer'
                      }}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {pinError && (
                  <div style={{ color: 'var(--color-yellow)', fontSize: '0.85rem', background: 'rgba(245, 194, 59, 0.15)', border: '1px solid var(--color-yellow)', padding: '8px 12px', borderRadius: 'var(--radius-sm)' }}>
                    {pinError}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button type="button" onClick={() => setPinPromptOpen(false)} className="btn btn-secondary" style={{ flex: 1 }}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                    <LogIn size={16} /> Entrar
                  </button>
                </div>

              </form>
            )}

          </div>

        </div>
      )}

      {/* Manager Settings Modal */}
      <ManagerModal 
        isOpen={isManagerModalOpen}
        onClose={() => setIsManagerModalOpen(false)}
        onResetOrders={handleResetOrders}
        managerPin={managerPin}
        setManagerPin={setManagerPin}
        deadlineTime={deadlineTime}
        setDeadlineTime={setDeadlineTime}
        orders={orders}
        menu={menu}
      />

    </div>
  );
};

export default IndexPage;

export const Head = () => (
  <>
    <title>NipoFood - Cardápio & Marmitas da República</title>
    <meta name="description" content="Aplicativo PWA de gestão diária de refeições e marmitas da república NipoFood." />
    <meta name="theme-color" content="#4A2E63" />
    <link rel="icon" href="/icon.jpg" />
  </>
);
