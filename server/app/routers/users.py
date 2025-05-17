from http import HTTPStatus
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.database import get_session
from app.models import User
from app.schemas import (
    Message,
    UserList,
    UserPublic,
    UserSchema,
    UserUpdateSchema,
)
from app.security import (
    get_current_user,
    get_password_hash,
)

router = APIRouter(prefix='/users', tags=['users'])

T_Session = Annotated[Session, Depends(get_session)]
T_CurrentUser = Annotated[User, Depends(get_current_user)]


@router.post('/', status_code=HTTPStatus.CREATED, response_model=UserPublic)
def create_user(
    user: UserSchema,
    session: T_Session,
):
    # search for unique user
    db_user = session.scalar(
        select(User).where(
            (User.name == user.name) | (User.email == user.email)
        )
    )

    # valdiation name and email
    if db_user:
        if db_user.email == user.email:
            raise HTTPException(
                status_code=HTTPStatus.BAD_REQUEST,
                detail='Email already exists',
            )

        if db_user.name == user.name:
            raise HTTPException(
                status_code=HTTPStatus.BAD_REQUEST,
                detail='Username already exists',
            )

    # build model
    db_user = User(
        name=user.name,
        email=user.email,
        password=get_password_hash(user.password),
    )  # type: ignore

    # insert into the database
    session.add(db_user)
    session.commit()
    session.refresh(db_user)

    return db_user


@router.get('/', response_model=UserList)
def read_users(session: T_Session, limit: int = 10, offset: int = 0):
    user = session.scalars(select(User).limit(limit).offset(offset))

    return {'users': user}


@router.get('/{user_id}', response_model=UserPublic)
def read_user(user_id: int, session: T_Session):
    db_user = session.scalar(select(User).where(User.id == user_id))

    if not db_user:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND, detail='User not found'
        )

    return db_user


@router.put('/{user_id}', response_model=UserPublic)
def update_user(
    user_id: int,
    user: UserUpdateSchema,
    session: T_Session,
    current_user: T_CurrentUser,
):
    if current_user.id != user_id:
        raise HTTPException(
            status_code=HTTPStatus.FORBIDDEN,
            detail='Not found permission',
        )

    try:
        updates = user.model_dump(exclude_unset=True)

        for field, value in updates.items():
            if field == 'password':
                setattr(current_user, field, get_password_hash(value))
            else:
                setattr(current_user, field, value)

        session.commit()
        session.refresh(current_user)

        return current_user

    except IntegrityError:
        raise HTTPException(
            status_code=HTTPStatus.CONFLICT,
            detail='Username or Email already exists',
        )


@router.delete('/{user_id}', response_model=Message)
def delete_user(
    user_id: int,
    session: T_Session,
    current_user: T_CurrentUser,
):
    if current_user.id != user_id:
        raise HTTPException(
            status_code=HTTPStatus.FORBIDDEN,
            detail='Not found permission',
        )

    session.delete(current_user)
    session.commit()

    return {'message': 'User deleted'}
