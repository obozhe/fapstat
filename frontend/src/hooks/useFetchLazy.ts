import { useRef } from 'react';
import { Key } from 'swr';
import useSWRMutation, { SWRMutationConfiguration } from 'swr/mutation';

const useFetchLazy = <D = any, A = void, E = any>(
    key: Key,
    fetcher: (...args: any[]) => Promise<D>,
    options?: SWRMutationConfiguration<D, E, A>
) => {
    const abortController = useRef<AbortController>();

    // useEffect(() => {
    //     return () => {
    //         if (!abortController.current || import.meta.env.DEV) return;

    //         abortController.current.abort();
    //     };
    // });

    return useSWRMutation<D, E, Key, A>(
        key,
        (_: Key, { arg }: { arg: A }) => {
            abortController.current = new AbortController();

            const params = Array.isArray(arg) ? arg : [arg];

            return fetcher(...params, { signal: abortController.current.signal });
        },
        { ...options, populateCache: false }
    );
};

export default useFetchLazy;
