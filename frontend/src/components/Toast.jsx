import { useEffect } from "react"

function Toast({ toasts, onRemove }) {
  return (
    <div style={styles.container}>
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  )
}

function ToastItem({ toast, onRemove }) {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), 3000)
    return () => clearTimeout(timer)
  }, [toast.id, onRemove])

  const isSuccess = toast.type === "success"

  return (
    <div style={{
      ...styles.toast,
      backgroundColor: isSuccess ? "#E2EFDA" : "#FBE5D6",
      borderLeft: `4px solid ${isSuccess ? "#548235" : "#C00000"}`,
      color: isSuccess ? "#548235" : "#C00000",
    }}>
      <span>{toast.message}</span>
      <button onClick={() => onRemove(toast.id)} style={styles.close}>x</button>
    </div>
  )
}

const styles = {
  container: {
    position: "fixed",
    top: "1.5rem",
    right: "1.5rem",
    zIndex: 9999,
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    maxWidth: "320px",
  },
  toast: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.75rem 1rem",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    fontSize: "0.9rem",
    fontWeight: "bold",
  },
  close: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "0.85rem",
    color: "inherit",
    marginLeft: "0.5rem",
    opacity: 0.7,
  },
}

export default Toast