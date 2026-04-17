.PHONY: up down build logs ps clean restart shell-backend shell-db shell-frontend

# Start semua services
up:
	docker compose up -d

# Start dengan rebuild (Gunakan ini kalau ada kodingan baru)
build:
	docker compose up --build -d

# Stop & remove containers (Data aman)
down:
	docker compose down

# Stop, remove, DAN hapus volumes (⚠️ AWAS: Seluruh data database hilang!)
clean:
	docker compose down -v
	docker system prune -f

# Restart semua services
restart:
	docker compose restart

# Lihat logs secara real-time (semua services)
logs:
	docker compose logs -f

# Lihat logs khusus backend saja
logs-backend:
	docker compose logs -f backend

# Lihat status container yang sedang berjalan
ps:
	docker compose ps

# Masuk ke terminal backend
shell-backend:
	docker compose exec backend bash

# Masuk ke dalam PostgreSQL database
shell-db:
	docker compose exec db psql -U postgres -d safespace

# Masuk ke terminal frontend
shell-frontend:
	docker compose exec frontend sh