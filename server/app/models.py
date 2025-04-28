import enum
from datetime import datetime
from typing import List

from sqlalchemy import TIMESTAMP, ForeignKey, Integer, String, func
from sqlalchemy.dialects.postgresql import ARRAY, ENUM
from sqlalchemy.orm import Mapped, mapped_column, registry

table_registry = registry()


# Enums do Python
class ItemStatusEnum(enum.Enum):
    offer_agreed = 'offer_agreed'
    in_offer = 'in_offer'
    not_listed = 'not_listed'


class TradeStatusEnum(enum.Enum):
    opened = 'opened'
    closed = 'closed'
    pending = 'pending'
    accepted = 'accepted'
    completed = 'completed'
    canceled = 'canceled'


class TradeTypeEnum(enum.Enum):
    post = 'post'
    delivery = 'delivery'
    pickup = 'pickup'


@table_registry.mapped_as_dataclass
class User:
    __tablename__ = 'user'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, init=False)
    name: Mapped[str] = mapped_column(String)
    image: Mapped[str] = mapped_column(String)
    email: Mapped[str] = mapped_column(String, unique=True)
    password: Mapped[str] = mapped_column(String)
    street: Mapped[str | None] = mapped_column(String, default=None)
    city: Mapped[str | None] = mapped_column(String, default=None)
    state: Mapped[str | None] = mapped_column(String, default=None)
    postalcode: Mapped[str | None] = mapped_column(String, default=None)
    country: Mapped[str | None] = mapped_column(String, default=None)

    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=False), init=False, server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=False), init=False, server_default=func.now()
    )


@table_registry.mapped_as_dataclass
class UserItem:
    __tablename__ = 'user_item'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, init=False)
    name: Mapped[str] = mapped_column(String)
    description: Mapped[str] = mapped_column(String)
    user_id: Mapped[int] = mapped_column(ForeignKey('user.id'), nullable=False)
    images_path: Mapped[List[str]] = mapped_column(ARRAY(String))
    quantity: Mapped[int] = mapped_column(Integer, default=1)

    # Definindo valores default para os Enums
    status: Mapped[ItemStatusEnum] = mapped_column(
        ENUM(ItemStatusEnum, name='item_status', create_type=True),
        nullable=False,
        default=ItemStatusEnum.in_offer,  # Default para "in_offer"
    )
    trade_type: Mapped[TradeTypeEnum] = mapped_column(
        ENUM(TradeTypeEnum, name='trade_type', create_type=True),
        nullable=False,
        default=TradeTypeEnum.post,  # Default para "post"
    )

    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=False), init=False, server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=False), init=False, server_default=func.now()
    )


@table_registry.mapped_as_dataclass
class Trade:
    __tablename__ = 'trade'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, init=False)
    user_item_id_from: Mapped[int] = mapped_column(
        ForeignKey('user_item.id'), unique=True
    )
    user_item_id_to: Mapped[int] = mapped_column(
        ForeignKey('user_item.id'), unique=True
    )
    trade_date: Mapped[datetime] = mapped_column(TIMESTAMP(timezone=False))

    # Definindo valor default para TradeStatusEnum
    trade_status: Mapped[TradeStatusEnum] = mapped_column(
        ENUM(TradeStatusEnum, name='trade_status', create_type=True),
        nullable=False,
        default=TradeStatusEnum.opened,  # Default para "opened"
    )

    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=False), init=False, server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=False), init=False, server_default=func.now()
    )
