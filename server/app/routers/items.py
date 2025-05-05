from http import HTTPStatus
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_session
from app.models import UserItem, User
from app.schemas import (
    ItemCreateSchema,
    ItemUpdateSchema,
    ItemList,
    ItemPublic,
    Message,
)
from app.security import get_current_user

router = APIRouter(prefix='/items', tags=['items'])

T_Session = Annotated[Session, Depends(get_session)]
T_CurrentUser = Annotated[User, Depends(get_current_user)]


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
def read_items(session: T_Session, limit: int = 10, offset: int = 0):
    items = session.scalars(
        select(UserItem).limit(limit).offset(offset)
    ).all()
    return {'items': items}


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

    for field, value in item_data.dict(exclude_unset=True).items():
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
