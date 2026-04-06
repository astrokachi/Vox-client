import { useLocation } from "react-router";
import "~/styles/components/topbar.scss";

type Tab = "Overview" | "Posts" | "Replies";

const getCurrentTab = (pathname: string): Tab => {
  if (pathname.includes("posts")) return "Posts";
  if (pathname.includes("replies")) return "Replies";
  return "Overview";
};

const TopBar = () => {
  const { pathname } = useLocation();
  const currentTab = getCurrentTab(pathname);

  return (
    <header className="topbar-con">
      <span className="topbar-title" aria-current="page">
        {currentTab}
      </span>
      {/* <button className="btn-upgrade">Upgrade</button> */}
    </header>
  );
};

export default TopBar;
