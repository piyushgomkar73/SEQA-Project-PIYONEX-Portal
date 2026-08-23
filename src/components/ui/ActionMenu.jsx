import { useState, useRef, useEffect } from 'react';
import { MoreHorizontal } from 'lucide-react';

export default function ActionMenu({ items }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="dropdown" ref={ref}>
      <button
        className="btn btn-ghost btn-icon"
        onClick={(e) => { e.stopPropagation(); setOpen(o => !o); }}
        style={{ padding: '5px' }}
      >
        <MoreHorizontal size={16} color="var(--color-gray-500)" />
      </button>
      {open && (
        <div className="dropdown-menu">
          {items.map((item, i) => (
            item.divider ? (
              <div key={i} className="dropdown-divider" />
            ) : (
              <button
                key={i}
                className={`dropdown-item ${item.danger ? 'danger' : ''}`}
                onClick={(e) => { e.stopPropagation(); setOpen(false); item.onClick?.(); }}
              >
                {item.icon && <span>{item.icon}</span>}
                {item.label}
              </button>
            )
          ))}
        </div>
      )}
    </div>
  );
}
