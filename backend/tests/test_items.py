"""Test endpoint untuk SafeSpace API."""

def test_get_team_info(client):
    """Test endpoint /team -> 200 dan memastikan nama tim benar."""
    response = client.get("/team")
    assert response.status_code == 200
    data = response.json()
    assert data["team"] == "cloud-team-suksesss"

def test_get_public_counselors(client):
    """Test ambil daftar konselor publik -> 200."""
    response = client.get("/api/public/counselors")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_get_consultations_unauthorized(client):
    """Test akses data dashboard BK tanpa login -> harus 401 Unauthorized."""
    response = client.get("/api/bk/consultations")
    assert response.status_code == 401

def test_get_public_master_data(client):
    """Test ambil master data publik -> 200."""
    response = client.get("/api/public/master-data")
    assert response.status_code == 200