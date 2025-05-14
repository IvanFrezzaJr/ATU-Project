from __future__ import annotations

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.models import ItemStatusEnum, TradeStatusEnum, TradeTypeEnum


class Message(BaseModel):
    message: str


class UserSchema(BaseModel):
    name: str = Field(
        ..., min_length=3, description='Name must be longer than 3 characters'
    )

    email: EmailStr
    password: str = Field(
        ...,
        min_length=8,
        description='Password must be at least 8 characters long',
    )
    anddress: Optional[AddressSchema] = None


class AddressSchema(BaseModel):
    street: str
    city: str
    state: str
    postalcode: str
    country: str


class UserUpdateSchema(BaseModel):
    name: Optional[str] = None
    password: Optional[str] = None
    email: Optional[str] = None
    image: Optional[str] = None
    street: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    postalcode: Optional[str] = None
    country: Optional[str] = None


class UserPublic(BaseModel):
    id: int
    name: str
    email: str

    image: Optional[str] = None
    street: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    postalcode: Optional[str] = None
    country: Optional[str] = None

    # ensure UserPublic.model_validate(...).model_dump()
    # valdiates only by schema attributes:
    # id, username and email
    model_config = ConfigDict(from_attributes=True)


class UserList(BaseModel):
    users: list[UserPublic]


class ItemBase(BaseModel):
    name: str
    description: str
    images_path: List[str]
    quantity: int = 1
    status: ItemStatusEnum = ItemStatusEnum.in_offer
    trade_type: TradeTypeEnum = TradeTypeEnum.post


class ItemCreateSchema(ItemBase):
    pass


class ItemUpdateSchema(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    images_path: Optional[List[str]] = None
    quantity: Optional[int] = None
    status: Optional[ItemStatusEnum] = None
    trade_type: Optional[TradeTypeEnum] = None


class ItemPublic(ItemBase):
    id: int
    user: UserPublic
    name: str
    description: str
    quantity: int
    status: ItemStatusEnum
    images_path: List[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


class ItemList(BaseModel):
    data: List[ItemPublic]
    totalItems: int
    itemsPerPage: int
    currentPage: int
    totalPages: int


class TradeBase(BaseModel):
    user_item_from: ItemPublic
    user_item_to: ItemPublic
    trade_date: datetime
    trade_status: TradeStatusEnum = TradeStatusEnum.opened


class TradeCreateSchema(BaseModel):
    user_item_id_from: int
    user_item_id_to: int
    trade_status: TradeStatusEnum = TradeStatusEnum.opened


class TradeUpdateSchema(BaseModel):
    trade_status: Optional[TradeStatusEnum] = None


class TradePublic(TradeBase):
    id: int

    class Config:
        orm_mode = True


class TradeList(BaseModel):
    data: List[TradePublic]
    totalItems: int
    itemsPerPage: int
    currentPage: int
    totalPages: int


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: str | None = None
