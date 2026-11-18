import { createRoot } from 'react-dom/client';
import type { ReactNode } from 'react';
import {
  Journal,
  PostStory,
  ReaderLinks,
  SiteAbout,
  SiteHome,
  SiteNotFound,
} from '../components/public-site';
import type { PostArchive, PostDetail, PostSummary } from '../lib/posts-types';

declare const JOURNAL_BACKEND_ORIGIN: string;
const backend = JOURNAL_BACKEND_ORIGIN;
const title = 'Bringing Life in Desolation';
const mount = document.getElementById('journal');

const links = {
  page(path: string) {
    if (path === '/') return './';
    if (path === '/admin') return `${backend}/admin`;
    if (path === '/about') return './?view=about';
    if (path === '/journal' || path.startsWith('/journal?')) {
      const params = new URL(path, location.origin).searchParams;
      params.set('view', 'journal');
      return `./?${params}`;
    }
    if (path.startsWith('/posts/')) {
      const params = new URLSearchParams({
        view: 'story',
        slug: decodeURIComponent(path.slice('/posts/'.length)),
      });
      return `./?${params}`;
    }
    return path;
  },
  cover(path: string) {
    if (path.startsWith('/covers/')) return `.${path}`;
    if (path.startsWith('/media/')) return `${backend}${path}`;
    return path;
  },
  searchAction: './',
  searchView: 'journal',
};

async function read<T>(path: string): Promise<T | null> {
  const response = await fetch(`${backend}${path}`, { credentials: 'omit' });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error('The journal could not be loaded.');
  return response.json();
}

async function currentView(): Promise<{
  heading?: string;
  content: ReactNode;
}> {
  const params = new URLSearchParams(location.search);
  const view = params.get('view');
  if (view === 'about') return { heading: 'About', content: <SiteAbout /> };
  if (view === 'journal') {
    const filters = new URLSearchParams();
    for (const key of ['category', 'q', 'page']) {
      const value = params.get(key);
      if (value) filters.set(key, value);
    }
    const archive = await read<PostArchive>(`/api/journal?${filters}`);
    if (!archive) throw new Error('The archive could not be loaded.');
    return { heading: 'The journal', content: <Journal {...archive} /> };
  }
  if (view === 'story') {
    const slug = params.get('slug') || '';
    const detail = await read<PostDetail>(
      `/api/journal/posts/${encodeURIComponent(slug)}`,
    );
    return detail
      ? { heading: detail.post.title, content: <PostStory {...detail} /> }
      : { heading: 'Story not found', content: <SiteNotFound /> };
  }
  if (view) return { heading: 'Page not found', content: <SiteNotFound /> };
  const home = await read<{ posts: PostSummary[] }>('/api/journal/home');
  if (!home) throw new Error('The homepage could not be loaded.');
  return { content: <SiteHome posts={home.posts} /> };
}

if (mount) {
  const root = createRoot(mount);
  currentView()
    .then(({ heading, content }) => {
      if (heading) document.title = `${heading} · ${title}`;
      root.render(
        <ReaderLinks.Provider value={links}>{content}</ReaderLinks.Provider>,
      );
    })
    .catch(() => {
      root.render(
        <main className="system-page section-wrap">
          <a className="system-brand" href="./">
            {title}
            <span>✳</span>
          </a>
          <div className="system-panel">
            <h1>The journal is taking a moment.</h1>
            <p>Reload the page, or read the journal on its Cloudflare site.</p>
            <a className="button button-dark" href={backend}>
              Open the journal <span aria-hidden="true">↗</span>
            </a>
          </div>
        </main>,
      );
    });
}
