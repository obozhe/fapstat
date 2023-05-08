import { ChartConfiguration, ChartConfigurationCustomTypesPerDataset, LegendItem, TooltipItem } from 'chart.js/auto';
import 'core/ChartjsConfig';
import { isMobile } from 'helpers/screen';

type LineChartNumber =
    | ChartConfiguration<'line', { value: number; y: number; x: number }[], number | string>
    | ChartConfigurationCustomTypesPerDataset<'line', { value: number; y: number; x: number }[], number | string>;

type LineChartConfigOptions = {
    labels: (number | string)[];
    lineOptions: {
        label: string;
        data: { value: number; y: number; x: number }[];
        borderColor: string;
        order?: number;
    }[];
};

export const createLineChartConfig = ({ labels, lineOptions }: LineChartConfigOptions) => {
    const config: LineChartNumber = {
        type: 'line',
        data: {
            labels: labels,
            datasets: lineOptions.map((data) => ({
                ...data,
                pointBackgroundColor: data.borderColor,
                pointBorderColor: 'white',
                pointBorderWidth: 3,
                pointRadius: 5,
                borderWidth: 5,
                tension: 0.19,
            })),
        },
        options: {
            responsive: true,
            interaction: {
                mode: 'point',
                intersect: false,
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function (tooltipItem: TooltipItem<'line'>) {
                            const point = tooltipItem.raw as { value: number; y: number; x: number };
                            tooltipItem.formattedValue = String(point.value);
                        },
                    },
                },
                legend: {
                    labels: {
                        generateLabels: () => {
                            const legendItems: LegendItem[] = lineOptions.map((option) => ({
                                text: option.label,
                                pointStyle: 'rect',
                                fillStyle: option.borderColor,
                                strokeStyle: 'transparent',
                            }));

                            return legendItems;
                        },
                        ...(isMobile() && {
                            font: {
                                size: 12,
                            },
                        }),
                        padding: 6.5,
                    },
                },
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(105, 105, 105, 1)',
                        drawTicks: false,
                    },
                    ticks: {
                        display: false,
                    },
                },
                y: {
                    beginAtZero: true,
                    suggestedMax: 12,
                    grid: {
                        tickBorderDashOffset: 100,
                        color: 'rgba(105, 105, 105, 1)',
                    },
                    ticks: {
                        ...(isMobile() && {
                            font: {
                                size: 12,
                            },
                        }),
                        stepSize: 4,
                        padding: 10,
                        callback: (value) => (value === 20 ? '20+' : value),
                    },
                },
            },
        },
    };

    return config;
};
