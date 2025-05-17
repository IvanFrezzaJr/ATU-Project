import os

import factory
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from testcontainers.postgres import PostgresContainer

from app.database import get_session
from app.main import api
from app.models import User, table_registry
from app.security import get_password_hash


class UserFactory(factory.Factory):
    class Meta:
        model = User

    name = factory.Sequence(lambda n: f'test{n}')
    email = factory.LazyAttribute(lambda obj: f'{obj.name}@test.com')
    password = factory.LazyAttribute(lambda obj: f'{obj.name}@example.com')


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
def token(client, user):
    response = client.post(
        'auth/token',
        data={'username': user.email, 'password': user.clean_password},
    )
    return response.json()['access_token']
