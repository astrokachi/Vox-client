import { CaretUpDownIcon } from '@phosphor-icons/react';

interface UserMenuSkeletonProps {
  isCollapsed: boolean;
}

export const UserMenuSkeleton = ({ isCollapsed }: UserMenuSkeletonProps) => {
  return (
    <button className="user-menu-trigger user-menu-skeleton-trigger" disabled>
      <div className="user-avatar skeleton" />
      <div className="user-info">
        <span className="user-name skeleton skeleton-text" />
        <span className="user-plan skeleton skeleton-text" />
      </div>
      <CaretUpDownIcon className="user-menu-chevron" size={16} weight="bold" />
    </button>
  );
};
