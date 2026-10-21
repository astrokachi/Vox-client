import { LinkItem } from '../link-item';
import { RecentChats } from '../recent-chats';
import { navLinks } from './nav-config';

export const SidebarNavItems = () => {
  return (
    <>
      <div className='nav-links-con'>
        {navLinks.map(({ title, ref, icon, type, tooltip }) =>
          <div className="link-con" key={ref}>
            <LinkItem icon={icon} title={title} ref={ref} tooltip={tooltip} type={type as 'link' | 'action'} />
          </div>
        )}
      </div>

      <RecentChats />
    </>
  );
};
