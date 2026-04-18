import { LinkItem } from '../link-item';
import { RecentChats } from '../recent-chats';
import { navLinks } from './nav-config';

export const SidebarNavItems = () => {
  return (
    <>
      <div className="actions-con">
        {navLinks.filter((navLink => navLink.type == 'action')).map(({ title, ref, icon, type, tooltip }) =>
          <div className='link-con' key={ref}>
            <LinkItem icon={icon} title={title} ref={ref} tooltip={tooltip} type={type as 'action'} />
          </div>
        )}
      </div>

      <div className='nav-links-con'>
        {navLinks.filter(navLink => navLink.type == "link").map(({ title, ref, icon, type, tooltip }) =>
          <div className="link-con" key={ref}>
            {type === "link" && <LinkItem icon={icon} title={title} ref={ref} tooltip={tooltip} />}
          </div>
        )}
      </div>

      <RecentChats />


    </>
  );
};
