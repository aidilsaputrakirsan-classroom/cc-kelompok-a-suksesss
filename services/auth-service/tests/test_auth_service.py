def test_register_login_and_verify(client):
    register_response = client.post(
        "/register",
        json={
            "email": "guru@example.com",
            "name": "Guru BK",
            "password": "Password123",
        },
    )
    assert register_response.status_code == 201
    assert register_response.json()["email"] == "guru@example.com"

    login_response = client.post(
        "/login",
        json={
            "email": "guru@example.com",
            "password": "Password123",
        },
    )
    assert login_response.status_code == 200
    body = login_response.json()
    assert "access_token" in body
    assert body["user"]["email"] == "guru@example.com"

    verify_response = client.get(
        "/verify",
        headers={"Authorization": f"Bearer {body['access_token']}"},
    )
    assert verify_response.status_code == 200
    assert verify_response.json()["email"] == "guru@example.com"


def test_duplicate_register_returns_400(client):
    client.post(
        "/register",
        json={
            "email": "duplicate@example.com",
            "name": "Guru BK",
            "password": "Password123",
        },
    )
    duplicate_response = client.post(
        "/register",
        json={
            "email": "duplicate@example.com",
            "name": "Guru BK 2",
            "password": "Password123",
        },
    )
    assert duplicate_response.status_code == 400
