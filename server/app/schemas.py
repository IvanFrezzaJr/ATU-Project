from typing import Optional
from pydantic import BaseModel, ConfigDict, EmailStr

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


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: str | None = None