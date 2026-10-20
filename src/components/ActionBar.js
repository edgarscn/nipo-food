import React, { useState } from 'react';
import { Share2, Check, RotateCcw, ShieldCheck, Calendar } from 'lucide-react';

const MACHINES = [1, 3, 4];
const TIMES = ["08:00", "14:00", "21:00"];

const ActionBar = ({ 
  slots = {}, 
  selectedDateKey, 
  selectedDayName,
  todayDateKey,
  onOpenAdmin,
  isAdmin,
  onResetBoard 
}) => {
  const [copied, setCopied] = useState(false);

  // Compute stats for selected day
  let dayBooked = 0;
  let dayConfirmed = 0;

  MACHINES.forEach(m => {
    TIMES.forEach(t => {
      const keyWithDate = `${selectedDateKey}_${m}_${t}`;
      const legacyKey = `${m}_${t}`;
      const booking = slots[keyWithDate] || (selectedDateKey === todayDateKey ? slots[legacyKey] : null);
      if (booking) {
        dayBooked++;
        if (booking.confirmed) dayConfirmed++;
      }
    });
  });

  // Compute total week bookings
  const totalWeekBookings = Object.keys(slots).filter(k => slots[k] && slots[k].userName).length;

  const handleShareWhatsApp = () => {
    let msg = `🧺 *NIPO LAVANDERIA - QUADRO DE HORÁRIOS* 🧺\n`;
    msg += `🗓️ *${selectedDayName || 'Hoje'}*\n\n`;

    MACHINES.forEach(m => {
      msg += `🔹 *MÁQUINA ${m}:*\n`;
      TIMES.forEach(t => {
        const keyWithDate = `${selectedDateKey}_${m}_${t}`;
        const legacyKey = `${m}_${t}`;
        const b = slots[keyWithDate] || (selectedDateKey === todayDateKey ? slots[legacyKey] : null);
        if (!b) {
          msg += `   • *${t}:* _Livre ✨_\n`;
        } else if (b.confirmed) {
          msg += `   • *${t}:* *${b.userName}* (Confirmado 🔴)\n`;
        } else {
          msg += `   • *${t}:* *${b.userName}* (Agendado 🟡)\n`;
        }
      });
      msg += `\n`;
    });

    msg += `🟡 *Amarelo:* Agendado (aguardando confirmação no dia)\n`;
    msg += `🔴 *Vermelho:* Confirmado (presença garantida)\n`;
    msg += `⚠️ *Regra:* Confirmar presença no app dentro do horário de tolerância (até 25min após início) para não perder a vaga!\n`;
    msg += `🔄 *Reset:* Automático todo domingo às 23:59.\n`;
    msg += `🔗 Agende qualquer dia da semana: https://aesthetic-daffodil-24b59a.netlify.app/`;

    navigator.clipboard.writeText(msg);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleResetClick = () => {
    if (!isAdmin) {
      onOpenAdmin();
    } else {
      if (window.confirm(`Deseja ZERAR os horários de ${selectedDayName}? (Para zerar a semana toda, acesse o painel Admin no topo)`)) {
        onResetBoard();
      }
    }
  };

  return (
    <div className="glass-panel animate-fade-in" style={{
      marginTop: '20px',
      padding: '20px',
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '16px'
    }}>
      
      {/* Quick Summary Numbers */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>
            Vagas em {selectedDayName ? selectedDayName.split(' ')[0] : 'Hoje'}
          </span>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {dayBooked} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/ 9</span>
          </span>
        </div>

        <div style={{ width: '1px', height: '30px', background: 'var(--border-color)' }} />

        <div>
          <span style={{ fontSize: '0.8rem', color: '#F59E0B', display: 'flex', alignItems: 'center', gap: '4px' }}>
            🟡 Agendados
          </span>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#F59E0B' }}>
            {dayBooked - dayConfirmed}
          </span>
        </div>

        <div style={{ width: '1px', height: '30px', background: 'var(--border-color)' }} />

        <div>
          <span style={{ fontSize: '0.8rem', color: '#EF4444', display: 'flex', alignItems: 'center', gap: '4px' }}>
            🔴 Confirmados
          </span>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#EF4444' }}>
            {dayConfirmed}
          </span>
        </div>

        <div style={{ width: '1px', height: '30px', background: 'var(--border-color)' }} />

        <div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>
            Total na Semana
          </span>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary)' }}>
            {totalWeekBookings} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>reservas</span>
          </span>
        </div>
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button 
          onClick={handleShareWhatsApp}
          className="btn btn-primary"
          style={{ fontSize: '0.85rem' }}
        >
          {copied ? <Check size={16} /> : <Share2 size={16} />}
          {copied ? "Copiado para o WhatsApp!" : "Copiar Quadro para o Grupo"}
        </button>

        <button 
          onClick={handleResetClick}
          className="btn btn-secondary"
          style={{ fontSize: '0.85rem' }}
          title={isAdmin ? "Zerar quadro" : "Acesso de Admin (Senha 1531) para zerar"}
        >
          {isAdmin ? <RotateCcw size={15} /> : <ShieldCheck size={15} color="#F59E0B" />}
          <span>{isAdmin ? "Zerar Este Dia" : "Zerar Quadro (Admin)"}</span>
        </button>
      </div>

    </div>
  );
};

export default ActionBar;
