import { Outlet } from "react-router";
import { SidebarIcon } from "@phosphor-icons/react";
import { useState } from "react";
// import TopBar from "~/components/layouts/topbar";
import "~/styles/layout.scss";
import type { Route } from "./+types";
import { getSession } from "~/sessions.server";
import SideBar from "~/components/layouts/sidebar";
import { QuickActions } from "~/components/dashboard/quick-actions";

export async function loader({
  request,
}: Route.LoaderArgs) {
  const session = await getSession(
    request.headers.get("Cookie")
  );

  if (!session.has("jwtoken")) {
    // return redirect('/login')
  }

  return null;
}

const DashboardLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };
  return (
    <main className="app-layout">
      {/* Mobile header - only visible on mobile */}
      <div className="mobile-header">
        <button
          className="mobile-menu-btn"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <SidebarIcon size={22} />
        </button>
        <div className="mobile-header-spacer" />
        <div className="mobile-header-actions">
          <QuickActions />
        </div>
      </div>

      <SideBar mobileMenuOpen={mobileMenuOpen} onMobileMenuToggle={setMobileMenuOpen} />

      <div className="main-content" onClick={mobileMenuOpen ? closeMobileMenu : undefined}>
        {/* <TopBar /> */}
        <div className="dashboard-content">
          <Outlet />
        </div>
      </div>
    </main>
  );
};

export default DashboardLayout;
