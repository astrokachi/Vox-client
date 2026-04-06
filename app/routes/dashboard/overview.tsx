import "../../styles/dashboard/overview.scss";
import { MetricsGrid } from "~/components/dashboard/metrics-grid";
import { RecentActivity } from "~/components/dashboard/recent-activity";

const Overview = () => {
  // Mock data for metrics
  const metrics = [
    { label: "Bot Status", value: "Active since 2h ago" },
    { label: "Total Posts", value: "--" },
    { label: "Replies Sent", value: "--" },
    { label: "Last Activity", value: "--" },
  ];

  // Mock data for recent activity (empty for now)
  const recentItems = undefined;

  return (
    <section className="overview-container">
      <div className="overview-content">
        <MetricsGrid metrics={metrics} />

        <RecentActivity items={recentItems} />
      </div>
    </section>
  );
};

export default Overview;
