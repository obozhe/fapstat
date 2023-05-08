import { ChartConfiguration, ChartConfigurationCustomTypesPerDataset } from 'chart.js/auto';
import 'core/ChartjsConfig';
import { isMobile } from 'helpers/screen';

type BarConfigNumber =
    | ChartConfiguration<'bar', number[], number | string>
    | ChartConfigurationCustomTypesPerDataset<'bar', number[], number | string>;

type BarChartConfigOptions = {
    labels: (number | string)[];
    barOptions: {
        label: string;
        data: number[];
        backgroundColor: string;
        order?: number;
        borderRadius?: number;
        minBarLength?: number;
        categoryPercentage?: number;
    }[];
};

export const createBarChartConfig = ({ labels, barOptions }: BarChartConfigOptions) => {
    const config: BarConfigNumber = {
        type: 'bar',
        data: {
            labels: labels,
            datasets: barOptions.map((data) => ({
                ...data,
                borderRadius: 4,
                minBarLength: 2,
                categoryPercentage: 0.7,
            })),
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: {
                        ...(isMobile() && {
                            font: {
                                size: 12,
                            },
                        }),
                        padding: 6.5,
                    },
                },
                tooltip: {
                    mode: 'index',
                },
            },
            scales: {
                x: {
                    stacked: true,
                    display: false,
                },
                y: {
                    display: false,
                },
            },
        },
    };

    return config;
};
