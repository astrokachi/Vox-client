import { SidebarIcon } from '@phosphor-icons/react';
import { useState } from 'react';
import { SidebarNavItems } from './sidebar-nav-items';
import { UserMenu } from '../user-menu';

const logo = "/vox-small.png";

export const DesktopSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const toggleCollapse = () => {
    setIsCollapsed(prev => !prev);
  }

  return (
    <aside className={`desktop-sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <nav className='sidebar-nav'>
        <div className='sidebar-control'>
          <div className='brand-logo'>
            <img className='brand-img' src={logo} alt="Vox Logo" />
            <h1 className='brand-text'>Vox</h1>
          </div>
          <div className='sidebar-menu-control-con' data-tooltip={isCollapsed ? "Expand" : "Collapse"}>
            <button className='sidebar-menu-control icon-btn' onClick={toggleCollapse} aria-label="Toggle Sidebar">
              <SidebarIcon size={22} />
            </button>
          </div>
        </div>

        <SidebarNavItems />
        <UserMenu isCollapsed={isCollapsed} />
      </nav>
    </aside>
  );
};
