import React, { useState } from 'react';
import { Utensils, Box, Users, Share2, Check, Copy } from 'lucide-react';

const KitchenSummary = ({ orders, menu }) => {
  const [copied, setCopied] = useState(false);

  // Calculate totals
  const totalMeals = orders.reduce((sum, order) => sum + (Number(order.meals) || 0), 0);
  const totalBoxes = orders.reduce((sum, order) => sum + (Number(order.boxes) || 0), 0);
  const totalPeople = orders.length;

  const handleCopyWhatsApp = () => {
    let summaryText = `🍱 *NIPO FOOD - CARDÁPIO & REFEIÇÕES* 🍱\n`;
    summaryText += `🗓️ *${menu.mealType || 'Refeição'} - ${menu.date || 'Hoje'}*\n`;
    summaryText += `🍲 *Cardápio:* ${menu.mainDish || 'Prato do Dia'}\n`;
    if (menu.sides) summaryText += `🥗 *Acompanhamentos:* ${menu.sides}\n`;
    summaryText += `\n📊 *RESUMO DA COZINHA:*\n`;
    summaryText += `• 🍽️ *Refeições no Local:* ${totalMeals}\n`;
    summaryText += `• 📦 *Marmitas para Levar:* ${totalBoxes}\n`;
    summaryText += `• 👥 *Total de Moradores:* ${totalPeople}\n\n`;

    summaryText += `📝 *LISTA DE CONFIRMADOS:*\n`;
    if (orders.length === 0) {
      summaryText += `(Nenhum pedido registrado ainda)\n`;
    } else {
      orders.forEach((o, index) => {
        let details = [];
        if (o.meals > 0) details.push(`${o.meals} Refeição${o.meals > 1 ? 'ões' : ''}`);
        if (o.boxes > 0) details.push(`${o.boxes} Marmita${o.boxes > 1 ? 's' : ''}`);
        let line = `${index + 1}. *${o.name}*: ${details.join(', ') || 'Nenhuma'}`;
        if (o.note) line += ` _(${o.note})_`;
        summaryText += line + `\n`;
      });
    }

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="glass-panel animate-fade-in" style={{
      marginBottom: '24px',
      padding: '20px 24px'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          📊 Totais para a Cozinha
        </h3>

        <button 
          onClick={handleCopyWhatsApp}
          className="btn btn-sunset"
          style={{ fontSize: '0.85rem', padding: '8px 14px' }}
        >
          {copied ? <Check size={16} /> : <Share2 size={16} />}
          {copied ? "Copiado para o Clipboard!" : "Copiar para WhatsApp"}
        </button>
      </div>

      {/* Grid of Total Counters */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
        gap: '12px'
      }}>

        {/* Refeições Presenciais */}
        <div style={{
          background: 'rgba(168, 85, 247, 0.12)',
          border: '1px solid rgba(168, 85, 247, 0.25)',
          borderRadius: 'var(--radius-md)',
          padding: '14px',
          textAlign: 'center',
          transition: 'transform 0.2s ease'
        }}>
          <div style={{ color: 'var(--accent-purple)', marginBottom: '4px', display: 'flex', justifyContent: 'center' }}>
            <Utensils size={24} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
            {totalMeals}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px', fontWeight: 500 }}>
            Refeições no Local
          </div>
        </div>

        {/* Marmitas */}
        <div style={{
          background: 'rgba(249, 115, 22, 0.12)',
          border: '1px solid rgba(249, 115, 22, 0.25)',
          borderRadius: 'var(--radius-md)',
          padding: '14px',
          textAlign: 'center',
          transition: 'transform 0.2s ease'
        }}>
          <div style={{ color: 'var(--accent-sunset)', marginBottom: '4px', display: 'flex', justifyContent: 'center' }}>
            <Box size={24} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
            {totalBoxes}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px', fontWeight: 500 }}>
            Marmitas para Levar
          </div>
        </div>

        {/* Total Moradores */}
        <div style={{
          background: 'rgba(6, 182, 212, 0.12)',
          border: '1px solid rgba(6, 182, 212, 0.25)',
          borderRadius: 'var(--radius-md)',
          padding: '14px',
          textAlign: 'center',
          transition: 'transform 0.2s ease'
        }}>
          <div style={{ color: 'var(--accent-teal)', marginBottom: '4px', display: 'flex', justifyContent: 'center' }}>
            <Users size={24} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
            {totalPeople}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px', fontWeight: 500 }}>
            Moradores Confirmados
          </div>
        </div>

      </div>
    </div>
  );
};

export default KitchenSummary;
