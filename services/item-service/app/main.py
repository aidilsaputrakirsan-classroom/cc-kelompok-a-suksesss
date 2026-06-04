import os

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app import crud
from app.auth_client import verify_token_with_auth_service
from app.database import Base, engine, get_db
from app.schemas import ItemCreate, ItemListResponse, ItemResponse, ItemStatsResponse, ItemUpdate

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Item Service",
    description="Microservice inventory untuk Modul 12/13",
    version="1.0.0",
)

cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:5173")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in cors_origins.split(",") if origin.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check() -> dict:
    return {"status": "healthy", "service": "item-service"}


@app.post("/items", response_model=ItemResponse, status_code=201)
def create_item(
    payload: ItemCreate,
    user: dict = Depends(verify_token_with_auth_service),
    db: Session = Depends(get_db),
):
    item = crud.create_item(db=db, payload=payload, owner_id=int(user["user_id"]))
    return item


@app.get("/items", response_model=ItemListResponse)
def list_items(
    user: dict = Depends(verify_token_with_auth_service),
    db: Session = Depends(get_db),
):
    items = crud.list_items(db=db, owner_id=int(user["user_id"]))
    return {"total": len(items), "items": items}


@app.get("/items/stats", response_model=ItemStatsResponse)
def item_stats(
    user: dict = Depends(verify_token_with_auth_service),
    db: Session = Depends(get_db),
):
    return crud.get_items_stats(db=db, owner_id=int(user["user_id"]))


@app.get("/items/{item_id}", response_model=ItemResponse)
def get_item(
    item_id: int,
    user: dict = Depends(verify_token_with_auth_service),
    db: Session = Depends(get_db),
):
    item = crud.get_item(db=db, item_id=item_id, owner_id=int(user["user_id"]))
    if item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    return item


@app.put("/items/{item_id}", response_model=ItemResponse)
def update_item(
    item_id: int,
    payload: ItemUpdate,
    user: dict = Depends(verify_token_with_auth_service),
    db: Session = Depends(get_db),
):
    item = crud.get_item(db=db, item_id=item_id, owner_id=int(user["user_id"]))
    if item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    return crud.update_item(db=db, item=item, payload=payload)


@app.delete("/items/{item_id}", status_code=204)
def delete_item(
    item_id: int,
    user: dict = Depends(verify_token_with_auth_service),
    db: Session = Depends(get_db),
):
    item = crud.get_item(db=db, item_id=item_id, owner_id=int(user["user_id"]))
    if item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    crud.delete_item(db=db, item=item)
    return None
