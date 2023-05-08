import { Chart } from 'chart.js/auto';

Chart.defaults.font.family = "'Montserrat'";
Chart.defaults.font.size = 16;
Chart.defaults.plugins.legend.labels.usePointStyle = true;
Chart.defaults.plugins.legend.labels.pointStyle = 'rect';
Chart.defaults.plugins.legend.align = 'end';
Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(10,10,10,0.8)';
Chart.defaults.maintainAspectRatio = false;
Chart.defaults.plugins.title.align = 'start';
Chart.defaults.plugins.title.padding = 0;
Chart.defaults.responsive = true;
