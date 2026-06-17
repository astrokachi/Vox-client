import { Outlet, redirect, type ShouldRevalidateFunction } from "react-router";
import { SidebarIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import "~/styles/layout.scss";
import type { User } from "~/types";
import SideBar from "~/components/layouts/sidebar";
import { QuickActions } from "~/components/dashboard/quick-actions";
import { initSocket } from "~/services/socket";
import { getAccessToken, isTokenSet } from "~/lib/auth";

export async function clientLoader() {
  if (!isTokenSet()) {
    return redirect("/logout");
  }

  const token = getAccessToken()!;

  initSocket(token);

  let user: User;
  try {
    user = jwtDecode<User>(token);
  } catch (error) {
    console.error("Failed to decode JWT:", error);
    return redirect("/login");
  }

  return { user, token };
}


export const shouldRevalidate: ShouldRevalidateFunction = () => {
  return false;
};

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
