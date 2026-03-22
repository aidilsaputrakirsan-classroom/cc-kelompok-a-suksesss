function Spinner() {
  return (
    <div style={styles.wrapper}>
      <div style={styles.spinner}></div>
      <p style={styles.text}>Memuat data...</p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "3rem",
    gap: "1rem",
  },
  spinner: {
    width: "48px",
    height: "48px",
    border: "5px solid #e0e0e0",
    borderTop: "5px solid #1F4E79",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  text: {
    color: "#888",
    fontSize: "0.95rem",
    margin: 0,
  },
}

export default Spinner