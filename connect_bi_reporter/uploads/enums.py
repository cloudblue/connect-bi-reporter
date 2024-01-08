import enum


class UploadStatusChoices(str, enum.Enum):
    pending = 'pending'
    processing = 'processing'
    uploaded = 'uploaded'
    failed = 'failed'
