import React, { useState } from 'react';
import { Search, Trash2, Edit2, Utensils, Box, Clock, MessageSquare, Lock } from 'lucide-react';

const OrderList = ({ orders, onDeleteOrder, onEditOrder, isManager, isOrderDeadlinePassed, deadlineTime = "10:00" }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOrders = orders.filter(o => 
    o.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (o.note && o.note.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const isActionsLocked = isOrderDeadlinePassed && !isManager;

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
            📋 Lista de Confirmados ({orders.length})
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>
            {isActionsLocked ? (
              <span style={{ color: 'var(--color-yellow)', display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                <Lock size={13} color="var(--color-yellow)" /> Alterações bloqueadas desde às {deadlineTime}h
              </span>
            ) : (
              "Moradores que solicitaram almoço ou marmita hoje"
            )}
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
            <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-yellow)' }} />
          </div>
        )}
      </div>

      {/* Empty State */}
      {filteredOrders.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px 20px',
          background: 'rgba(26, 13, 40, 0.4)',
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
            {searchTerm ? "Tente buscar por outro nome." : "Moradores podem se inscrever até o horário limite das " + deadlineTime + "h."}
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
                background: 'rgba(26, 13, 40, 0.6)',
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
                {/* Top Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'var(--color-yellow)',
                      color: '#1A0D28',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '0.85rem'
                    }}>
                      {order.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1.05rem', color: '#FFFFFF', lineHeight: 1.2 }}>
                        {order.name}
                      </h4>
                      {order.updatedAt && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={12} color="var(--color-yellow)" /> {order.updatedAt}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  {!isActionsLocked ? (
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {onEditOrder && (
                        <button
                          onClick={() => onEditOrder(order)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--color-yellow)',
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
                          color: 'var(--color-yellow)',
                          cursor: 'pointer',
                          padding: '4px',
                          borderRadius: '4px'
                        }}
                        title="Remover pedido da lista"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ) : (
                    <span title={`Exclusão bloqueada após às ${deadlineTime}h`} style={{ color: 'var(--text-muted)', padding: '4px' }}>
                      <Lock size={14} color="var(--color-yellow)" />
                    </span>
                  )}
                </div>

                {/* Items Badges in Yellow & Blue */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: order.note ? '10px' : '0' }}>
                  {order.meals > 0 && (
                    <span style={{
                      background: 'rgba(245, 194, 59, 0.18)',
                      color: 'var(--color-yellow)',
                      border: '1px solid var(--color-yellow)',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}>
                      <Utensils size={14} color="var(--color-yellow)" /> {order.meals} Presencial{order.meals > 1 ? 'is' : ''}
                    </span>
                  )}

                  {order.boxes > 0 && (
                    <span style={{
                      background: 'var(--color-blue)',
                      color: '#FFFFFF',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}>
                      <Box size={14} color="#FFFFFF" /> {order.boxes} Marmita{order.boxes > 1 ? 's' : ''}
                    </span>
                  )}

                  {order.meals === 0 && order.boxes === 0 && (
                    <span style={{
                      background: 'rgba(255, 255, 255, 0.08)',
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
                    background: 'rgba(30, 101, 181, 0.2)',
                    padding: '6px 10px',
                    borderRadius: 'var(--radius-sm)',
                    marginTop: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <MessageSquare size={13} color="var(--color-yellow)" />
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
