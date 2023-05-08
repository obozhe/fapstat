import { AxiosRequestConfig } from 'axios';
import { useRef } from 'react';
import useSwr, { Key, SWRConfiguration } from 'swr';

const useFetch = <D, E = unknown>(
    key: Key,
    fetcher: (config: AxiosRequestConfig) => Promise<D>,
    options?: SWRConfiguration
) => {
    const abortController = useRef<AbortController>();

    // useEffect(() => {
    //     return () => {
    //         if (!abortController.current || import.meta.env.DEV) return;

    //         abortController.current.abort();
    //     };
    // });

    return useSwr<D, E>(
        key,
        () => {
            abortController.current = new AbortController();

            return fetcher({ signal: abortController.current?.signal });
        },
        options
    );
};

export default useFetch;
