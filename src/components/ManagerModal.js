import React, { useState } from 'react';
import { ShieldAlert, Trash2, Key, Clock, Download, Upload, X, Check } from 'lucide-react';

const ManagerModal = ({ 
  isOpen, 
  onClose, 
  onResetOrders, 
  managerPin, 
  setManagerPin,
  deadlineTime,
  setDeadlineTime,
  orders,
  menu
}) => {
  const [newPin, setNewPin] = useState('');
  const [pinSuccess, setPinSuccess] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  if (!isOpen) return null;

  const handleChangePin = (e) => {
    e.preventDefault();
    if (newPin.trim().length >= 4) {
      setManagerPin(newPin.trim());
      setNewPin('');
      setPinSuccess(true);
      setTimeout(() => setPinSuccess(false), 2500);
    }
  };

  const handleReset = () => {
    if (window.confirm("Tem certeza que deseja ZERAR todos os pedidos da lista de hoje? Essa ação não pode ser desfeita.")) {
      onResetOrders();
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 2500);
    }
  };

  const handleExportJSON = () => {
    const data = {
      menu,
      orders,
      exportedAt: new Date().toISOString()
    };
    const jsonStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", jsonStr);
    downloadAnchor.setAttribute("download", `nipo-food-backup-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 23, 42, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }} className="animate-fade-in">
      
      <div className="glass-panel" style={{
        maxWidth: '520px',
        width: '100%',
        padding: '24px',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative'
      }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.3rem', color: 'var(--accent-purple)', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            <ShieldAlert size={20} /> Painel de Controle do Gerenciador
          </h3>
          <button 
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Action 1: Reset Orders */}
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            padding: '16px',
            borderRadius: 'var(--radius-md)'
          }}>
            <h4 style={{ color: '#fca5a5', fontSize: '1rem', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Trash2 size={16} /> Zerar Lista de Pedidos do Dia
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
              Limpa todas as refeições e marmitas cadastradas hoje para iniciar um novo dia de cardápio.
            </p>
            <button onClick={handleReset} className="btn btn-danger" style={{ fontSize: '0.85rem' }}>
              {resetSuccess ? "Lista Zerada com Sucesso!" : "Zerar Lista do Dia"}
            </button>
          </div>

          {/* Action 2: Deadline Time */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.5)',
            border: '1px solid var(--border-color)',
            padding: '16px',
            borderRadius: 'var(--radius-md)'
          }}>
            <h4 style={{ color: 'var(--text-primary)', fontSize: '1rem', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={16} color="var(--accent-sunset)" /> Horário Limite para Pedidos
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>
              Defina o horário após o qual moradores visualizarão um aviso de encerramento.
            </p>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input 
                type="time" 
                className="input-field" 
                value={deadlineTime}
                onChange={(e) => setDeadlineTime(e.target.value)}
                style={{ width: '140px' }}
              />
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {deadlineTime ? `Bloqueia após as ${deadlineTime}h` : 'Sem limite ativo'}
              </span>
            </div>
          </div>

          {/* Action 3: Change PIN */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.5)',
            border: '1px solid var(--border-color)',
            padding: '16px',
            borderRadius: 'var(--radius-md)'
          }}>
            <h4 style={{ color: 'var(--text-primary)', fontSize: '1rem', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Key size={16} color="var(--accent-teal)" /> Senha PIN do Gerenciador
            </h4>
            <form onSubmit={handleChangePin} style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '8px' }}>
              <input 
                type="password" 
                className="input-field" 
                placeholder="Novo PIN (min. 4 digitos)"
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
              />
              <button type="submit" className="btn btn-secondary" style={{ whiteSpace: 'nowrap', fontSize: '0.85rem' }}>
                {pinSuccess ? <Check size={16} color="#34d399" /> : 'Atualizar PIN'}
              </button>
            </form>
          </div>

          {/* Action 4: Backup Data */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.5)',
            border: '1px solid var(--border-color)',
            padding: '16px',
            borderRadius: 'var(--radius-md)'
          }}>
            <h4 style={{ color: 'var(--text-primary)', fontSize: '1rem', marginBottom: '6px' }}>
              💾 Backup & Exportação
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>
              Baixe o histórico do cardápio e lista de moradores em formato JSON.
            </p>
            <button onClick={handleExportJSON} className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>
              <Download size={16} /> Baixar Relatório JSON
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};

export default ManagerModal;
