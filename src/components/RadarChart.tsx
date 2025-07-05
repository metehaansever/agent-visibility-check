
import React from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface RadarChartData {
  schemaUsage?: number;
  readability?: number;
  socialSignals?: number;
  llmContextMatch?: number;
  mentionVisibility?: number;
}

interface RadarChartProps {
  data: RadarChartData;
  title?: string;
  comparison?: RadarChartData;
  comparisonLabel?: string;
}

const RadarChart: React.FC<RadarChartProps> = ({ 
  data, 
  title, 
  comparison, 
  comparisonLabel = "Comparison" 
}) => {
  const labels = [
    'Schema Usage',
    'Readability',
    'Social Signals',
    'LLM Context Match',
    'Mention Visibility'
  ];

  const values = [
    data.schemaUsage || 0,
    data.readability || 0,
    data.socialSignals || 0,
    data.llmContextMatch || 0,
    data.mentionVisibility || 0
  ];

  const comparisonValues = comparison ? [
    comparison.schemaUsage || 0,
    comparison.readability || 0,
    comparison.socialSignals || 0,
    comparison.llmContextMatch || 0,
    comparison.mentionVisibility || 0
  ] : [];

  const chartData = {
    labels,
    datasets: [
      {
        label: title || 'Analysis',
        data: values,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        borderColor: 'rgba(0, 0, 0, 0.8)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(0, 0, 0, 0.8)',
        pointBorderColor: '#000',
      },
      ...(comparison ? [{
        label: comparisonLabel,
        data: comparisonValues,
        backgroundColor: 'rgba(128, 128, 128, 0.1)',
        borderColor: 'rgba(128, 128, 128, 0.8)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(128, 128, 128, 0.8)',
        pointBorderColor: '#808080',
      }] : [])
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: !!comparison,
        labels: {
          font: {
            family: 'Inter, sans-serif',
          }
        }
      },
    },
    scales: {
      r: {
        angleLines: {
          color: 'rgba(128, 128, 128, 0.3)',
        },
        grid: {
          color: 'rgba(128, 128, 128, 0.3)',
        },
        pointLabels: {
          font: {
            family: 'Inter, sans-serif',
            size: 12,
          },
          color: '#000',
        },
        ticks: {
          display: false,
        },
        suggestedMin: 0,
        suggestedMax: 100,
      },
    },
  };

  return (
    <div className="w-full h-64">
      <Radar data={chartData} options={options} />
    </div>
  );
};

export default RadarChart;
