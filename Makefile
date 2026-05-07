.PHONY: up down build logs ps clean restart shell-backend shell-db shell-frontend lint test pr-check

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

# Jalankan linter untuk mengecek kerapian kode
lint:
	@echo "Menjalankan linter..."
	cd frontend && npm run lint

# Jalankan unit test
test:
	@echo "Menjalankan unit tests Backend (Pytest)..."
	cd backend && pytest
	@echo "Menjalankan unit tests Frontend (Vitest)..."
	cd frontend && npm test

# Cek kesiapan kodingan sebelum di-merge (PR Check)
pr-check:
	@echo "Menjalankan PR checks lokal (Lint, Build & Test)..."
	make lint
	make test
	make build
	@echo "✅ Semua check lokal berhasil! Kodingan aman untuk di-push dan di-PR."