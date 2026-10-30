import { useRouteLoaderData } from "react-router";
import type { clientLoader as dashboardLoader } from '~/routes/dashboard/index';
import StartPostForm from "~/components/posts/start-post-form";
import "~/styles/dashboard/posts.scss";

const logo = "/vox-small.png";

const NewPost = () => {
  const dashboardData = useRouteLoaderData<typeof dashboardLoader>('routes/dashboard/index');
  const user = dashboardData?.user;

  return (
    <div className="chat-container">
      <div className="greeting-section">
        <img className="greeting-logo" src={logo} alt="" />
        {user?.name && <p className="greeting-text">Hi, {user.name}</p>}
        <h2 className="greeting-heading">What do you want to post about?</h2>
      </div>

      <StartPostForm />
    </div>
  );
};

export default NewPost;
