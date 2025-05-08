from http import HTTPStatus
from typing import Annotated, Optional
from uuid import uuid4

from fastapi import UploadFile, File
from pathlib import Path
import shutil

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select, func
from sqlalchemy.orm import Session, selectinload

from app.database import get_session
from app.models import UserItem, User
from app.schemas import (
    ItemCreateSchema,
    ItemUpdateSchema,
    ItemList,
    ItemPublic,
    Message,
)
from app.security import get_current_user, get_optional_user

router = APIRouter(prefix='/items', tags=['items'])

T_Session = Annotated[Session, Depends(get_session)]
T_CurrentUser = Annotated[User, Depends(get_current_user)]
T_OptionalUser = Annotated[Optional[User], Depends(get_optional_user)]


@router.post('/', response_model=ItemPublic, status_code=HTTPStatus.CREATED)
def create_item(
    item: ItemCreateSchema,
    session: T_Session,
    current_user: T_CurrentUser,
):
    db_item = UserItem(
        name=item.name,
        description=item.description,
        images_path=item.images_path,
        quantity=item.quantity,
        status=item.status,
        trade_type=item.trade_type,
        user_id=current_user.id,
    )

    session.add(db_item)
    session.commit()
    session.refresh(db_item)

    return db_item


@router.get('/', response_model=ItemList)
def read_items(
    session: T_Session,
    current_user: T_OptionalUser = None,
    limit: int = Query(10, gt=0),
    offset: int = Query(0, ge=0),
    only_offer_items: Optional[bool] = Query(False),
    only_user_items: Optional[bool] = Query(False),
):
    total_items = 0
    query = None


    if current_user and only_user_items:
        total_items = session.scalar(
            select(func.count())
            .where(UserItem.user_id == current_user.id)
            .select_from(UserItem))
                
        query = (
            select(UserItem)
            .where(UserItem.user_id == current_user.id)
            .options(selectinload(UserItem.user))
            .limit(limit)
            .offset(offset)
        )

    
    elif current_user and only_offer_items:
        total_items = session.scalar(
            select(func.count())
            .where(UserItem.user_id != current_user.id)
            .select_from(UserItem))
                
        query = (
            select(UserItem)
            .where(UserItem.user_id != current_user.id)
            .options(selectinload(UserItem.user))
            .limit(limit)
            .offset(offset)
        )
        
    else:
        total_items = session.scalar(
            select(func.count())
            .select_from(UserItem))

        query = (
            select(UserItem)
            .options(selectinload(UserItem.user))
            .limit(limit)
            .offset(offset)
        )

    if query  is None:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail='Items not found',
        )

    
    items = session.scalars(query).all()

    return {
        'data': items,
        'totalItems': total_items,
        'itemsPerPage': limit,
        'currentPage': (offset // limit) + 1,
        'totalPages': (total_items + limit - 1) // limit,
    }



@router.get('/{item_id}', response_model=ItemPublic)
def read_item(item_id: int, session: T_Session):
    item = session.get(UserItem, item_id)

    if not item:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail='Item not found',
        )

    return item


@router.put('/{item_id}', response_model=ItemPublic)
def update_item(
    item_id: int,
    item_data: ItemUpdateSchema,
    session: T_Session,
    current_user: T_CurrentUser,
):
    item = session.get(UserItem, item_id)

    if not item:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail='Item not found',
        )

    if item.user_id != current_user.id:
        raise HTTPException(
            status_code=HTTPStatus.FORBIDDEN,
            detail='Permission denied',
        )

    for field, value in item_data.model_dump(exclude_unset=True).items():
        setattr(item, field, value)

    session.commit()
    session.refresh(item)

    return item


@router.delete('/{item_id}', response_model=Message)
def delete_item(
    item_id: int,
    session: T_Session,
    current_user: T_CurrentUser,
):
    item = session.get(UserItem, item_id)

    if not item:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail='Item not found',
        )

    if item.user_id != current_user.id:
        raise HTTPException(
            status_code=HTTPStatus.FORBIDDEN,
            detail='Permission denied',
        )

    session.delete(item)
    session.commit()

    return {'message': 'Item deleted'}



UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

@router.post("/upload-image")
def upload_image(file: UploadFile = File(...)):
    file_ext = Path(file.filename).suffix
    filename = f"{uuid4()}{file_ext}"
    filepath = UPLOAD_DIR / filename

    with filepath.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Retorna apenas o path relativo
    return {"path": f"/uploads/{filename}"}