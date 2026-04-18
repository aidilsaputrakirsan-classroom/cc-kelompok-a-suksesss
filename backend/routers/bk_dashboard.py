"""
Router untuk Dashboard Guru BK (Konselor)
Endpoints: GET /api/bk/dashboard/stats, GET /api/bk/consultations (dengan pagination)
Requirement UTS: Auth JWT, Protected Endpoints, Data Isolation, Swagger UI
"""

from fastapi import APIRouter, Query, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

import crud
from auth import get_current_counselor
from database import get_db
from models import User
from schemas import ConsultationDetailResponse, DashboardStatsResponse, PaginatedConsultationListResponse, ConsultationListItemResponse


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


@router.get(
    "/consultations/{consultation_id}",
    response_model=ConsultationDetailResponse,
    summary="Detail Konsultasi",
    description="Menampilkan detail konsultasi milik counselor yang sedang login, termasuk nomor WhatsApp siswa.",
    status_code=200,
)
def get_consultation_detail(
    consultation_id: int,
    current_user: User = Depends(get_current_counselor),
    db: Session = Depends(get_db),
):
    # TODO[FE]: Gunakan endpoint detail ini saat halaman detail konsultasi dibuka.
    consultation = crud.get_consultation_detail_for_counselor(
        db=db,
        consultation_id=consultation_id,
        counselor_id=current_user.id,
    )
    if consultation is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Data konsultasi tidak ditemukan")
    return consultation


@router.delete(
    "/consultations/{consultation_id}",
    status_code=204,
    summary="Hapus Konsultasi",
    description="Menghapus consultation milik guru BK yang sedang login. Wajib JWT counselor dan data isolation.",
)
def delete_consultation(
    consultation_id: int,
    current_user: User = Depends(get_current_counselor),
    db: Session = Depends(get_db),
):
    # TODO[FE]: Tambahkan tombol Delete di daftar konsultasi dengan konfirmasi sebelum hapus.
    delete_result = crud.delete_consultation_for_counselor(
        db=db,
        consultation_id=consultation_id,
        counselor_id=current_user.id,
    )

    if delete_result == "not_found":
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Data konsultasi tidak ditemukan")

    if delete_result == "forbidden":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Akses ditolak untuk data ini")

    return Response(status_code=status.HTTP_204_NO_CONTENT)
