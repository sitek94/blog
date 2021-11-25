import { useLoaderData } from 'remix';
import invariant from 'tiny-invariant';
import type { LoaderFunction } from 'remix';
import { getPost } from '~/post';
import { marked } from 'marked';

type Post = {
  title: string;
  html: string;
};

export let loader: LoaderFunction = async ({ params }) => {
  invariant(params.slug, 'expected params.slug');
  let { title, markdown } = await getPost(params.slug);

  return {
    title,
    html: marked(markdown),
  };
};

export default function PostSlug() {
  const post = useLoaderData<Post>();
  return <div dangerouslySetInnerHTML={{ __html: post.html }} />;
}
