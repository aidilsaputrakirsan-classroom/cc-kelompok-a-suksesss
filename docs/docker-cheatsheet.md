# Docker Cheatsheet — SafeSpace (cc-kelompok-a-suksesss)

## BUILD
| Command | Fungsi |
|---------|--------|
| `docker build -t safespace-backend:v1 .` | Build image backend |
| `docker build -t safespace-frontend:v1 .` | Build image frontend |
| `docker build --no-cache -t safespace-backend:v1 .` | Build ulang tanpa cache |

## RUN
| Command | Fungsi |
|---------|--------|
| `docker run -p 8000:8000 --env-file .env safespace-backend:v1` | Jalankan backend |
| `docker run -p 3000:80 safespace-frontend:v1` | Jalankan frontend |
| `docker run -d -p 8000:8000 --name backend safespace-backend:v1` | Jalankan backend di background |
| `docker run -d -p 3000:80 --name frontend safespace-frontend:v1` | Jalankan frontend di background |

## INSPECT
| Command | Fungsi |
|---------|--------|
| `docker ps` | Lihat container yang sedang berjalan |
| `docker ps -a` | Lihat semua container termasuk yang stopped |
| `docker logs backend` | Lihat log container backend |
| `docker logs -f backend` | Ikuti log secara real-time |
| `docker exec -it backend bash` | Masuk ke dalam container backend |

## STOP & REMOVE
| Command | Fungsi |
|---------|--------|
| `docker stop backend` | Hentikan container backend |
| `docker stop frontend` | Hentikan container frontend |
| `docker rm backend` | Hapus container backend |
| `docker rm frontend` | Hapus container frontend |
| `docker stop $(docker ps -q)` | Stop semua container sekaligus |
| `docker rm $(docker ps -aq)` | Hapus semua container sekaligus |

## IMAGE MANAGEMENT
| Command | Fungsi |
|---------|--------|
| `docker images` | Lihat semua image lokal |
| `docker rmi safespace-backend:v1` | Hapus image backend |
| `docker rmi safespace-frontend:v1` | Hapus image frontend |
| `docker image prune` | Hapus dangling images (tanpa tag) |
| `docker system prune -a` | ⚠️ Hapus SEMUA image & container tidak terpakai |

## REGISTRY (Docker Hub)
| Command | Fungsi |
|---------|--------|
| `docker login` | Login ke Docker Hub |
| `docker tag safespace-backend:v1 rizkiiaaz/safespace-backend:v1` | Tag image backend |
| `docker tag safespace-frontend:v1 rizkiiaaz/safespace-frontend:v1` | Tag image frontend |
| `docker push rizkiiaaz/safespace-backend:v1` | Push image backend ke Docker Hub |
| `docker push rizkiiaaz/safespace-frontend:v1` | Push image frontend ke Docker Hub |
| `docker pull rizkiiaaz/safespace-backend:v1` | Pull image backend dari Docker Hub |
| `docker pull rizkiiaaz/safespace-frontend:v1` | Pull image frontend dari Docker Hub |

## DOCKER COMPOSE (SHORTCUT)
| Command | Fungsi |
|---------|--------|
| `docker compose up -d` | Jalankan aplikasi secara otomatis di background (tanpa ribet) |
| `docker compose down` | Hentikan aplikasi dan bersihkan port secara rapi |
| `docker compose logs -f` | Lihat log aplikasi secara real-time |
| `docker compose stop` | Pause container sementara tanpa menghapusnya |