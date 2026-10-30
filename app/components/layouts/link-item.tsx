import type { ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router';
import '~/styles/components/link-item.scss';

interface LinkItemProps {
  title: string;
  ref: string;
  icon: ReactNode;
  tooltip?: string;
  type?: 'link' | 'action';
  // Paths under `ref` that belong to another nav item, so this one isn't active there.
  exclude?: string[];
}

export const LinkItem = ({ title, icon, ref, tooltip, type = 'link', exclude = [] }: LinkItemProps) => {
  const { pathname } = useLocation();
  const excluded = exclude.some((path) => pathname === path || pathname.startsWith(`${path}/`));

  return (
    <NavLink
      to={ref}
      // An action is only active on its own page, not on pages beneath it.
      end={type === 'action'}
      className={({ isActive }) => `nav-link ${isActive && !excluded ? 'active' : ''}`}
      data-tooltip={tooltip}
    >
      <div className="nav-icon">{icon}</div>
      <span className='link-title'>{title}</span>
    </NavLink>
  );
};
