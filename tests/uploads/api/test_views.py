def test_list_uploads(installation, feed_factory, api_client, connect_auth_header, upload_factory):
    uploads = []
    invalid_feed = feed_factory(account_id='other-account')
    valid_feed = feed_factory(account_id=installation['owner']['id'])
    upload_factory(feed_id=invalid_feed.id)

    for _ in range(5):
        uploads.append(upload_factory(feed_id=valid_feed.id, name='Name', size=600))

    response = api_client.get(
        f'/api/feeds/{valid_feed.id}/uploads',
        installation=installation,
        headers={'connect-auth': connect_auth_header},
    )

    assert response.status_code == 200

    response_data = response.json()

    assert len(response_data) == len(uploads)

    for upload, response_upload in zip(uploads, response_data):
        assert response_upload['id'] == upload.id
        assert response_upload['name'] == upload.name
        assert response_upload['report'] == {'id': upload.report_id}
        assert response_upload['feed'] == {'id': valid_feed.id}
        assert response_upload['size'] == upload.size
        assert response_upload['status'] == upload.status
        events = response_upload['events']
        assert events['created']['at'] is not None
        assert events['updated']['at'] is not None


def test_list_uploads_feed_not_found(
    installation,
    feed_factory,
    api_client,
    connect_auth_header,
    upload_factory,
):
    uploads = []
    valid_feed = feed_factory(account_id=installation['owner']['id'])
    for _ in range(5):
        uploads.append(upload_factory(feed_id=valid_feed.id, name='Name', size=600))

    response = api_client.get(
        '/api/feeds/NOT-FOUND/uploads',
        installation=installation,
        headers={'connect-auth': connect_auth_header},
    )

    assert response.status_code == 404
    response_data = response.json()
    assert response_data['error_code'] == 'NFND_000'
    assert response_data['errors'][0] == 'Object `NOT-FOUND` not found.'


def test_get_upload(installation, feed_factory, api_client, connect_auth_header, upload_factory):
    feed = feed_factory(account_id=installation['owner']['id'])
    upload = upload_factory(feed_id=feed.id, name='Test', size=600)

    response = api_client.get(
        f'/api/feeds/{feed.id}/uploads/{upload.id}',
        installation=installation,
        headers={'connect-auth': connect_auth_header},
    )

    assert response.status_code == 200

    response_data = response.json()

    assert response_data['id'] == upload.id
    assert response_data['name'] == upload.name
    assert response_data['report'] == {'id': upload.report_id}
    assert response_data['feed'] == {'id': feed.id}
    assert response_data['size'] == upload.size
    assert response_data['status'] == upload.status
    events = response_data['events']
    assert events['created']['at'] is not None
    assert events['updated']['at'] is not None


def test_get_upload_feed_not_found(
    installation,
    feed_factory,
    api_client,
    connect_auth_header,
    upload_factory,
):
    feed = feed_factory(account_id=installation['owner']['id'])
    upload = upload_factory(feed_id=feed.id, name='Test', size=600)

    response = api_client.get(
        f'/api/feeds/FEED-NOT-FOUND/uploads/{upload.id}',
        installation=installation,
        headers={'connect-auth': connect_auth_header},
    )

    assert response.status_code == 404
    response_data = response.json()
    assert response_data['error_code'] == 'NFND_000'
    assert response_data['errors'][0] == 'Object `FEED-NOT-FOUND` not found.'


def test_get_upload_upload_not_found(
    installation,
    feed_factory,
    api_client,
    connect_auth_header,
    upload_factory,
):
    feed = feed_factory(account_id=installation['owner']['id'])
    upload_factory(feed_id=feed.id, name='Test', size=600)

    response = api_client.get(
        f'/api/feeds/{feed.id}/uploads/UPLOAD-NOT-FOUND',
        installation=installation,
        headers={'connect-auth': connect_auth_header},
    )

    assert response.status_code == 404
    response_data = response.json()
    assert response_data['error_code'] == 'NFND_000'
    assert response_data['errors'][0] == 'Object `UPLOAD-NOT-FOUND` not found.'


def test_list_uploads_empty_list(
    installation,
    feed_factory,
    api_client,
    connect_auth_header,
    upload_factory,
):
    invalid_feed = feed_factory(account_id='other-account')
    valid_feed = feed_factory(account_id=installation['owner']['id'])
    upload_factory(feed_id=invalid_feed.id)

    response = api_client.get(
        f'/api/feeds/{valid_feed.id}/uploads',
        installation=installation,
        headers={'connect-auth': connect_auth_header},
    )

    assert response.status_code == 200

    response_data = response.json()

    assert response_data == []
