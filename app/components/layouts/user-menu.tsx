import { CaretUpDownIcon } from '@phosphor-icons/react';
import { useEffect, useRef, useState, Suspense } from 'react';
import { Await, useRouteLoaderData } from 'react-router';
import type { loader as dashboardLoader } from '~/routes/dashboard/index';
import { UserMenuSkeleton } from './user-menu-skeleton';

interface UserMenuProps {
  isCollapsed: boolean;
}

interface UserData {
  name?: string;
  username?: string;
}

const UserMenuContent = ({ user }: { user: UserData }) => {
  const displayName = user?.name ?? 'User';
  const initials = displayName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <>
      <div className="user-avatar">
        <span className="avatar-initials">{initials}</span>
      </div>
      <div className="user-info">
        <span className="user-name">{displayName}</span>
        <span className="user-plan">{user?.username}</span>
      </div>
    </>
  );
};

export const UserMenu = ({ isCollapsed }: UserMenuProps) => {
  const loaderData = useRouteLoaderData<typeof dashboardLoader>('routes/dashboard/index');
  const userPromise = loaderData?.userPromise;
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

  return (
    <div ref={menuRef} onClick={toggle} aria-expanded={isExpanded} className={`user-menu ${isCollapsed ? 'collapsed' : ''} ${isExpanded ? 'expanded' : ''}`}>
      <Suspense fallback={<UserMenuSkeleton isCollapsed={isCollapsed} />}>
        {userPromise ? (
          <Await
            resolve={userPromise}
            errorElement={<UserMenuSkeleton isCollapsed={isCollapsed} />}
          >
            {(user) => (
              <button className="user-menu-trigger">
                <UserMenuContent user={user} />
                <CaretUpDownIcon className="user-menu-chevron" size={16} weight="bold" />
              </button>
            )}
          </Await>
        ) : (
          <UserMenuSkeleton isCollapsed={isCollapsed} />
        )}
      </Suspense>

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
