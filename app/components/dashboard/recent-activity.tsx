import { ChatCircleIcon, NotePencilIcon } from '@phosphor-icons/react';
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
    <section className="recent-activity">
      <h2 className="activity-title">Recent activity</h2>

      {!hasItems ? (
        <p className="activity-empty">
          No activity yet. Drafts and replies will show up here.
        </p>
      ) : (
        <ul className="activity-list">
          {items.map((item) => (
            <li key={item.id} className="activity-item">
              <span className="activity-type" aria-label={item.type === 'draft' ? 'Draft' : 'Reply'}>
                {item.type === 'draft' ? <NotePencilIcon size={16} /> : <ChatCircleIcon size={16} />}
              </span>
              <span className="activity-name">{item.title}</span>
              <span className="activity-time">{item.timestamp}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
