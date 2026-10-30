import type { ReactNode } from 'react';
import { NotePencilIcon, PlusIcon } from '@phosphor-icons/react';

// Rendered in this order as one group.
// Overview, Replies and Campaigns return here when they are real features (PRODUCT.md).
export const navLinks: {
  title: string;
  ref: string;
  icon: ReactNode;
  type: "link" | "action";
  tooltip: string;
  exclude?: string[];
}[] = [
  {
    title: "New post",
    ref: "/posts/new",
    icon: <PlusIcon size={22} />,
    type: "action",
    tooltip: "New post"
  },
  {
    title: "Posts",
    ref: "/posts",
    icon: <NotePencilIcon size={22} />,
    type: "link",
    tooltip: "Posts",
    // New post has its own nav item.
    exclude: ["/posts/new"],
  },
];
