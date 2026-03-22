import { useState, useEffect, useCallback } from "react"
import Header from "./components/Header"
import SearchBar from "./components/SearchBar"
import ItemForm from "./components/ItemForm"
import ItemList from "./components/ItemList"
import LoginPage from "./components/LoginPage"
import Toast from "./components/Toast"
import Spinner from "./components/Spinner"
import {
  fetchItems, createItem, updateItem, deleteItem,
  checkHealth, login, register, setToken, clearToken,
} from "./services/api"

function App() {
  // ==================== AUTH STATE ====================
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // ==================== APP STATE ====================
  const [items, setItems] = useState([])
  const [totalItems, setTotalItems] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isConnected, setIsConnected] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")

  // ==================== TOAST STATE ====================
  const [toasts, setToasts] = useState([])

  const showToast = (message, type = "success") => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])
  }

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  // ==================== LOAD DATA ====================
  const loadItems = useCallback(async (search = "") => {
    setLoading(true)
    try {
      const data = await fetchItems(search)
      setItems(data.items)
      setTotalItems(data.total)
    } catch (err) {
      if (err.message === "UNAUTHORIZED") {
        handleLogout()
      }
      console.error("Error loading items:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    checkHealth().then(setIsConnected)
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      loadItems()
    }
  }, [isAuthenticated, loadItems])

  // ==================== AUTH HANDLERS ====================

  const handleLogin = async (email, password) => {
    const data = await login(email, password)
    setUser(data.user)
    setIsAuthenticated(true)
  }

  const handleRegister = async (userData) => {
    // Register lalu otomatis login
    await register(userData)
    await handleLogin(userData.email, userData.password)
  }

  const handleLogout = () => {
    clearToken()
    setUser(null)
    setIsAuthenticated(false)
    setItems([])
    setTotalItems(0)
    setEditingItem(null)
    setSearchQuery("")
  }

  // ==================== ITEM HANDLERS ====================

  const handleSubmit = async (itemData, editId) => {
    try {
      if (editId) {
        await updateItem(editId, itemData)
        setEditingItem(null)
        showToast("Item berhasil diperbarui")
      } else {
        await createItem(itemData)
        showToast("Item berhasil ditambahkan")
      }
      loadItems(searchQuery)
    } catch (err) {
      if (err.message === "UNAUTHORIZED") handleLogout()
      else {
        showToast(err.message || "Gagal menyimpan item", "error")
        throw err
      }
    }
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleDelete = async (id) => {
    const item = items.find((i) => i.id === id)
    if (!window.confirm(`Yakin ingin menghapus "${item?.name}"?`)) return
    try {
      await deleteItem(id)
      showToast("Item berhasil dihapus")
      loadItems(searchQuery)
    } catch (err) {
      if (err.message === "UNAUTHORIZED") handleLogout()
      else showToast("Gagal menghapus: " + err.message, "error")
    }
  }

  const handleSearch = (query) => {
    setSearchQuery(query)
    loadItems(query)
  }

  // ==================== RENDER ====================

  // Jika belum login, tampilkan login page
  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} onRegister={handleRegister} />
  }

  // Jika sudah login, tampilkan main app
  return (
    <div style={styles.app}>
      <Toast toasts={toasts} onRemove={removeToast} />
      <div style={styles.container}>
        <Header
          totalItems={totalItems}
          isConnected={isConnected}
          user={user}
          onLogout={handleLogout}
        />
        <ItemForm
          onSubmit={handleSubmit}
          editingItem={editingItem}
          onCancelEdit={() => setEditingItem(null)}
        />
        <SearchBar onSearch={handleSearch} />
        {loading ? (
          <Spinner />
        ) : (
          <ItemList
            items={items}
            onEdit={handleEdit}
            onDelete={handleDelete}
            loading={loading}
          />
        )}
      </div>
    </div>
  )
}

const styles = {
  app: {
    minHeight: "100vh",
    backgroundColor: "#f0f2f5",
    padding: "2rem",
    fontFamily: "'Segoe UI', Arial, sans-serif",
  },
  container: { maxWidth: "900px", margin: "0 auto" },
}

export default App