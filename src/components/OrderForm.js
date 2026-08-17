import React, { useState } from 'react';
import { User, Utensils, Box, Plus, CheckCircle, MessageSquare } from 'lucide-react';

const OrderForm = ({ onAddOrUpdateOrder, existingNames = [], isOrderDeadlinePassed }) => {
  const [name, setName] = useState('');
  const [meals, setMeals] = useState(1);
  const [boxes, setBoxes] = useState(0);
  const [note, setNote] = useState('');
  const [submittedMessage, setSubmittedMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanName = name.trim();
    if (!cleanName) return;

    onAddOrUpdateOrder({
      id: cleanName.toLowerCase(),
      name: cleanName,
      meals: Number(meals),
      boxes: Number(boxes),
      note: note.trim(),
      updatedAt: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    });

    setSubmittedMessage(`Pedido de ${cleanName} gravado com sucesso!`);
    setTimeout(() => setSubmittedMessage(''), 3000);

    // Reset inputs except keep name for easy reference
    setMeals(1);
    setBoxes(0);
    setNote('');
  };

  const handleSelectExistingName = (selectedName) => {
    setName(selectedName);
  };

  return (
    <div className="glass-panel animate-fade-in" style={{
      marginBottom: '24px',
      padding: '24px'
    }}>
      <h3 style={{
        fontSize: '1.25rem',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        color: 'var(--text-primary)'
      }}>
        ✍️ Colocar Nome na Lista
      </h3>

      {submittedMessage && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          color: '#34d399',
          padding: '12px 16px',
          borderRadius: 'var(--radius-md)',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.9rem'
        }}>
          <CheckCircle size={18} />
          <span>{submittedMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        
        {/* Name Field */}
        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
            Seu Nome (Morador / Convidado) *
          </label>
          <div style={{ position: 'relative' }}>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Ex: Edgar, Lucas, Marina..." 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
              style={{ paddingLeft: '40px' }}
            />
            <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-purple)' }} />
          </div>

          {/* Quick Name Pills if available */}
          {existingNames.length > 0 && !name && (
            <div style={{ marginTop: '8px', display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sugestões:</span>
              {existingNames.slice(0, 5).map(n => (
                <button 
                  key={n}
                  type="button" 
                  onClick={() => handleSelectExistingName(n)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-secondary)',
                    borderRadius: '12px',
                    padding: '2px 8px',
                    fontSize: '0.75rem',
                    cursor: 'pointer'
                  }}
                >
                  {n}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quantities Selector Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px'
        }}>
          
          {/* Refeições no local */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.4)',
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <Utensils size={18} color="var(--accent-purple)" />
              <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Refeição no Local</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                {[0, 1, 2, 3].map(num => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setMeals(num)}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: 'var(--radius-sm)',
                      border: meals === num ? '2px solid var(--accent-purple)' : '1px solid var(--border-color)',
                      background: meals === num ? 'rgba(168, 85, 247, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                      color: meals === num ? '#ffffff' : 'var(--text-secondary)',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {num}
                  </button>
                ))}
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>pratos</span>
            </div>
          </div>

          {/* Marmitas */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.4)',
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <Box size={18} color="var(--accent-sunset)" />
              <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Marmitas para Levar</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                {[0, 1, 2, 3].map(num => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setBoxes(num)}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: 'var(--radius-sm)',
                      border: boxes === num ? '2px solid var(--accent-sunset)' : '1px solid var(--border-color)',
                      background: boxes === num ? 'rgba(249, 115, 22, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                      color: boxes === num ? '#ffffff' : 'var(--text-secondary)',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {num}
                  </button>
                ))}
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>marmitas</span>
            </div>
          </div>

        </div>

        {/* Note / Special instructions */}
        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
            Observação (Opcional)
          </label>
          <div style={{ position: 'relative' }}>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Ex: Chego 13h / Sem salada / Guardar marmita na geladeira" 
              value={note} 
              onChange={(e) => setNote(e.target.value)} 
              style={{ paddingLeft: '40px' }}
            />
            <MessageSquare size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-teal)' }} />
          </div>
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          className="btn btn-primary"
          style={{ width: '100%', padding: '14px', fontSize: '1rem', marginTop: '4px' }}
          disabled={isOrderDeadlinePassed}
        >
          <Plus size={20} /> Confimar Pedido na Lista 🍱
        </button>

      </form>
    </div>
  );
};

export default OrderForm;
