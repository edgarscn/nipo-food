import React, { useState } from 'react';
import { Search, Trash2, Edit2, Utensils, Box, Clock, UserCheck, MessageSquare } from 'lucide-react';

const OrderList = ({ orders, onDeleteOrder, onEditOrder, isManager }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOrders = orders.filter(o => 
    o.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (o.note && o.note.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="glass-panel animate-fade-in" style={{
      padding: '24px',
      marginBottom: '24px'
    }}>
      {/* Header & Search */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            📋 Lista de Confirmados do Dia ({orders.length})
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>
            Moradores que solicitaram refeição ou marmita hoje
          </p>
        </div>

        {orders.length > 3 && (
          <div style={{ position: 'relative', width: '220px' }}>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Buscar morador..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '36px', padding: '8px 12px 8px 36px', fontSize: '0.85rem' }}
            />
            <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          </div>
        )}
      </div>

      {/* Empty State */}
      {filteredOrders.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px 20px',
          background: 'rgba(15, 23, 42, 0.3)',
          borderRadius: 'var(--radius-md)',
          border: '1px dashed var(--border-color)'
        }}>
          <div style={{
            fontSize: '2.5rem',
            marginBottom: '10px'
          }}>🍱</div>
          <h4 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
            {searchTerm ? "Nenhum resultado encontrado" : "Nenhum pedido na lista ainda"}
          </h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            {searchTerm ? "Tente buscar por outro nome." : "Utilize o formulário acima para colocar seu nome e garantir seu almoço/jantar!"}
          </p>
        </div>
      ) : (
        /* Orders List Cards */
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '14px'
        }}>
          {filteredOrders.map((order) => (
            <div 
              key={order.id || order.name} 
              style={{
                background: 'rgba(15, 23, 42, 0.5)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
              className="order-card"
            >
              <div>
                {/* Top Row: Resident Name & Time */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--accent-purple) 0%, var(--accent-sunset) 100%)',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.85rem'
                    }}>
                      {order.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', lineHeight: 1.2 }}>
                        {order.name}
                      </h4>
                      {order.updatedAt && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={12} /> {order.updatedAt}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {onEditOrder && (
                      <button
                        onClick={() => onEditOrder(order)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--text-muted)',
                          cursor: 'pointer',
                          padding: '4px',
                          borderRadius: '4px'
                        }}
                        title="Editar pedido"
                      >
                        <Edit2 size={15} />
                      </button>
                    )}
                    <button
                      onClick={() => onDeleteOrder(order.name)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'rgba(239, 68, 68, 0.7)',
                        cursor: 'pointer',
                        padding: '4px',
                        borderRadius: '4px'
                      }}
                      title="Remover pedido da lista"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {/* Items Badges */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: order.note ? '10px' : '0' }}>
                  {order.meals > 0 && (
                    <span style={{
                      background: 'rgba(168, 85, 247, 0.15)',
                      color: 'var(--accent-purple)',
                      border: '1px solid rgba(168, 85, 247, 0.3)',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}>
                      <Utensils size={14} /> {order.meals} Presencial{order.meals > 1 ? 'is' : ''}
                    </span>
                  )}

                  {order.boxes > 0 && (
                    <span style={{
                      background: 'rgba(249, 115, 22, 0.15)',
                      color: 'var(--accent-sunset)',
                      border: '1px solid rgba(249, 115, 22, 0.3)',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}>
                      <Box size={14} /> {order.boxes} Marmita{order.boxes > 1 ? 's' : ''}
                    </span>
                  )}

                  {order.meals === 0 && order.boxes === 0 && (
                    <span style={{
                      background: 'rgba(100, 116, 139, 0.15)',
                      color: 'var(--text-muted)',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '0.8rem'
                    }}>
                      Nenhuma refeição marcada
                    </span>
                  )}
                </div>

                {/* Note */}
                {order.note && (
                  <div style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-secondary)',
                    fontStyle: 'italic',
                    background: 'rgba(255, 255, 255, 0.04)',
                    padding: '6px 10px',
                    borderRadius: 'var(--radius-sm)',
                    marginTop: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <MessageSquare size={13} color="var(--accent-teal)" />
                    <span>"{order.note}"</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderList;
