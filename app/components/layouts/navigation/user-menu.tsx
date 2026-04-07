import { CaretUpDownIcon } from '@phosphor-icons/react';
import { useEffect, useRef, useState } from 'react';
import { useRouteLoaderData } from 'react-router';
import type { loader as dashboardLoader } from '~/routes/dashboard/index';

interface UserMenuProps {
  isCollapsed: boolean;
}

export const UserMenu = ({ isCollapsed }: UserMenuProps) => {
  const data = useRouteLoaderData<typeof dashboardLoader>('routes/dashboard/index');
  const user = data?.user ?? null;
  const [isExpanded, setIsExpanded] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggle = () => setIsExpanded(prev => !prev);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded]);

  const displayName = user?.name ?? 'User';
  const initials = displayName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div ref={menuRef} onClick={toggle} aria-expanded={isExpanded} className={`user-menu ${isCollapsed ? 'collapsed' : ''} ${isExpanded ? 'expanded' : ''}`}>
      <button className="user-menu-trigger">
        <div className="user-avatar">
          <span className="avatar-initials">{initials}</span>
        </div>
        <div className="user-info">
          <span className="user-name">{displayName}</span>
          <span className="user-plan">{user?.username}</span>
        </div>
        <CaretUpDownIcon className="user-menu-chevron" size={16} weight="bold" />
      </button>

      <div className="user-menu-dropdown">
        <button className="dropdown-item">
          <span>Profile Settings</span>
        </button>
        <button className="dropdown-item">
          <span>Billing</span>
        </button>
        <button className="dropdown-item danger">
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};
