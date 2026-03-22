const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"

// ==================== TOKEN MANAGEMENT ====================

let authToken = null

export function setToken(token) {
  authToken = token
  sessionStorage.setItem("authToken", token)
}

export function clearToken() {
  authToken = null
  sessionStorage.removeItem("authToken")
}

function authHeaders() {
  const token = authToken || sessionStorage.getItem("authToken")
  const headers = {}
  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }
  return headers
}

// Helper: handle response errors
async function handleResponse(response) {
  if (response.status === 401) {
    clearToken()
    throw new Error("UNAUTHORIZED")
  }
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    let detail = error.detail

    const translateMessage = (msg) => {
      if (!msg) return msg
      return msg
        .replace("String should have at least 2 characters", "Minimal 2 karakter")
        .replace("String should have at most 100 characters", "Maksimal 100 karakter")
        .replace("value is not a valid email address", "Format email tidak valid")
        .replace("field required", "Wajib diisi")
    }

    if (Array.isArray(detail)) {
      detail = detail
        .map((e) => `• ${translateMessage(e.message)}`)
        .join("\n")
    } else {
      detail = translateMessage(detail)
    }

    throw new Error(detail || `Permintaan gagal (${response.status})`)
  }
  // 204 No Content
  if (response.status === 204) return null
  return response.json()
}

// ==================== AUTH API ====================

export async function register(userData) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  })
  return handleResponse(response)
}

export async function login(email, password) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
  const data = await handleResponse(response)
  setToken(data.access_token)
  return data
}

export async function getMe() {
  const response = await fetch(`${API_URL}/auth/me`, {
    headers: authHeaders(),
  })
  return handleResponse(response)
}

// ==================== ITEMS API ====================

export async function fetchItems(search = "", skip = 0, limit = 20) {
  const params = new URLSearchParams()
  if (search) params.append("search", search)
  params.append("skip", skip)
  params.append("limit", limit)

  const response = await fetch(`${API_URL}/items?${params}`, {
    headers: authHeaders(),
  })
  return handleResponse(response)
}

export async function createItem(itemData) {
  const response = await fetch(`${API_URL}/items`, {
    method: "POST",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(itemData),
  })
  return handleResponse(response)
}

export async function updateItem(id, itemData) {
  const response = await fetch(`${API_URL}/items/${id}`, {
    method: "PUT",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(itemData),
  })
  return handleResponse(response)
}

export async function deleteItem(id) {
  const response = await fetch(`${API_URL}/items/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  })
  return handleResponse(response)
}

export async function checkHealth() {
  try {
    const response = await fetch(`${API_URL}/health`)
    const data = await response.json()
    return data.status === "healthy"
  } catch {
    return false
  }
}