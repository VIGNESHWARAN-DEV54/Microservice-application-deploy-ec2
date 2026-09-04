import React from 'react';
import { useToast } from '../context/ToastContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  if (!toasts.length) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={18} className="toast-icon text-emerald-400" />;
      case 'error':
        return <AlertCircle size={18} className="toast-icon text-rose-400" />;
      default:
        return <Info size={18} className="toast-icon text-indigo-400" />;
    }
  };

  const getBorderColor = (type) => {
    switch (type) {
      case 'success':
        return 'rgba(16, 185, 129, 0.4)';
      case 'error':
        return 'rgba(244, 63, 94, 0.4)';
      default:
        return 'rgba(99, 102, 241, 0.4)';
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxWidth: '380px',
        width: '100%',
        pointerEvents: 'none',
      }}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          style={{
            pointerEvents: 'auto',
            background: 'rgba(15, 23, 42, 0.92)',
            backdropFilter: 'blur(12px)',
            border: `1px solid ${getBorderColor(toast.type)}`,
            borderRadius: '12px',
            padding: '12px 16px',
            color: '#f8fafc',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justify: 'space-between',
            gap: '12px',
            animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {getIcon(toast.type)}
            <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{toast.message}</span>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            style={{
              color: '#94a3b8',
              padding: '2px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
