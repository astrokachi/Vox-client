import PagedList, { ListEmpty } from "~/components/posts/paged-list";
import PostList from "~/components/posts/post-list";
import StartPostForm from "~/components/posts/start-post-form";
import { usePostList } from "~/hooks/usePostList";

const Posts = () => {
  const { groups, ...list } = usePostList();

  return (
    <PagedList
      list={list}
      loadingLabel="Loading posts"
      moreLabel="older posts"
      empty={
        <ListEmpty
          title="Write your first post"
          hint="Describe a topic and Vox writes three drafts for you to pick from."
        >
          <StartPostForm />
        </ListEmpty>
      }
    >
      <PostList groups={groups} />
    </PagedList>
  );
};

export default Posts;
