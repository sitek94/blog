import path from 'path';
import fs from 'fs/promises';
import parseFrontMatter from 'front-matter';
import invariant from 'tiny-invariant';
import { marked } from 'marked';

export type Post = {
  slug: string;
  title: string;
  html: string;
};

export type PostMarkdownAttributes = {
  title: string;
};

function isValidPostAttributes(
  attributes: any,
): attributes is PostMarkdownAttributes {
  return attributes?.title;
}

// relative to the server output not the source!
const postsPath = path.join(__dirname, '..', 'posts');

export async function getPosts() {
  const dir = await fs.readdir(postsPath);

  return Promise.all(
    dir.map(async fileName => {
      const file = await fs.readFile(path.join(postsPath, fileName));
      const { attributes } = parseFrontMatter(file.toString());
      invariant(
        isValidPostAttributes(attributes),
        `${fileName} has bad meta data!`,
      );

      return {
        slug: fileName.replace(/.md$/, ''),
        title: attributes.title,
      };
    }),
  );
}

export async function getPost(slug: string): Promise<Post> {
  const filepath = path.join(postsPath, slug + '.md');
  const file = await fs.readFile(filepath);
  const { attributes, body } = parseFrontMatter(file.toString());
  invariant(
    isValidPostAttributes(attributes),
    `Post ${filepath} is missing attributes`,
  );
  return { slug, title: attributes.title, html: marked(body) };
}

type NewPost = {
  title: string;
  markdown: string;
};

export async function createPost(post: NewPost) {
  let md = `---\ntitle: ${post.title}\n---\n\n${post.markdown}`;
  let slug = post.title.toLowerCase().replace(/\s+/g, '-');

  await fs.writeFile(path.join(postsPath, slug + '.md'), md);
  return getPost(slug);
}
