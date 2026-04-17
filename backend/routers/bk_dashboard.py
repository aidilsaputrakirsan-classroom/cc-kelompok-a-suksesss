"""
Router untuk Dashboard Guru BK (Konselor)
Endpoints: GET /api/bk/dashboard/stats, GET /api/bk/consultations (dengan pagination)
Requirement UTS: Auth JWT, Protected Endpoints, Data Isolation, Swagger UI
"""

from fastapi import APIRouter, Query, Depends, HTTPException, status
from sqlalchemy.orm import Session

import crud
from auth import get_current_counselor
from database import get_db
from models import User
from schemas import DashboardStatsResponse, PaginatedConsultationListResponse, ConsultationListItemResponse


router = APIRouter(
    prefix="/api/bk",
    tags=["Dashboard BK"],
    dependencies=[Depends(get_current_counselor)],  # Semua endpoint di router ini protected
)


@router.get(
    "/dashboard/stats",
    response_model=DashboardStatsResponse,
    summary="Dashboard Statistics untuk Guru BK",
    description="Menampilkan ringkasan data konsultasi milik guru BK yang login (total, pending, accepted, rejected).",
    status_code=200,
)
def get_dashboard_stats(
    current_user: User = Depends(get_current_counselor),
    db: Session = Depends(get_db),
):
    """
    📊 Dashboard Statistics endpoint.
    
    Returns statistics untuk konsultasi yang dimiliki oleh guru BK yang sedang login.
    - total: Jumlah total konsultasi
    - pending: Jumlah konsultasi dengan status PENDING
    - accepted: Jumlah konsultasi dengan status ACCEPTED
    - rejected: Jumlah konsultasi dengan status REJECTED
    
    ✅ Data isolation: Hanya menampilkan data konsultasi untuk counselor_id = current_user.id
    
    TODO[FE]: Tampilkan stats ini di dashboard top card (4 kartu: Total, Pending, Accepted, Rejected)
    """
    # TODO[BE]: Validasi token & role sudah dihandle di dependency get_current_counselor
    stats = crud.get_dashboard_stats(db=db, counselor_id=current_user.id)
    return stats


@router.get(
    "/consultations",
    response_model=PaginatedConsultationListResponse,
    summary="Daftar Konsultasi dengan Pagination",
    description="Menampilkan daftar konsultasi milik guru BK dengan pagination (limit & offset).",
    status_code=200,
)
def list_consultations_paginated(
    limit: int = Query(10, ge=1, le=100, description="Jumlah data per halaman (default: 10, max: 100)"),
    offset: int = Query(0, ge=0, description="Offset data (default: 0)"),
    current_user: User = Depends(get_current_counselor),
    db: Session = Depends(get_db),
):
    """
    📋 Consultation List dengan Pagination endpoint.
    
    Returns daftar konsultasi yang dimiliki oleh guru BK dengan pagination.
    
    Query Parameters:
    - limit: Jumlah data per halaman (1-100, default 10)
    - offset: Offset untuk pagination (default 0)
    
    Response format:
    {
      "data": [...],
      "total": 50,
      "page": 1,
      "limit": 10
    }
    
    ✅ Data isolation: Hanya menampilkan data konsultasi untuk counselor_id = current_user.id
    ✅ Sorted by created_at DESC (konsultasi terbaru di atas)
    
    TODO[FE]: Gunakan limit & offset untuk implementasi pagination UI di frontend
    TODO[FE]: Tombol Next/Prev: next_offset = offset + limit; prev_offset = max(0, offset - limit)
    """
    result = crud.get_consultations_paginated(
        db=db,
        counselor_id=current_user.id,
        limit=limit,
        offset=offset,
    )
    return result
