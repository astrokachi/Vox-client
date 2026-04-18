import type { ReactNode } from 'react';
import { Link, NavLink } from 'react-router';
import '~/styles/components/link-item.scss';

interface LinkItemProps {
  title: string;
  ref: string;
  icon: ReactNode;
  tooltip?: string;
  type?: 'link' | 'action';
}

export const LinkItem = ({ title, icon, ref, tooltip, type = 'link' }: LinkItemProps) => {
  if (type === 'action') {
    return (
      <Link to={ref} data-tooltip={tooltip} className="nav-link">
        <div className="nav-icon">{icon}</div>
        <span className='link-title'>{title}</span>
      </Link>
    );
  }

  return (
    <NavLink
      to={ref}
      end
      className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
      data-tooltip={tooltip}
    >
      <div className="nav-icon">{icon}</div>
      <span className='link-title'>{title}</span>
    </NavLink>
  );
};
