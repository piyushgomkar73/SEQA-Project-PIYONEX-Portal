import { X, AlertTriangle } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, size = 'md', footer }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal modal-${size}`} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}

export function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmLabel = 'Delete', variant = 'danger' }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-sm" onClick={e => e.stopPropagation()}>
        <div className="modal-body" style={{ padding: '28px 24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 14 }}>
            <div style={{
              width: 52, height: 52, borderRadius: '50%',
              background: variant === 'danger' ? 'var(--color-danger-bg)' : 'var(--color-warning-bg)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <AlertTriangle size={24} color={variant === 'danger' ? 'var(--color-danger)' : 'var(--color-warning)'} />
            </div>
            <div>
              <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 600, marginBottom: 8 }}>{title}</h3>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)' }}>{message}</p>
            </div>
            <div style={{ display: 'flex', gap: 10, width: '100%' }}>
              <button className="btn btn-secondary w-full" onClick={onClose}>Cancel</button>
              <button
                className={`btn btn-${variant} w-full`}
                onClick={() => { onConfirm(); onClose(); }}
              >
                {confirmLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
