import { CaretUpDownIcon } from '@phosphor-icons/react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { useCurrentUser } from '~/hooks/useCurrentUser';
import { UserMenuSkeleton } from './user-menu-skeleton';

interface UserMenuProps {
  isCollapsed: boolean;
}

interface UserData {
  name?: string;
  username?: string;
  profile_img_url?: string;
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
        {user?.profile_img_url ? (
          <img src={user.profile_img_url} alt={displayName} />
        ) : (
          <span className="avatar-initials">{initials}</span>
        )}
      </div>
      <div className="user-info">
        <span className="user-name">{displayName}</span>
        <span className="user-plan">{user?.username}</span>
      </div>
    </>
  );
};

export const UserMenu = ({ isCollapsed }: UserMenuProps) => {
  const user = useCurrentUser();
  const [isExpanded, setIsExpanded] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const toggle = () => setIsExpanded(prev => !prev);
  const handleLogout = () => navigate('/logout');

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
      {user ? (
        <button className="user-menu-trigger">
          <UserMenuContent user={user} />
          <CaretUpDownIcon className="user-menu-chevron" size={16} weight="bold" />
        </button>
      ) : (
        <UserMenuSkeleton isCollapsed={isCollapsed} />
      )}

      <div className="user-menu-dropdown">
        <button className="dropdown-item danger" onClick={handleLogout}>
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};
