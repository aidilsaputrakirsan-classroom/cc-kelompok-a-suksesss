from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Cloud App API",
    description="API untuk mata kuliah Komputasi Awan",
    version="0.1.0"
)

# CORS - agar frontend bisa akses API ini
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Untuk development saja
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message": "Hello from Cloud App API!",
        "status": "running",
        "version": "0.1.0"
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.get("/team")
def team_info():
    return {
        "team": "cloud-team-suksesss",
        "members": [
            # TODO: Isi dengan data tim Anda
            {"name": "Rendy Rifandy Kurnia", "nim": "10231081", "role": "Lead Backend"},
            {"name": "Riska Fadlun Khairiyah Purba", "nim": "10231083", "role": "Lead Frontend"},
            {"name": "Rizki Abdul Aziz", "nim": "10231085", "role": "Lead DevOps"},
            {"name": "Siti Nur Azizah Putri Awni", "nim": "10231087", "role": "Lead QA & Docs"},
        ]
    }