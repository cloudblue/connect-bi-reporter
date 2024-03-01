def test_get_create_upload_task(
    api_client,
    mocker,
    eaas_schedule_task,
):
    mocker.patch(
        'connect_bi_reporter.scheduler.get_schedule_tasks',
        return_value=[eaas_schedule_task],
    )

    response = api_client.get(
        '/api/settings/schedule-tasks/create-uploads',
    )

    assert response.status_code == 200

    response_data = response.json()

    assert response_data == eaas_schedule_task


def test_get_create_upload_task_not_found(
    api_client,
    mocker,
):
    mocker.patch(
        'connect_bi_reporter.scheduler.get_schedule_tasks',
        return_value=[],
    )

    response = api_client.get(
        '/api/settings/schedule-tasks/create-uploads',
    )

    assert response.status_code == 404

    response_data = response.json()

    assert response_data == {
        'error_code': 'NFND_000',
        'errors': ['Object `create_uploads` not found.'],
    }
