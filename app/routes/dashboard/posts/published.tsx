import { Link } from "react-router";
import PagedList, { ListEmpty } from "~/components/posts/paged-list";
import PublishedList from "~/components/posts/published-list";
import { usePublishedPosts } from "~/hooks/usePublishedPosts";
import "~/styles/dashboard/posts-list.scss";

const Published = () => {
  const { groups, ...list } = usePublishedPosts();

  return (
    <PagedList
      list={list}
      loadingLabel="Loading published posts"
      moreLabel="older posts"
      empty={
        <ListEmpty
          title="Nothing published yet"
          hint="Posts you publish to X from Vox show up here."
        >
          <Link className="posts-empty-link" to="/posts">
            Go to your posts
          </Link>
        </ListEmpty>
      }
    >
      <PublishedList groups={groups} />
    </PagedList>
  );
};

export default Published;
