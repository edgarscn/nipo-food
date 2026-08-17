import React, { useState } from 'react';
import { Utensils, Box, Users, Share2, Check } from 'lucide-react';

const KitchenSummary = ({ orders, menu }) => {
  const [copied, setCopied] = useState(false);

  const totalMeals = orders.reduce((sum, order) => sum + (Number(order.meals) || 0), 0);
  const totalBoxes = orders.reduce((sum, order) => sum + (Number(order.boxes) || 0), 0);
  const totalPeople = orders.length;

  const handleCopyWhatsApp = () => {
    let summaryText = `🍱 *NIPOFOOD - ALMOÇO DO DIA* 🍱\n`;
    summaryText += `🗓️ *${menu.date || 'Hoje'}*\n`;
    summaryText += `🍲 *Prato:* ${menu.mainDish || 'Prato do Dia'}\n`;
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
          📊 Totais do Almoço para a Cozinha
        </h3>

        <button 
          onClick={handleCopyWhatsApp}
          className="btn btn-primary"
          style={{ fontSize: '0.85rem', padding: '8px 14px' }}
        >
          {copied ? <Check size={16} /> : <Share2 size={16} />}
          {copied ? "Copiado para o Clipboard!" : "Copiar para WhatsApp"}
        </button>
      </div>

      {/* Grid of Total Counters using the 3 logo colors */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
        gap: '12px'
      }}>

        {/* Refeições Presenciais (Amarelo Sol) */}
        <div style={{
          background: 'rgba(245, 194, 59, 0.15)',
          border: '1px solid var(--color-yellow)',
          borderRadius: 'var(--radius-md)',
          padding: '14px',
          textAlign: 'center'
        }}>
          <div style={{ color: 'var(--color-yellow)', marginBottom: '4px', display: 'flex', justifyContent: 'center' }}>
            <Utensils size={24} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFFFFF', lineHeight: 1 }}>
            {totalMeals}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-yellow)', marginTop: '4px', fontWeight: 600 }}>
            Refeições no Local
          </div>
        </div>

        {/* Marmitas (Azul Oceano) */}
        <div style={{
          background: 'rgba(30, 101, 181, 0.25)',
          border: '1px solid var(--color-blue)',
          borderRadius: 'var(--radius-md)',
          padding: '14px',
          textAlign: 'center'
        }}>
          <div style={{ color: '#FFFFFF', marginBottom: '4px', display: 'flex', justifyContent: 'center' }}>
            <Box size={24} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFFFFF', lineHeight: 1 }}>
            {totalBoxes}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px', fontWeight: 600 }}>
            Marmitas para Levar
          </div>
        </div>

        {/* Total Moradores (Roxo Crepúsculo) */}
        <div style={{
          background: 'rgba(74, 46, 99, 0.6)',
          border: '1px solid rgba(245, 194, 59, 0.3)',
          borderRadius: 'var(--radius-md)',
          padding: '14px',
          textAlign: 'center'
        }}>
          <div style={{ color: 'var(--color-yellow)', marginBottom: '4px', display: 'flex', justifyContent: 'center' }}>
            <Users size={24} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFFFFF', lineHeight: 1 }}>
            {totalPeople}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px', fontWeight: 600 }}>
            Moradores Confirmados
          </div>
        </div>

      </div>
    </div>
  );
};

export default KitchenSummary;
