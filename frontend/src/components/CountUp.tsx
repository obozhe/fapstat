import useIsInViewport from 'hooks/useIsInViewport';
import { useRef } from 'react';
import { CountUp as CountUpLib } from 'use-count-up';

type Props = {
    className?: string;
    value: number | string;
    duration?: number;
};

const CountUp = ({ className, value, duration = 2 }: Props) => {
    const ref = useRef(null);
    const isVisible = useIsInViewport(ref);

    return (
        <span ref={ref} className={className}>
            <CountUpLib isCounting={isVisible} end={Number(value)} duration={duration} />
        </span>
    );
};

export default CountUp;
