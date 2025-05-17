from http import HTTPStatus


def test_create_item(client, token):
    response = client.post(
        '/items/',
        headers={'Authorization': f'Bearer {token}'},
        json={
            'name': 'Product mock',
            'description': 'Product description',
            'images_path': ['/uploads/prod.jpg'],
            'quantity': 1,
            'status': 'in_offer',
            'trade_type': 'post',
        },
    )
    assert response.status_code == HTTPStatus.CREATED
    data = response.json()
    assert data['name'] == 'Product mock'
    assert data['status'] == 'in_offer'
    assert data['trade_type'] == 'post'


def test_read_items(client, token):
    response = client.post(
        '/items/',
        headers={'Authorization': f'Bearer {token}'},
        json={
            'name': 'Product mock',
            'description': 'Product description',
            'images_path': ['/uploads/prod.jpg'],
            'quantity': 1,
            'status': 'in_offer',
            'trade_type': 'post',
        },
    )
    assert response.status_code == HTTPStatus.CREATED

    response = client.get('/items/')
    assert response.status_code == HTTPStatus.OK
    data = response.json()
    assert data['totalItems'] >= 1
    assert len(data['data']) >= 1


def test_read_items_filtered_by_status(client):
    response = client.get('/items/?item_status=in_offer')
    assert response.status_code == HTTPStatus.OK
    items = response.json()['data']
    for item_ in items:
        assert item_['status'] == 'in_offer'


def test_read_items_filtered_by_user(client, user):
    response = client.get(f'/items/?user_id={user.id}')
    assert response.status_code == HTTPStatus.OK
    for item_ in response.json()['data']:
        assert item_['user']['id'] == user.id


def test_read_item(client, item):
    response = client.get(f'/items/{item.id}')
    assert response.status_code == HTTPStatus.OK
    assert response.json()['id'] == item.id


def test_read_item_404(client):
    response = client.get('/items/9999')
    assert response.status_code == HTTPStatus.NOT_FOUND


def test_update_item(client, item, token):
    response = client.put(
        f'/items/{item.id}',
        headers={'Authorization': f'Bearer {token}'},
        json={'name': 'Bola Atualizada'},
    )
    assert response.status_code == HTTPStatus.OK
    assert response.json()['name'] == 'Bola Atualizada'


def test_update_item_forbidden(client, other_item, token):
    response = client.put(
        f'/items/{other_item.id}',
        headers={'Authorization': f'Bearer {token}'},
        json={'name': 'Hackeado'},
    )
    assert response.status_code == HTTPStatus.FORBIDDEN


def test_delete_item(client, item, token):
    response = client.delete(
        f'/items/{item.id}',
        headers={'Authorization': f'Bearer {token}'},
    )
    assert response.status_code == HTTPStatus.OK
    assert response.json()['message'] == 'Item deleted'


def test_delete_item_403(client, other_item, token):
    response = client.delete(
        f'/items/{other_item.id}',
        headers={'Authorization': f'Bearer {token}'},
    )
    assert response.status_code == HTTPStatus.FORBIDDEN


def test_delete_item_trade_exists(client, item_with_trade, token):
    response = client.delete(
        f'/items/{item_with_trade.id}',
        headers={'Authorization': f'Bearer {token}'},
    )
    assert response.status_code == HTTPStatus.FORBIDDEN
    assert response.json()['detail'] == 'Permission denied'


def test_upload_image(client, cleanup_uploaded_files):
    file_content = b'dummy image content'
    response = client.post(
        '/items/upload-image',
        files={'file': ('example.jpg', file_content, 'image/jpeg')},
    )
    assert response.status_code == HTTPStatus.OK
    assert response.json()['path'].startswith('/uploads/')
