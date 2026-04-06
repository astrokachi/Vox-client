import { ChatsCircleIcon, NotePencilIcon, PlusIcon, SquaresFourIcon, TargetIcon } from '@phosphor-icons/react';

export const navLinks = [
  {
    title: "Overview",
    ref: "/",
    icon: <SquaresFourIcon size={22} />,
    type: "link",
    tooltip: "Overview"
  },
  {
    title: "Posts",
    ref: "/posts",
    icon: <NotePencilIcon size={22} />,
    type: "link",
    tooltip: "Posts"
  },
  {
    title: "Replies",
    ref: "/replies",
    icon: <ChatsCircleIcon size={22} />,
    type: "link",
    tooltip: "Replies"
  },
  {
    title: "Campaigns",
    ref: "/campaigns",
    icon: <TargetIcon size={22} />,
    type: "link",
    tooltip: "Campaigns"
  },
  {
    title: "New Post",
    ref: "/posts/new",
    icon: <PlusIcon size={22} />,
    type: "action",
    tooltip: "New Post"
  },
];
