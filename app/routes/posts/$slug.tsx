import { useLoaderData } from "remix";
import invariant from "tiny-invariant";
import type { LoaderFunction } from "remix";
import { getPost } from "~/post";
import type { Post } from "~/post";

export let loader: LoaderFunction = async ({ params }) => {
  invariant(params.slug, "expected params.slug");
  return getPost(params.slug);
};

export default function PostSlug() {
  const post = useLoaderData<Post>();
  return <div dangerouslySetInnerHTML={{ __html: post.html }} />;
}
