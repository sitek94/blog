import { Form, redirect, useActionData, useTransition } from 'remix';
import { createPost } from '~/post';
import type { ActionFunction } from 'remix';
import invariant from 'tiny-invariant';

export let action: ActionFunction = async ({ request }) => {
  // Fake delay
  await new Promise(res => setTimeout(res, 2000));

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
  await createPost({ title, markdown });

  return redirect('/admin');
};

export default function NewPost() {
  let errors = useActionData();
  let transition = useTransition();

  return (
    <Form method="post">
      <p>
        <label>
          Post Title: {errors?.title && <em>Title is required</em>}{' '}
          <input type="text" name="title" />
        </label>
      </p>
      <p>
        <label htmlFor="markdown">Markdown:</label>{' '}
        {errors?.markdown && <em>Markdown is required</em>}{' '}
        <textarea id="markdown" name="markdown" rows={20} />
      </p>
      <p>
        <button type="submit">
          {transition.submission ? 'Creating...' : 'Create Post'}
        </button>
      </p>
    </Form>
  );
}
