import '~/styles/components/dashboard/recent-activity.scss';

interface ActivityItem {
  id: string;
  title: string;
  type: 'draft' | 'reply';
  timestamp: string;
}

interface RecentActivityProps {
  items?: ActivityItem[];
}

export const RecentActivity = ({ items }: RecentActivityProps) => {
  const hasItems = items && items.length > 0;

  return (
    <div className="recent-activity">
      <h3 className="activity-title">Recent Activity</h3>

      {!hasItems ? (
        <div className="activity-empty">
          <p>No recent activity yet. Create your first draft to get started!</p>
        </div>
      ) : (
        <div className="activity-list">
          {items.map((item) => (
            <div key={item.id} className="activity-item">
              <div className="activity-content">
                <span className="activity-type">{item.type === 'draft' ? '📝' : '💬'}</span>
                <div className="activity-details">
                  <span className="activity-name">{item.title}</span>
                  <span className="activity-time">{item.timestamp}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
