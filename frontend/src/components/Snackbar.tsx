import { OptionsObject, closeSnackbar, enqueueSnackbar } from 'notistack';

export default {
    success(msg: string, options: OptionsObject = {}): void {
        const key = enqueueSnackbar({
            ...options,
            message: msg,
            variant: 'success',
            style: { whiteSpace: 'pre-line' },
            SnackbarProps: {
                onClick: () => {
                    closeSnackbar(key);
                },
            },
        });
    },
    warning(msg: string, options: OptionsObject = {}): void {
        const key = enqueueSnackbar({
            ...options,
            message: msg,
            variant: 'warning',
            style: { whiteSpace: 'pre-line' },
            SnackbarProps: {
                onClick: () => {
                    closeSnackbar(key);
                },
            },
        });
    },
    info(msg: string, options: OptionsObject = {}): void {
        const key = enqueueSnackbar({
            ...options,
            message: msg,
            variant: 'info',
            style: { whiteSpace: 'pre-line' },
            SnackbarProps: {
                onClick: () => {
                    closeSnackbar(key);
                },
            },
        });
    },
    error(msg: string, options: OptionsObject = {}): void {
        const key = enqueueSnackbar({
            ...options,
            message: msg,
            variant: 'error',
            style: { whiteSpace: 'pre-line' },
            SnackbarProps: {
                onClick: () => {
                    closeSnackbar(key);
                },
            },
        });
    },
    toast(msg: string, options: OptionsObject = {}): void {
        const key = enqueueSnackbar({
            ...options,
            message: msg,
            style: { whiteSpace: 'pre-line' },
            SnackbarProps: {
                onClick: () => {
                    closeSnackbar(key);
                },
            },
        });
    },
};
