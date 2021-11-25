import {
  ActionFunction,
  Form,
  redirect,
  useActionData,
  useLoaderData,
  useTransition,
} from 'remix';
import invariant from 'tiny-invariant';
import type { LoaderFunction } from 'remix';
import { getPost } from '~/post';
import type { Post } from '~/post';
import { createPost } from '../../post';

export let loader: LoaderFunction = async ({ params }) => {
  invariant(params.slug, 'expected params.slug');
  return getPost(params.slug);
};

export let action: ActionFunction = async ({ request }) => {
  let formData = await request.formData();
  let title = formData.get('title');
  let markdown = formData.get('markdown');

  let errors: Record<string, boolean> = {};
  if (!title) errors.title = true;
  if (!markdown) errors.markdown = true;

  if (Object.keys(errors).length) {
    return errors;
  }

  invariant(typeof title === 'string');
  invariant(typeof markdown === 'string');

  // When you edit a post, you either overwrite the old one, or create a new one
  // if you change the title.
  await createPost({ title, markdown });

  return redirect('/admin');
};

export default function AdminEditSlug() {
  let post = useLoaderData<Post>();
  let errors = useActionData();
  let transition = useTransition();

  return (
    <Form method="post">
      <p>
        <label>
          Post Title: {errors?.title && <em>Title is required</em>}{' '}
          <input type="text" name="title" defaultValue={post.title} />
        </label>
      </p>
      <p>
        <label htmlFor="markdown">Markdown:</label>{' '}
        {errors?.markdown && <em>Markdown is required</em>}{' '}
        <textarea
          id="markdown"
          name="markdown"
          rows={20}
          defaultValue={post.markdown}
        />
      </p>
      <p>
        <button type="submit">
          {transition.submission ? 'Saving...' : 'Save Post'}
        </button>
      </p>
    </Form>
  );
}
