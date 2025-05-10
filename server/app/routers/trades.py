from datetime import datetime
from http import HTTPStatus
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.database import get_session
from app.models import Trade, UserItem, TradeStatusEnum
from app.schemas import (
    TradeCreateSchema,
    TradeUpdateSchema,
    TradePublic,
    TradeList,
    Message,
)
from app.security import get_current_user

router = APIRouter(prefix='/trades', tags=['trades'])

T_Session = Annotated[Session, Depends(get_session)]


@router.post('/', response_model=TradePublic, status_code=HTTPStatus.CREATED)
def create_trade(
    trade: TradeCreateSchema,
    session: T_Session,
):
    item_from = session.get(UserItem, trade.user_item_id_from)
    item_to = session.get(UserItem, trade.user_item_id_to)

    if not item_from or not item_to:
        raise HTTPException(
            status_code=HTTPStatus.BAD_REQUEST,
            detail='One or both user items not found',
        )

    db_trade = Trade(
        user_item_id_from=trade.user_item_id_from,
        user_item_id_to=trade.user_item_id_to,
        trade_date=datetime.now(),
        trade_status=trade.trade_status,
    )

    session.add(db_trade)
    session.commit()
    session.refresh(db_trade)

    return db_trade


@router.get('/', response_model=TradeList)
def read_trades(session: T_Session, limit: int = 10, offset: int = 0):
    trades = (
        session.scalars(select(Trade)
                        .options(selectinload(Trade.user_item_from))
                        .options(selectinload(Trade.user_item_to))
                        .limit(limit)
                        .offset(offset)).all()
    )
    return {'trades': trades}


@router.get('/{trade_id}', response_model=TradePublic)
def read_trade(trade_id: int, session: T_Session):
    trade = session.get(Trade, trade_id)

    if not trade:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail='Trade not found',
        )

    return trade


@router.put('/{trade_id}', response_model=TradePublic)
def update_trade(
    trade_id: int,
    update_data: TradeUpdateSchema,
    session: T_Session,
):
    trade = session.get(Trade, trade_id)

    if not trade:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail='Trade not found',
        )

    for field, value in update_data.dict(exclude_unset=True).items():
        setattr(trade, field, value)

    session.commit()
    session.refresh(trade)
    return trade


@router.delete('/{trade_id}', response_model=Message)
def delete_trade(trade_id: int, session: T_Session):
    trade = session.get(Trade, trade_id)

    if not trade:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail='Trade not found',
        )

    session.delete(trade)
    session.commit()

    return {'message': 'Trade deleted'}
