import React, { useState } from 'react';
import { Share2, Check, RotateCcw, Sparkles } from 'lucide-react';

const MACHINES = [1, 2, 4];
const TIMES = ["08:00", "14:00", "21:00"];

const ActionBar = ({ slots = {}, onResetBoard, currentDateStr }) => {
  const [copied, setCopied] = useState(false);

  // Compute stats
  let totalBooked = 0;
  let totalConfirmed = 0;

  MACHINES.forEach(m => {
    TIMES.forEach(t => {
      const booking = slots[`${m}_${t}`];
      if (booking) {
        totalBooked++;
        if (booking.confirmed) totalConfirmed++;
      }
    });
  });

  const handleShareWhatsApp = () => {
    let msg = `🧺 *NIPO LAVANDERIA - QUADRO DE HOJE* 🧺\n`;
    msg += `🗓️ *${currentDateStr || 'Hoje'}*\n\n`;

    MACHINES.forEach(m => {
      msg += `🔹 *MÁQUINA ${m}:*\n`;
      TIMES.forEach(t => {
        const b = slots[`${m}_${t}`];
        if (!b) {
          msg += `   • *${t}:* _Livre ✨_\n`;
        } else if (b.confirmed) {
          msg += `   • *${t}:* *${b.userName}* (Confirmado ✅)\n`;
        } else {
          msg += `   • *${t}:* *${b.userName}* (Aguardando confirmação ⏳)\n`;
        }
      });
      msg += `\n`;
    });

    msg += `⚠️ *Regra:* Confirmar presença entre 2h antes e 25min depois do horário marcado para não perder a vaga!\n`;
    msg += `🔗 Acesse para agendar: https://nipo-food.netlify.app`;

    navigator.clipboard.writeText(msg);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleManualReset = () => {
    if (window.confirm("Deseja realmente ZERAR todos os agendamentos das máquinas de lavar agora?")) {
      onResetBoard();
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
            Ocupação Hoje
          </span>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {totalBooked} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/ 9 vagas</span>
          </span>
        </div>

        <div style={{ width: '1px', height: '30px', background: 'var(--border-color)' }} />

        <div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>
            Confirmados
          </span>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-success)' }}>
            {totalConfirmed}
          </span>
        </div>

        <div style={{ width: '1px', height: '30px', background: 'var(--border-color)' }} />

        <div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>
            Vagas Livres
          </span>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary)' }}>
            {9 - totalBooked}
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
          onClick={handleManualReset}
          className="btn btn-secondary"
          style={{ fontSize: '0.85rem' }}
          title="Zerar todos os agendamentos manualmente"
        >
          <RotateCcw size={15} /> Zerar Quadro
        </button>
      </div>

    </div>
  );
};

export default ActionBar;
