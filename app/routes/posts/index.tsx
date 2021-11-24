import { Link, useLoaderData } from "remix";

type Post = {
  slug: string;
  title: string;
};

export const loader = () => {
  const posts: Post[] = [
    {
      slug: "my-first-post",
      title: "My first post",
    },
    {
      slug: "90s-mix-tape",
      title: "A mix of 90s music",
    },
  ];
  return posts;
};

export default function Posts() {
  const posts = useLoaderData<Post[]>();

  return (
    <div>
      <h1>Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <Link to={post.slug}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
