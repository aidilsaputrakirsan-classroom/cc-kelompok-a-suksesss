function SortBar({ sortBy, onSortChange }) {
  return (
    <div style={styles.wrapper}>
      <label style={styles.label}>Urutkan berdasarkan:</label>
      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
        style={styles.select}
      >
        <option value="terbaru">🕐 Terbaru</option>
        <option value="nama">🔤 Nama</option>
        <option value="harga">💰 Harga</option>
      </select>
    </div>
  )
}

const styles = {
  wrapper: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    marginBottom: "1rem",
  },
  label: {
    fontWeight: "600",
    color: "#444",
  },
  select: {
    padding: "0.4rem 0.8rem",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "0.95rem",
    cursor: "pointer",
  },
}

export default SortBar