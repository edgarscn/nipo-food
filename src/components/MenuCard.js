import React, { useState } from 'react';
import { Utensils, Edit3, Calendar, Clock, Sparkles, Check, AlertCircle } from 'lucide-react';

const MenuCard = ({ menu, setMenu, isManager, isOrderDeadlinePassed }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...menu });

  const handleSave = (e) => {
    e.preventDefault();
    setMenu(formData);
    setIsEditing(false);
  };

  return (
    <div className="glass-panel animate-fade-in" style={{
      marginBottom: '24px',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Visual Ambient Glow */}
      <div style={{
        position: 'absolute',
        top: '-40px',
        right: '-40px',
        width: '180px',
        height: '180px',
        background: 'radial-gradient(circle, rgba(249, 115, 22, 0.25) 0%, rgba(168, 85, 247, 0) 70%)',
        pointerEvents: 'none'
      }} />

      {/* Header Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{
            background: 'linear-gradient(135deg, var(--accent-sunset) 0%, var(--accent-pink) 100%)',
            color: '#fff',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 2px 8px rgba(249, 115, 22, 0.4)'
          }}>
            <Sparkles size={14} /> {menu.mealType || 'Almoço'} do Dia
          </span>

          <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={14} /> {menu.date || new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </span>
        </div>

        {isManager && !isEditing && (
          <button 
            onClick={() => { setFormData({ ...menu }); setIsEditing(true); }}
            className="btn btn-secondary"
            style={{ padding: '6px 14px', fontSize: '0.85rem' }}
          >
            <Edit3 size={15} /> Editar Cardápio
          </button>
        )}
      </div>

      {/* Editing Form (Manager Mode) */}
      {isEditing ? (
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px', background: 'rgba(15, 23, 42, 0.4)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--accent-purple)' }}>Atualizar Cardápio de Hoje</h3>
          
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '160px' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Refeição</label>
              <select 
                className="input-field" 
                value={formData.mealType} 
                onChange={(e) => setFormData({ ...formData, mealType: e.target.value })}
              >
                <option value="Almoço">Almoço ☀️</option>
                <option value="Jantar">Jantar 🌙</option>
                <option value="Especial">Refeição Especial 🍣</option>
              </select>
            </div>

            <div style={{ flex: 2, minWidth: '200px' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Data / Exibição</label>
              <input 
                type="text" 
                className="input-field" 
                value={formData.date} 
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                placeholder="Ex: Quarta-feira, 12 de Agosto"
              />
            </div>
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
              placeholder="Ex: Arroz Branco, Feijão Carioca, Batata Palha, Salada Tropical"
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Avisos / Observações</label>
            <input 
              type="text" 
              className="input-field" 
              value={formData.notes} 
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Ex: Servido a partir das 12:30h. Favor confirmar até 11:30h."
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }}>
            <button type="button" onClick={() => setIsEditing(false)} className="btn btn-secondary">
              Cancelar
            </button>
            <button type="submit" className="btn btn-sunset">
              <Check size={16} /> Salvar Cardápio
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
                <strong style={{ color: 'var(--accent-purple)' }}>Acompanhamentos:</strong> {menu.sides}
              </p>
            )}
          </div>

          {/* Notes / Banner */}
          {menu.notes && (
            <div style={{
              background: 'rgba(168, 85, 247, 0.12)',
              borderLeft: '4px solid var(--accent-purple)',
              padding: '10px 14px',
              borderRadius: '0 var(--radius-md) var(--radius-md) 0',
              color: 'var(--text-primary)',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Clock size={16} color="var(--accent-purple)" />
              <span>{menu.notes}</span>
            </div>
          )}

          {/* Deadline Warning */}
          {isOrderDeadlinePassed && (
            <div style={{
              marginTop: '12px',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              color: '#fca5a5',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <AlertCircle size={16} />
              <span>Horário limite de pedidos atingido. Novos pedidos exigem autorização do gerenciador.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MenuCard;
