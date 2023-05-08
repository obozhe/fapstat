import { Chart } from 'chart.js/auto';
import dayjs from 'dayjs';
import { getArrayFromRange } from 'helpers/array';
import { PerDayStats } from 'modules/Home/types/stats';
import { useEffect, useRef } from 'react';

import { createLineChartConfig } from './durationChartConfig';

type Props = {
    data: PerDayStats;
};

const DurationChart = ({ data }: Props) => {
    const chartRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!chartRef.current) return;

        const convertedUserData = data.user.map((value, i) => ({ value, x: i, y: value > 20 ? 20 : value }));
        const convertedOthersData = data.others.map((value, i) => ({ value, x: i, y: value > 20 ? 20 : value }));

        const chart = new Chart(
            chartRef.current,
            createLineChartConfig({
                labels: getArrayFromRange(data.user.length, 1).map((day) => `${day} ${dayjs().format('MMMM')}`),
                lineOptions: [
                    { data: convertedUserData, borderColor: '#2AAFCC', label: 'YOU' },
                    { data: convertedOthersData, borderColor: '#101010', label: 'OTHERS' },
                ],
            })
        );

        return () => {
            chart.destroy();
        };
    }, [data]);

    return <canvas ref={chartRef} />;
};

export default DurationChart;
