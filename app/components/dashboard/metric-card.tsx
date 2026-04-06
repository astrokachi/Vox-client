import '~/styles/components/dashboard/metric-card.scss';

interface MetricCardProps {
  label: string;
  value: string | number;
}

export const MetricCard = ({ label, value }: MetricCardProps) => {
  return (
    <div className="metric-card">
      <span className="metric-label">{label}</span>
      <span className="metric-value">{value}</span>
    </div>
  );
};
