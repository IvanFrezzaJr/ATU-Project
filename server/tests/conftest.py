import os
import random
from datetime import datetime

import factory
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from testcontainers.postgres import PostgresContainer

from app.database import get_session
from app.main import api
from app.models import (
    ItemStatusEnum,
    Trade,
    TradeTypeEnum,
    User,
    UserItem,
    table_registry,
)
from app.security import get_password_hash


class UserFactory(factory.Factory):
    class Meta:
        model = User

    name = factory.Sequence(lambda n: f'test{n}')
    email = factory.LazyAttribute(lambda obj: f'{obj.name}@test.com')
    password = factory.LazyAttribute(lambda obj: f'{obj.name}@example.com')


class UserItemFactory(factory.Factory):
    class Meta:
        model = UserItem

    name = factory.Sequence(lambda n: f'Item{n}')
    description = factory.Faker('sentence')
    user_id = None
    images_path = factory.LazyFunction(
        lambda: [f'/images/{random.randint(1, 100)}.jpg']
    )
    quantity = 1
    status = ItemStatusEnum.in_offer
    trade_type = TradeTypeEnum.post


@pytest.fixture
def client(session):
    def get_session_override():
        return session

    with TestClient(api) as client:
        api.dependency_overrides[get_session] = get_session_override

        yield client

    api.dependency_overrides.clear()


@pytest.fixture(scope='session')
def engine():
    use_testcontainers = (
        os.getenv('USE_TESTCONTAINERS', 'true').lower() == 'true'
    )

    if use_testcontainers:
        with PostgresContainer('postgres:16', driver='psycopg2') as postgres:
            _engine = create_engine(postgres.get_connection_url())
            with _engine.begin():
                yield _engine
    else:
        # CI/CD
        db_url = os.getenv(
            'DATABASE_URL',
            'postgresql+psycopg2://testuser:testpass@localhost:5432/testdb',
        )
        _engine = create_engine(db_url)
        with _engine.begin():
            yield _engine


@pytest.fixture
def session(engine):
    table_registry.metadata.create_all(engine)

    with Session(engine) as session:
        yield session
        session.rollback()

    table_registry.metadata.drop_all(engine)


@pytest.fixture
def user(session):
    pwd = 'testtest'
    user = UserFactory(
        password=get_password_hash(pwd),
    )
    session.add(user)
    session.commit()
    session.refresh(user)

    user.clean_password = pwd  # Monkey patch

    return user


@pytest.fixture
def other_user(session):
    user = UserFactory()
    session.add(user)
    session.commit()
    session.refresh(user)
    return user


@pytest.fixture
def item(session, user):
    item = UserItemFactory(user_id=user.id)
    session.add(item)
    session.commit()
    session.refresh(item)
    return item


@pytest.fixture
def other_item(session, other_user):
    item = UserItemFactory(user_id=other_user.id)
    session.add(item)
    session.commit()
    session.refresh(item)
    return item


@pytest.fixture
def item_with_trade(session):
    user_from = UserFactory(password=get_password_hash('senha123'))
    user_to = UserFactory(password=get_password_hash('senha456'))

    session.add_all([user_from, user_to])
    session.flush()

    item_from = UserItemFactory(user_id=user_from.id)
    item_to = UserItemFactory(user_id=user_to.id)

    session.add_all([item_from, item_to])
    session.flush()

    # trade
    trade = Trade(
        user_item_id_from=item_from.id,
        user_item_id_to=item_to.id,
        trade_date=datetime.utcnow(),
    )
    session.add(trade)
    session.commit()
    session.refresh(trade)

    return trade


@pytest.fixture
def token(client, user):
    response = client.post(
        'auth/token',
        data={'username': user.email, 'password': user.clean_password},
    )
    return response.json()['access_token']


@pytest.fixture
def cleanup_uploaded_files():
    uploads_dir = os.path.join(os.getcwd(), 'uploads')
    os.makedirs(uploads_dir, exist_ok=True)

    existing_files = set(os.listdir(uploads_dir))

    yield

    all_files = set(os.listdir(uploads_dir))
    new_files = all_files - existing_files

    for file in new_files:
        file_path = os.path.join(uploads_dir, file)
        if os.path.isfile(file_path):
            os.remove(file_path)
