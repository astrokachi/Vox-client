import { useNavigate } from 'react-router';
import { PlusIcon } from '@phosphor-icons/react';
import '~/styles/components/dashboard/quick-actions.scss';

export const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      className="quick-action-btn"
      onClick={() => navigate('/posts/new')}
      aria-label="New post"
      title="New post"
    >
      <PlusIcon size={20} weight="bold" />
    </button>
  );
};
