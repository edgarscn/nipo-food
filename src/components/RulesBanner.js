import React, { useState } from 'react';
import { Info, ChevronDown, ChevronUp, Clock, AlertTriangle, RotateCcw, CheckCircle2 } from 'lucide-react';

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
              Máquinas 1, 2 e 4 • Confirmação de uso • Reset às 23:59
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
          gap: '12px',
          fontSize: '0.85rem'
        }}>
          
          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
            <Clock size={16} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong style={{ color: 'var(--text-primary)' }}>3 Horários Diários:</strong>
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                Manhã (<strong>08:00</strong>), Tarde (<strong>14:00</strong>) e Noite (<strong>21:00</strong>).
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
            <AlertTriangle size={16} color="var(--color-warning)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong style={{ color: 'var(--color-warning)' }}>Confirmação Obrigatória:</strong>
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                Abre <strong>2h antes</strong> e fecha <strong>25 min após</strong> o horário. Se não confirmar, a vaga é liberada automaticamente!
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
            <RotateCcw size={16} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong style={{ color: 'var(--text-primary)' }}>Zerar às 23:59:</strong>
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                Todas as noites às <strong>23:59</strong> o quadro é limpo para o dia seguinte.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
            <CheckCircle2 size={16} color="var(--color-success)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong style={{ color: 'var(--color-success)' }}>Sem Limite de Vagas:</strong>
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                Você pode agendar quantos horários e máquinas precisar no dia.
              </p>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default RulesBanner;
