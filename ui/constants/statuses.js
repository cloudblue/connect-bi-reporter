import { COLORS_DICT } from '~/constants/colors';

export const STATUSES_DICT = {
  ENABLED: 'enabled',
  DISABLED: 'disabled',
  FAILED: 'failed',
  PENDING: 'pending',
  PROCESSING: 'processing',
  UPLOADED: 'uploaded',
};

export const STATUSES = {
  [STATUSES_DICT.ENABLED]: {
    text: 'Enabled',
    icon: 'googleFiberManualRecordBaseline',
    color: COLORS_DICT.NICE_GREEN,
  },
  [STATUSES_DICT.DISABLED]: {
    text: 'Disabled',
    icon: 'googleFiberManualRecordBaseline',
    color: COLORS_DICT.MIDDLE_GREY,
  },
  [STATUSES_DICT.FAILED]: {
    text: 'Failed',
    icon: 'googleCancelBaseline',
    color: COLORS_DICT.NICE_RED,
  },
  [STATUSES_DICT.PENDING]: {
    text: 'Pending',
    icon: 'connectClockAnimated',
    color: COLORS_DICT.MIDDLE_GREY,
  },
  [STATUSES_DICT.PROCESSING]: {
    text: 'Processing',
    icon: 'connectClockAnimated',
    color: COLORS_DICT.MIDDLE_GREY,
  },
  [STATUSES_DICT.UPLOADED]: {
    text: 'Uploaded',
    icon: 'googleCheckCircleBaseline',
    color: COLORS_DICT.NICE_GREEN,
  },
};
