from __future__ import annotations

from fastapi import APIRouter

from utils.error_tracker import error_tracker


router = APIRouter(prefix="/monitoring", tags=["Monitoring"])


@router.get("/health")
async def health_check():
    """Health check endpoint untuk monitoring layer."""
    return {"status": "healthy", "service": "SafeSpace API"}


@router.get("/error-rate")
async def get_error_rate():
    """Ambil statistik error rate 1 menit terakhir."""
    stats = error_tracker.get_stats()
    return stats