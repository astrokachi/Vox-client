import '~/styles/components/sidebar.scss';
import { DesktopSidebar } from './navigation/desktop-sidebar';
import { MobileSidebarDrawer } from './navigation/mobile-sidebar-drawer';

interface SideBarProps {
  mobileMenuOpen?: boolean;
  onMobileMenuToggle?: (open: boolean) => void;
}

const SideBar = ({ mobileMenuOpen = false, onMobileMenuToggle }: SideBarProps) => {

  const handleCloseMobileMenu = () => {
    if (onMobileMenuToggle) {
      onMobileMenuToggle(false);
    }
  };

  return (
    <>
      {/* Desktop Shell - Hidden via CSS on mobile */}
      <div className="desktop-sidebar-shell">
        <DesktopSidebar />
      </div>

      {/* Mobile Shell - Hidden via CSS on desktop */}
      <div className="mobile-sidebar-shell">
        <MobileSidebarDrawer
          isOpen={mobileMenuOpen}
          onClose={handleCloseMobileMenu}
        />
      </div>
    </>
  )
}

export default SideBar;
