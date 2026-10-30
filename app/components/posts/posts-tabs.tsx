import { NavLink } from "react-router";
import "~/styles/components/posts-tabs.scss";

const TABS = [
  { label: "All", to: "/posts", end: true },
  { label: "Published", to: "/posts/published", end: false },
];

// Switches between every post and the ones published to X. Each tab is a
// route, so it survives reloads and the back button.
const PostsTabs = () => (
  <nav className="posts-tabs" aria-label="Posts">
    {TABS.map((tab) => (
      <NavLink
        key={tab.to}
        to={tab.to}
        end={tab.end}
        className={({ isActive }) => `posts-tab${isActive ? " posts-tab--active" : ""}`}
      >
        {tab.label}
      </NavLink>
    ))}
  </nav>
);

export default PostsTabs;
