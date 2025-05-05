from typing import Optional, List
from pydantic import BaseModel, ConfigDict, EmailStr

from app.models import ItemStatusEnum, TradeTypeEnum


class Message(BaseModel):
    message: str



class AddressSchema(BaseModel):
    street: str
    city: str
    state: str
    postalcode: str
    country: str



class UserSchema(BaseModel):
    name: str
    email: EmailStr
    password: str
    anddress: Optional[AddressSchema] = None



class UserPublic(BaseModel):
    id: int
    name: str
    email: str
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
    user_id: int

    class Config:
        orm_mode = True


class ItemList(BaseModel):
    items: List[ItemPublic]


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: str | None = None