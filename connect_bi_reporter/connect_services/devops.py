def create_schedule_task(client, context, payload):
    return (
        client('devops')
        .services[context.extension_id]
        .environments[context.environment_id]
        .schedules.create(payload=payload)
    )


def get_schedule_tasks(client, context):
    return (
        client('devops')
        .services[context.extension_id]
        .environments[context.environment_id]
        .schedules.all()
    )
