import pytest
from sqlalchemy import select

from app.models import User


@pytest.mark.asyncio
async def _test_create_user(session):
    new_user = User(username='alice', password='secret', email='teste@test')
    session.add(new_user)
    await session.commit()

    result = await session.execute(
        select(User).where(User.username == 'alice')
    )
    user = result.scalar_one()

    assert user.username == 'alice'
