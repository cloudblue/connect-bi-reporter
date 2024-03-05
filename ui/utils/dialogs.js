import { ACTIONS_DICT, ACTIONS_LABELS } from '~/constants/dialogs';

export const buildAction = (action, opts = {}) => {
  if (action === ACTIONS_DICT.SPACER) return { key: 'spacer' };

  return {
    key: action,
    label: opts.label || ACTIONS_LABELS[action],
    handler: opts.handler,
    disabled: opts.disabled,
    loading: opts.loading,
    color: opts.color,
  };
};
