import { theme } from '../styles/theme';

export const toastConfig = {
  position: 'bottom-right' as const,
  toastOptions: {
    className: theme.toast.base,
    success: {
      className: `${theme.toast.base} ${theme.toast.success}`,
    },
    error: {
      className: `${theme.toast.base} ${theme.toast.error}`,
    },
    loading: {
      className: `${theme.toast.base} ${theme.toast.loading}`,
    },
    default: {
      className: `${theme.toast.base} ${theme.toast.default}`,
    },
  },
};
