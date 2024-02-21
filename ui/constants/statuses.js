import { COLORS_DICT } from '~/constants/colors';

export const STATUSES_DICT = {
  ENABLED: 'enabled',
  DISABLED: 'disabled',
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
};
