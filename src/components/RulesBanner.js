import React, { useState } from 'react';
import { Info, ChevronDown, ChevronUp, Clock, AlertTriangle, RotateCcw, Calendar, ShieldCheck } from 'lucide-react';

const RulesBanner = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="glass-panel animate-fade-in" style={{
      marginBottom: '20px',
      padding: '16px 20px',
      borderLeft: '4px solid var(--color-primary)'
    }}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          userSelect: 'none'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Info size={20} color="var(--color-primary)" />
          <div>
            <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', margin: 0 }}>
              Regras de Uso da Lavanderia
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
              Máquinas 1, 2 e 4 • Toda a semana • Reset domingo 23:59 • Admin (1531)
            </p>
          </div>
        </div>

        <button 
          style={{ background: 'transparent', border: 'none', color: 'var(--color-primary)', cursor: 'pointer' }}
          aria-label={isOpen ? "Ocultar regras" : "Ver regras"}
        >
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

      {isOpen && (
        <div style={{
          marginTop: '16px',
          paddingTop: '16px',
          borderTop: '1px solid var(--border-color)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '14px',
          fontSize: '0.85rem'
        }}>
          
          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
            <Calendar size={16} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong style={{ color: 'var(--text-primary)' }}>Agendamento Semanal Aberto:</strong>
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                Você pode agendar horários em qualquer dia da semana (Segunda a Domingo) em quantas máquinas e turnos desejar.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
            <Clock size={16} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong style={{ color: 'var(--text-primary)' }}>3 Horários Diários:</strong>
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                Manhã (<strong>08:00</strong>), Tarde (<strong>14:00</strong>) e Noite (<strong>21:00</strong>) para as máquinas 1, 2 e 4.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
            <AlertTriangle size={16} color="var(--color-warning)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong style={{ color: 'var(--color-warning)' }}>Confirmação Obrigatória:</strong>
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                • 08:00: confirmar de <strong>6:30 até 8h25</strong><br />
                • 14:00: confirmar de <strong>12:30 até 14h25</strong><br />
                • 21:00: confirmar de <strong>19:30 até 21h25</strong><br />
                Se não confirmar no app, o horário é liberado para outra pessoa!
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
            <RotateCcw size={16} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong style={{ color: 'var(--text-primary)' }}>Reset Todo Domingo às 23:59:</strong>
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                O quadro semanal é <strong>zerado automaticamente todo domingo às 23:59</strong> para a semana seguinte.
              </p>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default RulesBanner;
