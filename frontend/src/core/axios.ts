import a, { AxiosError, CanceledError } from 'axios';
import snackbar from 'components/Snackbar';

const axios = a.create({ baseURL: `/api` });

axios.interceptors.response.use(
    (response) => response.data,
    (err) => {
        if (err instanceof CanceledError) {
            return Promise.reject(err);
        }

        if (err instanceof AxiosError) {
            const error = err.response?.data;
            const message = Array.isArray(error.message) ? error.message.join('\n') : error.message;
            snackbar.error(message || 'Oops... Something went wrong');
        }

        return Promise.reject(err);
    }
);

export default axios;
