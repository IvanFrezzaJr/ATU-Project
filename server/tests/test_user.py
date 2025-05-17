from http import HTTPStatus

from app.schemas import UserPublic


def test_create_user(client):
    response = client.post(
        '/users/',
        json={
            'name': 'alice',
            'email': 'alice@example.com',
            'password': 'secret123',
        },
    )
    assert response.status_code == HTTPStatus.CREATED
    assert response.json() == {
        'city': None,
        'country': None,
        'name': 'alice',
        'email': 'alice@example.com',
        'id': 1,
        'image': None,
        'postalcode': None,
        'state': None,
        'street': None,
    }


def test_create_user_400(client):
    response = client.post(
        '/users/',
        json={
            'name': 'alice',
            'email': 'alice@example.com',
            'password': 'secret123',
        },
    )
    assert response.status_code == HTTPStatus.CREATED

    response = client.post(
        '/users/',
        json={
            'name': 'alice',
            'email': 'valmir@example.com',
            'password': 'secret123',
        },
    )

    assert response.status_code == HTTPStatus.BAD_REQUEST
    assert response.json() == {'detail': 'Username already exists'}

    response = client.post(
        '/users/',
        json={
            'name': 'valmir',
            'email': 'alice@example.com',
            'password': 'secret123',
        },
    )

    assert response.status_code == HTTPStatus.BAD_REQUEST
    assert response.json() == {'detail': 'Email already exists'}


def test_read_users_empty(client):
    response = client.get('/users/')
    assert response.status_code == HTTPStatus.OK
    # ensure the database is empty before starting the tests
    assert response.json() == {'users': []}


def test_read_users(client, user):
    user_schema = UserPublic.model_validate(user).model_dump()
    response = client.get('/users/')
    assert response.json() == {'users': [user_schema]}


def test_read_user(client, user):
    user_schema = UserPublic.model_validate(user).model_dump()
    response = client.get(f'/users/{user.id}')
    assert response.json() == user_schema


def test_read_user_404(client, user):
    response = client.get('/users/999')
    assert response.status_code == HTTPStatus.NOT_FOUND


def test_update_user(client, user, token):
    response = client.put(
        f'/users/{user.id}',
        headers={'Authorization': f'Bearer {token}'},
        json={
            'name': 'bob',
            'email': 'bob@example.com',
            'password': 'mynewpassword',
        },
    )

    assert response.status_code == HTTPStatus.OK
    assert response.json() == {
        'name': 'bob',
        'email': 'bob@example.com',
        'id': user.id,
        'image': None,
        'postalcode': None,
        'state': None,
        'street': None,
        'city': None,
        'country': None,
    }


def test_update_user_integrity_error(client, user, token):
    # Insert Fausto
    client.post(
        '/users',
        json={
            'name': 'fausto',
            'email': 'fausto@example.com',
            'password': 'secret123',
        },
    )

    # update fixutre to Fausto
    response_update = client.put(
        f'/users/{user.id}',
        headers={'Authorization': f'Bearer {token}'},
        json={
            'name': 'bob',
            'email': 'fausto@example.com',
            'password': 'mynewpassword',
        },
    )

    assert response_update.status_code == HTTPStatus.CONFLICT
    assert response_update.json() == {
        'detail': 'Username or Email already exists'
    }


def test_update_user_403(client, other_user, token):
    response = client.put(
        f'/users/{other_user.id}',
        headers={'Authorization': f'Bearer {token}'},
        json={
            'name': 'bob',
            'email': 'bob@example.com',
            'password': 'mynewpassword',
        },
    )
    assert response.status_code == HTTPStatus.FORBIDDEN


def test_delete_user(client, user, token):
    response = client.delete(
        f'/users/{user.id}',
        headers={'Authorization': f'Bearer {token}'},
    )
    assert response.status_code == HTTPStatus.OK
    assert response.json() == {'message': 'User deleted'}


def test_delete_user_403(client, other_user, token):
    response = client.delete(
        f'/users/{other_user.id}', headers={'Authorization': f'Bearer {token}'}
    )

    assert response.status_code == HTTPStatus.FORBIDDEN
