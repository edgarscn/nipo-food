import React, { useState } from 'react';
import { User, Utensils, Box, Plus, CheckCircle, MessageSquare, Lock } from 'lucide-react';

const OrderForm = ({ onAddOrUpdateOrder, existingNames = [], isOrderDeadlinePassed, isManager, deadlineTime = "10:00" }) => {
  const [name, setName] = useState('');
  const [meals, setMeals] = useState(1);
  const [boxes, setBoxes] = useState(0);
  const [note, setNote] = useState('');
  const [submittedMessage, setSubmittedMessage] = useState('');

  const isDisabled = isOrderDeadlinePassed && !isManager;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isDisabled) return;
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

    setMeals(1);
    setBoxes(0);
    setNote('');
  };

  const handleSelectExistingName = (selectedName) => {
    if (!isDisabled) {
      setName(selectedName);
    }
  };

  return (
    <div className="glass-panel animate-fade-in" style={{
      marginBottom: '24px',
      padding: '24px',
      opacity: isDisabled ? 0.9 : 1
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{
          fontSize: '1.25rem',
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: 'var(--text-primary)'
        }}>
          ✍️ Colocar Nome na Lista
        </h3>
        <span style={{ fontSize: '0.8rem', color: 'var(--color-yellow)' }}>
          Horário Limite: <strong>{deadlineTime}h</strong>
        </span>
      </div>

      {/* Deadline Passed Alert */}
      {isDisabled && (
        <div style={{
          background: 'rgba(245, 194, 59, 0.15)',
          border: '1px solid var(--color-yellow)',
          color: 'var(--color-yellow)',
          padding: '12px 16px',
          borderRadius: 'var(--radius-md)',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.875rem'
        }}>
          <Lock size={20} style={{ flexShrink: 0 }} color="var(--color-yellow)" />
          <span>
            <strong>Inscrições Encerradas ({deadlineTime}h)</strong>: Não é mais possível incluir novos pedidos para o almoço de hoje. Fale com o gerenciador se precisar de exceção.
          </span>
        </div>
      )}

      {submittedMessage && (
        <div style={{
          background: 'rgba(30, 101, 181, 0.3)',
          border: '1px solid var(--color-yellow)',
          color: 'var(--color-yellow)',
          padding: '12px 16px',
          borderRadius: 'var(--radius-md)',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.9rem'
        }}>
          <CheckCircle size={18} color="var(--color-yellow)" />
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
              placeholder={isDisabled ? `Inscrições bloqueadas desde às ${deadlineTime}h` : "Digite seu nome..."} 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required={!isDisabled}
              disabled={isDisabled}
              style={{ paddingLeft: '40px', opacity: isDisabled ? 0.6 : 1 }}
            />
            <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-yellow)' }} />
          </div>

          {/* Quick Name Pills */}
          {existingNames.length > 0 && !name && !isDisabled && (
            <div style={{ marginTop: '8px', display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sugestões:</span>
              {existingNames.slice(0, 5).map(n => (
                <button 
                  key={n}
                  type="button" 
                  onClick={() => handleSelectExistingName(n)}
                  style={{
                    background: 'var(--color-blue)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#FFFFFF',
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
          gap: '16px',
          opacity: isDisabled ? 0.6 : 1
        }}>
          
          {/* Refeições no local */}
          <div style={{
            background: 'rgba(26, 13, 40, 0.4)',
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <Utensils size={18} color="var(--color-yellow)" />
              <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Refeição no Local</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                {[0, 1, 2, 3].map(num => (
                  <button
                    key={num}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => setMeals(num)}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: 'var(--radius-sm)',
                      border: meals === num ? '2px solid var(--color-yellow)' : '1px solid var(--border-color)',
                      background: meals === num ? 'var(--color-yellow)' : 'rgba(255, 255, 255, 0.05)',
                      color: meals === num ? '#1A0D28' : 'var(--text-secondary)',
                      fontWeight: 700,
                      cursor: isDisabled ? 'not-allowed' : 'pointer',
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
            background: 'rgba(26, 13, 40, 0.4)',
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <Box size={18} color="var(--color-blue)" />
              <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Marmitas para Levar</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                {[0, 1, 2, 3].map(num => (
                  <button
                    key={num}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => setBoxes(num)}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: 'var(--radius-sm)',
                      border: boxes === num ? '2px solid var(--color-blue)' : '1px solid var(--border-color)',
                      background: boxes === num ? 'var(--color-blue)' : 'rgba(255, 255, 255, 0.05)',
                      color: boxes === num ? '#FFFFFF' : 'var(--text-secondary)',
                      fontWeight: 700,
                      cursor: isDisabled ? 'not-allowed' : 'pointer',
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

        {/* Note (Placeholder cleaned without examples) */}
        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
            Observação (Opcional)
          </label>
          <div style={{ position: 'relative' }}>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Observação..." 
              value={note} 
              onChange={(e) => setNote(e.target.value)} 
              disabled={isDisabled}
              style={{ paddingLeft: '40px', opacity: isDisabled ? 0.6 : 1 }}
            />
            <MessageSquare size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-blue)' }} />
          </div>
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          className={isDisabled ? "btn btn-secondary" : "btn btn-primary"}
          style={{ 
            width: '100%', 
            padding: '14px', 
            fontSize: '1rem', 
            marginTop: '4px',
            opacity: isDisabled ? 0.6 : 1,
            cursor: isDisabled ? 'not-allowed' : 'pointer'
          }}
          disabled={isDisabled}
        >
          {isDisabled ? (
            <> <Lock size={18} /> Inscrições Bloqueadas ({deadlineTime}h) </>
          ) : (
            <> <Plus size={20} /> Confirmar Pedido na Lista 🍱 </>
          )}
        </button>

      </form>
    </div>
  );
};

export default OrderForm;
