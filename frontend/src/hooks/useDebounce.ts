import debounce from 'lodash.debounce';
import { useMemo } from 'react';

import useLatest from './useLatest';

const useDebounce = <T>(cb: (...args: any[]) => T, ms = 300) => {
    const latestCb = useLatest(cb);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    return useMemo(() => debounce((...args) => latestCb.current(...args), 300), [ms]);
};

export default useDebounce;
