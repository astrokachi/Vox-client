import type { ReactNode } from 'react';
import { NavLink } from 'react-router';
import '~/styles/components/link-item.scss';

interface LinkItemProps {
  title: string;
  ref: string;
  icon: ReactNode;
  tooltip?: string;
}

export const LinkItem = ({ title, icon, ref, tooltip }: LinkItemProps) => {
  return (
    <NavLink
      to={ref}
      end={ref === '/'}
      className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
      data-tooltip={tooltip}
    >
      <div className="nav-icon">{icon}</div>
      <span className='link-title'>{title}</span>
    </NavLink>
  );
};
