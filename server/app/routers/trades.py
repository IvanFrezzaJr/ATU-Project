from datetime import datetime
from http import HTTPStatus
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import and_, func, or_, select
from sqlalchemy.orm import Session, selectinload, aliased

from app.database import get_session
from app.models import Trade, UserItem, TradeStatusEnum, ItemStatusEnum
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
def read_trades(
    session: T_Session, 
    limit: int = 10, 
    offset: int = 0,
    user_id: int = Query(False),
    only_offer: bool = Query(False)):

    UserItemFrom = aliased(UserItem)
    UserItemTo = aliased(UserItem)

    base_query = (
        select(Trade)
        .join(UserItemFrom, Trade.user_item_from)
        .join(UserItemTo, Trade.user_item_to)
        .options(
            selectinload(Trade.user_item_from),
            selectinload(Trade.user_item_to),
        )
    )

    conditions = []

    if only_offer:
        conditions.append(UserItemTo.user_id == user_id)
    else:
        conditions.append(UserItemFrom.user_id == user_id)

    if conditions:
        base_query = base_query.where(*conditions)

    # pagination
    query = base_query.limit(limit).offset(offset)

    # aggregation
    count_query = select(func.count()).select_from(UserItem)
    if conditions:
        count_query = count_query.where(*conditions)

    total_items = session.scalar(count_query)


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


@router.get('/offers/from', response_model=TradeList)
def read_trade_offers(
    session: T_Session, 
    limit: int = 10, 
    offset: int = 0,
    user_id: int = Query(False),
    ongoing: bool = Query(False)):


    UserItemFrom = aliased(UserItem)
    UserItemTo = aliased(UserItem)

    base_query = (
        select(Trade)
        .join(UserItemFrom, Trade.user_item_from)
        .join(UserItemTo, Trade.user_item_to)
        .options(
            selectinload(Trade.user_item_from),
            selectinload(Trade.user_item_to),
        )
    )

    conditions = []

    if ongoing:
        conditions.append(or_(
            Trade.trade_status == TradeStatusEnum.opened,
            Trade.trade_status == TradeStatusEnum.pending
        ))

    if user_id:
        conditions.append(UserItemFrom.user_id == user_id)
   

    if conditions:
        base_query = base_query.where(*conditions)

    # pagination
    query = base_query.limit(limit).offset(offset)

    # aggregation
    count_query = select(func.count()).select_from(UserItem)
    if conditions:
        count_query = count_query.where(*conditions)

    total_items = session.scalar(count_query)


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


@router.get('/offers/to', response_model=TradeList)
def read_trade_items(
    session: T_Session, 
    limit: int = 10, 
    offset: int = 0,
    user_id: int = Query(False),
    ongoing: bool = Query(False)):


    UserItemFrom = aliased(UserItem)
    UserItemTo = aliased(UserItem)

    base_query = (
        select(Trade)
        .join(UserItemFrom, Trade.user_item_from)
        .join(UserItemTo, Trade.user_item_to)
        .options(
            selectinload(Trade.user_item_from),
            selectinload(Trade.user_item_to),
        )
    )

    conditions = []
    if ongoing:
        conditions.append(or_(
            Trade.trade_status == TradeStatusEnum.opened,
            Trade.trade_status == TradeStatusEnum.pending
        ))


    if user_id:
        conditions.append(UserItemTo.user_id == user_id)
   

    if conditions:
        base_query = base_query.where(*conditions)

    # pagination
    query = base_query.limit(limit).offset(offset)

    # aggregation
    count_query = select(func.count()).select_from(UserItem)
    if conditions:
        count_query = count_query.where(*conditions)

    total_items = session.scalar(count_query)


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


@router.get('/history', response_model=TradeList)
def read_trade_items(
    session: T_Session, 
    limit: int = 10, 
    offset: int = 0,
    user_id: int = Query(False),
    ongoing: bool = Query(False)):


    UserItemFrom = aliased(UserItem)
    UserItemTo = aliased(UserItem)

    base_query = (
        select(Trade)
        .join(UserItemFrom, Trade.user_item_from)
        .join(UserItemTo, Trade.user_item_to)
        .options(
            selectinload(Trade.user_item_from),
            selectinload(Trade.user_item_to),
        )
    )

    conditions = []
    if not ongoing:
        conditions.append(and_(
            Trade.trade_status != TradeStatusEnum.opened,
            Trade.trade_status != TradeStatusEnum.pending
        ))


    if user_id:
        conditions.append(UserItemTo.user_id == user_id)
   

    if conditions:
        base_query = base_query.where(*conditions)

    # pagination
    query = base_query.limit(limit).offset(offset)

    # aggregation
    count_query = select(func.count()).select_from(UserItem)
    if conditions:
        count_query = count_query.where(*conditions)

    total_items = session.scalar(count_query)


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
    
    for field, value in update_data.model_dump(exclude_unset=True).items():
        setattr(trade, field, value)

    if (update_data.trade_status == TradeStatusEnum.accepted 
        or update_data.trade_status == TradeStatusEnum.completed):

        # start trade operation        
        user_item_from = session.get(UserItem, trade.user_item_id_from)
        user_item_to = session.get(UserItem, trade.user_item_id_to)

        # change item users
        from_user_id = user_item_from.user_id
        to_user_id = user_item_to.user_id

        user_item_from.user_id = to_user_id
        user_item_to.user_id = from_user_id

        # update item status
        user_item_from.status = ItemStatusEnum.offer_agreed
        user_item_to.status = ItemStatusEnum.offer_agreed

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

