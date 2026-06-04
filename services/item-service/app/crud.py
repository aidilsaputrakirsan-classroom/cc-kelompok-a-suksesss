from sqlalchemy.orm import Session

from app.models import Item
from app.schemas import ItemCreate, ItemUpdate


def create_item(db: Session, payload: ItemCreate, owner_id: int) -> Item:
    item = Item(
        name=payload.name,
        description=payload.description,
        price=payload.price,
        quantity=payload.quantity,
        owner_id=owner_id,
        is_public=payload.is_public,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


def list_items(db: Session, owner_id: int | None = None) -> list[Item]:
    query = db.query(Item)
    if owner_id is not None:
        query = query.filter(Item.owner_id == owner_id)
    return query.order_by(Item.created_at.desc()).all()


def list_public_items(db: Session) -> list[Item]:
    return (
        db.query(Item)
        .filter(Item.is_public.is_(True))
        .order_by(Item.created_at.desc())
        .all()
    )


def get_item(db: Session, item_id: int, owner_id: int | None = None) -> Item | None:
    query = db.query(Item).filter(Item.id == item_id)
    if owner_id is not None:
        query = query.filter(Item.owner_id == owner_id)
    return query.first()


def update_item(db: Session, item: Item, payload: ItemUpdate) -> Item:
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(item, field, value)
    db.commit()
    db.refresh(item)
    return item


def delete_item(db: Session, item: Item) -> None:
    db.delete(item)
    db.commit()


def get_items_stats(db: Session, owner_id: int | None = None) -> dict:
    query = db.query(Item)
    if owner_id is not None:
        query = query.filter(Item.owner_id == owner_id)

    items = query.all()
    total_items = len(items)
    total_value = sum(item.price * item.quantity for item in items)
    termasuk = sum(1 for item in items if item.quantity > 0)
    terminum = sum(1 for item in items if item.quantity == 0)

    most_expensive = max(items, key=lambda item: item.price) if items else None
    cheapest = min(items, key=lambda item: item.price) if items else None

    return {
        "total_items": total_items,
        "total_value": total_value,
        "termasuk": termasuk,
        "terminum": terminum,
        "most_expensive": None if most_expensive is None else {"id": most_expensive.id, "name": most_expensive.name, "price": most_expensive.price},
        "cheapest": None if cheapest is None else {"id": cheapest.id, "name": cheapest.name, "price": cheapest.price},
    }
