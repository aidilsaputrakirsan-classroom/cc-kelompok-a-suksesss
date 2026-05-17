"""Test endpoint otentikasi SafeSpace."""

def test_register_counselor_success(client):
    """Test register konselor baru berhasil -> 201."""
    response = client.post("/auth/counselors/register", json={
        "email": "guru_bk1@example.com",
        "password": "Password123",
        "name": "Guru BK Satu"
    })
    assert response.status_code == 201
    assert response.json()["email"] == "guru_bk1@example.com"

def test_register_counselor_duplicate(client):
    """Test register dengan email yang sudah ada -> 400."""
    # Register pertama
    client.post("/auth/counselors/register", json={
        "email": "guru_bk2@example.com",
        "password": "Password123",
        "name": "Guru BK Dua"
    })
    # Register kedua dengan email yang sama
    response = client.post("/auth/counselors/register", json={
        "email": "guru_bk2@example.com",
        "password": "BedaPassword123",
        "name": "Guru BK Kembar"
    })
    assert response.status_code == 400
    assert response.json()["detail"] == "Email sudah terdaftar"

def test_login_counselor_success(client):
    """Test login dengan kredensial benar -> 200 dan return token."""
    # Register dulu
    client.post("/auth/counselors/register", json={
        "email": "guru_bk3@example.com",
        "password": "Password123",
        "name": "Guru BK Tiga"
    })
    # Lalu coba Login
    response = client.post("/auth/counselor/login", json={
        "email": "guru_bk3@example.com",
        "password": "Password123"
    })
    assert response.status_code == 200
    assert "access_token" in response.json()

def test_login_counselor_wrong_password(client):
    """Test login dengan password salah -> 401."""
    # Register dulu
    client.post("/auth/counselors/register", json={
        "email": "guru_bk4@example.com",
        "password": "Password123",
        "name": "Guru BK Empat"
    })
    # Coba Login dengan password salah
    response = client.post("/auth/counselor/login", json={
        "email": "guru_bk4@example.com",
        "password": "SalahPasswordBos"
    })
    assert response.status_code == 401
    assert response.json()["detail"] == "Email atau password konselor salah"

def test_get_me_unauthorized(client):
    """Test mengakses profil tanpa token (belum login) -> 401."""
    response = client.get("/auth/me")
    assert response.status_code == 401