from http import HTTPStatus


def test_read_root_must_return_ok_and_hello_world(client):
    response = client.get('/')  # act

    assert response.status_code == HTTPStatus.OK  # assert
    assert response.json() == {'message': 'hello world'}  # assert
