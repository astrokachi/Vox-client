import { MetricCard } from './metric-card';
import '~/styles/components/dashboard/metrics-grid.scss';

interface MetricsGridProps {
  metrics: Array<{
    label: string;
    value: string | number;
  }>;
}

export const MetricsGrid = ({ metrics }: MetricsGridProps) => {
  return (
    <div className="metrics-grid">
      {metrics.map((metric, index) => (
        <MetricCard key={index} label={metric.label} value={metric.value} />
      ))}
    </div>
  );
};
