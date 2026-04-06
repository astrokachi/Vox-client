import { useNavigate } from 'react-router';
import { CaretDownIcon, PlusIcon } from '@phosphor-icons/react';
import '~/styles/components/dashboard/quick-actions.scss';

export const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <button
      className="quick-action-btn"
      onClick={() => navigate('/posts/new')}
      title="Create new post"
    >
      <PlusIcon size={20} weight="bold" />
      <CaretDownIcon size={18} />
    </button>
  );
};
