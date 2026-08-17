import React, { useState } from 'react';
import { Edit3, Calendar, Clock, Sparkles, Check, AlertCircle } from 'lucide-react';

const MenuCard = ({ menu, setMenu, isManager, isOrderDeadlinePassed }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...menu, mealType: 'Almoço' });

  const handleSave = (e) => {
    e.preventDefault();
    setMenu({ ...formData, mealType: 'Almoço' });
    setIsEditing(false);
  };

  return (
    <div className="glass-panel animate-fade-in" style={{
      marginBottom: '24px',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Ambient Sun Glow */}
      <div style={{
        position: 'absolute',
        top: '-40px',
        right: '-40px',
        width: '180px',
        height: '180px',
        background: 'radial-gradient(circle, rgba(245, 194, 59, 0.25) 0%, rgba(74, 46, 99, 0) 70%)',
        pointerEvents: 'none'
      }} />

      {/* Header Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{
            background: 'var(--color-yellow)',
            color: '#1A0D28',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: 800,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 2px 10px rgba(245, 194, 59, 0.35)'
          }}>
            <Sparkles size={14} color="#1A0D28" /> Almoço do Dia ☀️
          </span>

          <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={14} color="var(--color-yellow)" /> {menu.date || new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </span>
        </div>

        {isManager && !isEditing && (
          <button 
            onClick={() => { setFormData({ ...menu, mealType: 'Almoço' }); setIsEditing(true); }}
            className="btn btn-secondary"
            style={{ padding: '6px 14px', fontSize: '0.85rem' }}
          >
            <Edit3 size={15} /> Editar Almoço
          </button>
        )}
      </div>

      {/* Editing Form (Manager Mode) */}
      {isEditing ? (
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px', background: 'rgba(26, 13, 40, 0.5)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--color-yellow)' }}>Atualizar Almoço de Hoje ☀️</h3>
          
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Data / Exibição</label>
            <input 
              type="text" 
              className="input-field" 
              value={formData.date} 
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              placeholder="Ex: Segunda-feira, 17 de Agosto"
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Prato Principal *</label>
            <input 
              type="text" 
              className="input-field" 
              value={formData.mainDish} 
              onChange={(e) => setFormData({ ...formData, mainDish: e.target.value })}
              placeholder="Ex: Strogonoff de Frango / Yakisoba de Legumes"
              required
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Acompanhamentos</label>
            <input 
              type="text" 
              className="input-field" 
              value={formData.sides} 
              onChange={(e) => setFormData({ ...formData, sides: e.target.value })}
              placeholder="Ex: Arroz Branco, Feijão Carioca, Batata Palha, Salada Sunomono"
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Avisos / Observações</label>
            <input 
              type="text" 
              className="input-field" 
              value={formData.notes} 
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Ex: Pedidos somente até 10h!"
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }}>
            <button type="button" onClick={() => setIsEditing(false)} className="btn btn-secondary">
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              <Check size={16} /> Salvar Almoço
            </button>
          </div>
        </form>
      ) : (
        /* Card Display View */
        <div>
          <div style={{ marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.6rem', color: 'var(--text-primary)', marginBottom: '6px', lineHeight: 1.3 }}>
              {menu.mainDish || 'Nenhum prato definido para hoje'}
            </h2>
            {menu.sides && (
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
                <strong style={{ color: 'var(--color-yellow)' }}>Acompanhamentos:</strong> {menu.sides}
              </p>
            )}
          </div>

          {/* Notes Banner in Blue */}
          {menu.notes && (
            <div style={{
              background: 'rgba(30, 101, 181, 0.25)',
              borderLeft: '4px solid var(--color-yellow)',
              padding: '10px 14px',
              borderRadius: '0 var(--radius-md) var(--radius-md) 0',
              color: 'var(--text-primary)',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Clock size={16} color="var(--color-yellow)" />
              <span>{menu.notes}</span>
            </div>
          )}

          {/* Deadline Warning */}
          {isOrderDeadlinePassed && (
            <div style={{
              marginTop: '12px',
              background: 'rgba(245, 194, 59, 0.15)',
              border: '1px solid var(--color-yellow)',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-yellow)',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <AlertCircle size={16} color="var(--color-yellow)" />
              <span>Horário limite de 10:00h atingido. Alterações apenas via gerenciador.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MenuCard;
