import { SidebarIcon } from '@phosphor-icons/react';
import { SidebarNavItems } from './sidebar-nav-items';
import { UserMenu } from '../user-menu';

const logo = "/vox-small.png";

interface MobileSidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileSidebarDrawer = ({ isOpen, onClose }: MobileSidebarDrawerProps) => {
  return (
    <>
      <div
        className={`mobile-drawer-backdrop ${isOpen ? 'open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={`mobile-sidebar-drawer ${isOpen ? 'open' : ''}`}
        aria-modal="true"
        role="dialog"
        aria-label="Navigation Menu"
      >
        <nav className='sidebar-nav'>
          <div className='sidebar-control'>
            <div className='brand-logo'>
              <img className='brand-img' src={logo} alt="Vox Logo" />
              <h1 className='brand-text'>Vox</h1>
            </div>
            <div className='sidebar-menu-control-con'>
              <button className='sidebar-close-mobile icon-btn' onClick={onClose} aria-label="Close Navigation">
                <SidebarIcon size={22} />
              </button>
            </div>
          </div>

          <SidebarNavItems />
          <UserMenu isCollapsed={false} />
        </nav>
      </aside>
    </>
  );
};
