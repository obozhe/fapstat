import { Chart } from 'chart.js/auto';
import dayjs from 'dayjs';
import { getArrayFromRange } from 'helpers/array';
import { PerDayStats } from 'modules/Home/types/stats';
import { useEffect, useRef } from 'react';

import { createBarChartConfig } from './monthChartConfig';

type Props = {
    data: PerDayStats;
};

const MonthChart = ({ data }: Props) => {
    const chartRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!chartRef.current) return;

        const chartConfig = createBarChartConfig({
            labels: getArrayFromRange(data.user.length, 1).map((day) => `${day} ${dayjs().format('MMMM')}`),
            barOptions: [
                {
                    label: 'YOU',
                    data: data.user,
                    backgroundColor: '#2AAFCC',
                },
                {
                    label: 'OTHERS',
                    data: data.others,
                    backgroundColor: '#101010',
                    order: 1,
                },
            ],
        });

        const chart = new Chart(chartRef.current, chartConfig);

        return () => {
            chart.destroy();
        };
    }, [chartRef, data]);

    return <canvas ref={chartRef} />;
};

export default MonthChart;
