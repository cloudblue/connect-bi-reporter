import io
from datetime import datetime
from zipfile import ZipFile

from connect.eaas.core.decorators import schedulable
from connect.eaas.core.responses import (
    ScheduledExecutionResponse,
)

from connect_bi_reporter.connect_services.reports import download_report
from connect_bi_reporter.db import get_db_ctx_manager
from connect_bi_reporter.uploads.models import Upload
from connect_bi_reporter.uploads.storage_utils import upload_file


class UploadTaskApplicationMixin:
    @schedulable(
        'Create Uploads',
        'DESCRIPTION',
    )
    def create_uploads(self, schedule):
        return ScheduledExecutionResponse.done()

    @schedulable(
        'Process Uploads',
        'This task will download the report from connect and published it in the respective'
        ' storage (only Azure at the moment).'
        'It expects as parameter an upload_id.',
    )
    def process_upload(self, schedule):
        if 'installation_id' not in schedule['parameter']:
            return ScheduledExecutionResponse.fail(output='Parameter installation_id is missing.')

        instalation_client = self.get_installation_admin_client(
            schedule['parameter']['installation_id'],
        )

        upload_id = schedule['parameter'].get('upload_id')

        with get_db_ctx_manager(self.config) as db:
            upload = db.query(Upload).filter_by(id=upload_id).with_for_update().first()

            if not upload:
                return ScheduledExecutionResponse.fail(output=f'Invalid upload `{upload_id}`.')

            if upload.status != 'pending':
                return ScheduledExecutionResponse.fail(
                    output=f'Cannot process upload in status `{upload.status}`.',
                )

            upload.status = 'processing'
            db.add(upload)
            db.commit()

            try:
                report_data = download_report(instalation_client, upload.report_id)

                feed = upload.feed
                file_name = f'{feed.file_name}_{datetime.now().strftime("%Y%m%d %H:%M:%S")}.csv'

                with ZipFile(io.BytesIO(report_data), 'r') as myzip:
                    with myzip.open('report.csv') as myfile:
                        uploaded_file_props = upload_file(
                            myfile.read(), file_name, feed.credential, self.logger,
                        )
                        upload.size = uploaded_file_props.get('size', 0)

                upload.status = 'uploaded'
                upload.name = file_name
                db.add(upload)
                db.commit()
                return ScheduledExecutionResponse.done()
            except Exception:
                self.logger.exception(msg='Error processing upload')
                upload.status = 'failed'
                db.add(upload)
                db.commit()
                return ScheduledExecutionResponse.fail()
