import { useEffect } from 'react'

function Toast({ toasts, onRemove }) {
  return (
    <>
      <style>{toastStyles}</style>
      <div className="toast-stack">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onRemove={onRemove} />
        ))}
      </div>
    </>
  )
}

function ToastItem({ toast, onRemove }) {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), 3200)
    return () => clearTimeout(timer)
  }, [toast.id, onRemove])

  const isSuccess = toast.type === 'success'

  return (
    <div className={`toast-item ${isSuccess ? 'toast-success' : 'toast-error'}`}>
      <span className="toast-icon">{isSuccess ? '✓' : '⚠'}</span>
      <span className="toast-msg">{toast.message}</span>
      <button className="toast-close" onClick={() => onRemove(toast.id)}>×</button>
    </div>
  )
}

const toastStyles = `
  @keyframes toast-in {
    from { opacity: 0; transform: translateX(20px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  .toast-stack {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: 8px;
    max-width: 340px;
  }

  .toast-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 16px;
    border-radius: 12px;
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    box-shadow: 0 8px 32px rgba(3,5,15,0.4);
    font-size: 0.875rem;
    font-weight: 500;
    animation: toast-in 0.25s ease forwards;
    border: 1px solid;
  }

  .toast-success {
    background: rgba(13,148,136,0.15);
    border-color: rgba(45,212,191,0.25);
    color: #2dd4bf;
  }

  .toast-error {
    background: rgba(239,68,68,0.12);
    border-color: rgba(239,68,68,0.25);
    color: #fca5a5;
  }

  .toast-icon {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: currentColor;
    color: #06080f;
    display: grid;
    place-items: center;
    font-size: 0.7rem;
    font-weight: 800;
    flex-shrink: 0;
  }

  .toast-msg {
    flex: 1;
    color: #f0eeff;
  }

  .toast-close {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.1rem;
    line-height: 1;
    color: rgba(180,175,220,0.5);
    padding: 0 2px;
    transition: color 0.2s;
  }
  .toast-close:hover { color: #f0eeff; }
`

export default Toast