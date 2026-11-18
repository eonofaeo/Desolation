import { createContext, useContext } from 'react';
import type { ComponentProps, ReactNode } from 'react';
import type { PostDetail, PostSummary } from '../lib/posts-types';

export const ReaderLinks = createContext({
  page: (path: string) => path,
  cover: (path: string) => path,
  searchAction: '/journal',
  searchView: '',
});

function ReaderLink(props: ComponentProps<'a'> & { href: string }) {
  const { page } = useContext(ReaderLinks);
  return <a {...props} href={page(props.href)} />;
}

function ReaderImage(props: ComponentProps<'img'> & { src: string }) {
  const { cover } = useContext(ReaderLinks);
  return <img {...props} src={cover(props.src)} />;
}

const categories = ['life', 'tech', 'news', 'reviews'] as const;
const categoryName = (category: string) =>
  category.charAt(0).toUpperCase() + category.slice(1);
const storyUrl = (post: PostSummary) =>
  `/posts/${encodeURIComponent(post.slug)}`;
const dateLabel = (date: string | null) => {
  if (!date) return 'The journal';
  const value = new Date(date);
  return Number.isNaN(value.getTime())
    ? 'The journal'
    : new Intl.DateTimeFormat('en', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        timeZone: 'UTC',
      }).format(value);
};
const imageFor = (post: PostSummary) =>
  post.coverUrl || `/covers/${post.category}.webp`;
const topicLabel = (post: PostSummary) =>
  `${categoryName(post.category)}${post.id.startsWith('sample-') ? ' / Sample' : ''}`;

function Header() {
  return (
    <header className="site-header">
      <div className="header-top">
        <ReaderLink
          className="brand"
          href="/"
          aria-label="Bringing Life in Desolation home"
        >
          <span>Bringing Life</span>
          <span>
            in Desolation<span className="brand-dot">.</span>
          </span>
        </ReaderLink>
        <span className="header-note">
          An independent journal
          <br />
          for a curious life.
        </span>
        <ReaderLink className="header-index" href="/journal">
          Explore the journal <span aria-hidden="true">↗</span>
        </ReaderLink>
      </div>
      <nav className="main-nav" aria-label="Main navigation">
        <ReaderLink href="/">Home</ReaderLink>
        {categories.map((category) => (
          <ReaderLink key={category} href={`/journal?category=${category}`}>
            {categoryName(category)}
          </ReaderLink>
        ))}
        <ReaderLink href="/about">About</ReaderLink>
        <ReaderLink className="nav-all" href="/journal">
          All stories <span aria-hidden="true">↗</span>
        </ReaderLink>
      </nav>
    </header>
  );
}
function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div>
          <ReaderLink className="footer-brand" href="/">
            Bringing Life
            <br />
            <em>in Desolation.</em>
          </ReaderLink>
        </div>
        <div className="footer-links">
          <span>Explore</span>
          <ReaderLink href="/journal">All stories</ReaderLink>
          <ReaderLink href="/about">About the journal</ReaderLink>
          <ReaderLink href="/admin">Admin</ReaderLink>
        </div>
        <div className="footer-links">
          <span>Topics</span>
          {categories.map((category) => (
            <ReaderLink key={category} href={`/journal?category=${category}`}>
              {categoryName(category)}
            </ReaderLink>
          ))}
        </div>
      </div>
      <div className="footer-bottom">
        <span>Bringing Life in Desolation</span>
      </div>
    </footer>
  );
}
function Shell({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
function Card({ post }: { post: PostSummary }) {
  return (
    <article className="story-card">
      <ReaderLink
        className="card-image"
        href={storyUrl(post)}
        tabIndex={-1}
        aria-hidden="true"
      >
        <ReaderImage src={imageFor(post)} alt="" loading="lazy" />
        <span className="image-arrow" aria-hidden="true">
          ↗
        </span>
      </ReaderLink>
      <div className="card-meta">
        <span>{topicLabel(post)}</span>
        <span>{dateLabel(post.publishedAt)}</span>
      </div>
      <h3>
        <ReaderLink href={storyUrl(post)}>{post.title}</ReaderLink>
      </h3>
      <p>{post.excerpt}</p>
      <ReaderLink className="text-link" href={storyUrl(post)}>
        Read story <span aria-hidden="true">↗</span>
      </ReaderLink>
    </article>
  );
}
function Empty({ text = 'No stories here just yet.' }: { text?: string }) {
  return (
    <div className="empty-state">
      <span>✳</span>
      <p>{text}</p>
      <ReaderLink className="text-link" href="/journal">
        Explore all stories ↗
      </ReaderLink>
    </div>
  );
}

export function SiteHome({ posts }: { posts: PostSummary[] }) {
  const featured = posts.find((post) => post.featured) || posts[0];
  const latest = posts.filter((post) => post.id !== featured?.id).slice(0, 3);
  return (
    <Shell>
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-content">
          <div className="hero-kicker">
            <span>An independent vlog &amp; journal</span>
            <span>
              Life · Tech · News · Reviews <span aria-hidden="true">✳</span>
            </span>
          </div>
          <div className="hero-main">
            <h1>
              Bringing Life
              <br />
              <em>in Desolation.</em>
            </h1>
            <p className="hero-intro">
              Stories about everyday life, the tools we use, and what’s changing
              around us.
            </p>
            <ReaderLink
              className="button button-lime"
              href={featured ? storyUrl(featured) : '/journal'}
            >
              {featured ? 'Read the featured story' : 'Explore the journal'}{' '}
              <span aria-hidden="true">↗</span>
            </ReaderLink>
          </div>
        </div>
      </section>
      <section className="intro-band">
        <span className="intro-symbol" aria-hidden="true">
          ✳
        </span>
        <p>
          A place to pause,
          <br />
          <em>look closer</em>, and follow a thread.
        </p>
        <ReaderLink
          className="circle-link"
          href="/about"
          aria-label="About the journal"
        >
          ↗
        </ReaderLink>
      </section>
      {featured && (
        <section className="featured-section section-wrap">
          <div className="section-heading">
            <div>
              <h2>
                Featured <em>story.</em>
              </h2>
            </div>
          </div>
          <article className="feature-grid">
            <ReaderLink
              className="feature-image"
              href={storyUrl(featured)}
              tabIndex={-1}
              aria-hidden="true"
            >
              <ReaderImage src={imageFor(featured)} alt="" />
            </ReaderLink>
            <div className="feature-copy">
              <div className="card-meta">
                <span>{topicLabel(featured)}</span>
                <span>{dateLabel(featured.publishedAt)}</span>
              </div>
              <h3>
                <ReaderLink href={storyUrl(featured)}>
                  {featured.title}
                </ReaderLink>
              </h3>
              <p>{featured.excerpt}</p>
              <ReaderLink className="text-link" href={storyUrl(featured)}>
                Read the story <span aria-hidden="true">↗</span>
              </ReaderLink>
              <span className="feature-mark" aria-hidden="true">
                ✳
              </span>
            </div>
          </article>
        </section>
      )}
      <section className="latest-section section-wrap">
        <div className="section-heading">
          <div>
            <h2>
              Recent <em>stories.</em>
            </h2>
          </div>
          <ReaderLink className="outlined-link" href="/journal">
            View all stories <span aria-hidden="true">↗</span>
          </ReaderLink>
        </div>
        {latest.length ? (
          <div className="card-grid">
            {latest.map((post) => (
              <Card key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <Empty />
        )}
      </section>
      <section className="topics-section">
        <div className="section-wrap">
          <div className="section-heading">
            <div>
              <h2>
                Explore by <em>topic.</em>
              </h2>
            </div>
          </div>
          <div className="topic-list">
            {categories.map((category) => (
              <ReaderLink href={`/journal?category=${category}`} key={category}>
                <span>{categoryName(category)}</span>
                <span aria-hidden="true">↗</span>
              </ReaderLink>
            ))}
          </div>
        </div>
      </section>
    </Shell>
  );
}

export function Journal({
  posts,
  category,
  q,
  currentPage = 1,
  hasNext = false,
}: {
  posts: PostSummary[];
  category?: string | null;
  q?: string | null;
  currentPage?: number;
  hasNext?: boolean;
}) {
  const current = categories.find((item) => item === category);
  const { searchAction, searchView } = useContext(ReaderLinks);
  function archivePage(number: number) {
    const params = new URLSearchParams();
    if (current) params.set('category', current);
    if (q) params.set('q', q);
    if (number > 1) params.set('page', String(number));
    return params.size ? `/journal?${params}` : '/journal';
  }
  return (
    <Shell>
      <section className="page-head section-wrap">
        <p className="eyebrow">Ideas, observations &amp; stories</p>
        <div className="page-title-row">
          <h1>
            The <em>journal.</em>
          </h1>
          <p>
            A place to pause, look closer, and follow whatever sparks your
            curiosity.
          </p>
        </div>
        <div className="journal-controls">
          <nav className="filter-nav" aria-label="Filter stories by topic">
            <ReaderLink
              className={!current ? 'active' : ''}
              aria-current={!current ? 'page' : undefined}
              href="/journal"
            >
              All stories
            </ReaderLink>
            {categories.map((item) => (
              <ReaderLink
                key={item}
                className={current === item ? 'active' : ''}
                aria-current={current === item ? 'page' : undefined}
                href={`/journal?category=${item}`}
              >
                {categoryName(item)}
              </ReaderLink>
            ))}
          </nav>
          <form
            className="search-form"
            action={searchAction}
            method="get"
            role="search"
          >
            {searchView && (
              <input type="hidden" name="view" value={searchView} />
            )}
            {current && <input type="hidden" name="category" value={current} />}
            <label className="sr-only" htmlFor="journal-search">
              Search stories
            </label>
            <input
              id="journal-search"
              name="q"
              type="search"
              placeholder="Search stories"
              maxLength={200}
              defaultValue={q || ''}
            />
            <button type="submit" aria-label="Search">
              ↗
            </button>
          </form>
        </div>
      </section>
      <section className="journal-results section-wrap">
        <div className="results-line">
          <span>
            {current ? categoryName(current) : 'All stories'}
            {q ? ` / “${q}”` : ''}
          </span>
          <span>
            {posts.length} {posts.length === 1 ? 'STORY' : 'STORIES'}
          </span>
        </div>
        {posts.length ? (
          <div className="card-grid journal-grid">
            {posts.map((post) => (
              <Card key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <Empty text="No stories found. Try another search or topic." />
        )}
        {(currentPage > 1 || hasNext) && (
          <nav className="journal-pagination" aria-label="More stories">
            {currentPage > 1 && (
              <ReaderLink
                className="outlined-link"
                href={archivePage(currentPage - 1)}
              >
                ← Newer stories
              </ReaderLink>
            )}
            <span>Page {currentPage}</span>
            {hasNext && (
              <ReaderLink
                className="outlined-link"
                href={archivePage(currentPage + 1)}
              >
                Older stories →
              </ReaderLink>
            )}
          </nav>
        )}
      </section>
    </Shell>
  );
}

function Video({ url }: { url: string | null }) {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) return null;
    const host = parsed.hostname.toLowerCase().replace(/^www\./, '');
    let embed = '';
    if (
      host === 'youtube.com' ||
      host === 'm.youtube.com' ||
      host === 'youtu.be'
    ) {
      const id =
        host === 'youtu.be'
          ? parsed.pathname.split('/')[1]
          : /^\/(?:embed|shorts|live)\//.test(parsed.pathname)
            ? parsed.pathname.split('/')[2]
            : parsed.searchParams.get('v');
      if (id && /^[\w-]{11}$/.test(id))
        embed = `https://www.youtube-nocookie.com/embed/${id}`;
    } else if (host === 'vimeo.com' || host === 'player.vimeo.com') {
      const id = parsed.pathname.split('/').filter(Boolean).pop();
      if (id && /^\d+$/.test(id))
        embed = `https://player.vimeo.com/video/${id}`;
    }
    return embed ? (
      <div className="video-wrap">
        <iframe
          src={embed}
          title="Story video"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    ) : (
      <p>
        <ReaderLink
          className="text-link"
          href={parsed.href}
          target="_blank"
          rel="noopener noreferrer"
        >
          Watch the video ↗
        </ReaderLink>
      </p>
    );
  } catch {
    return null;
  }
}
export function PostStory({ post, related }: PostDetail) {
  return (
    <Shell>
      <article className="article-page">
        <div className="article-head section-wrap">
          <ReaderLink className="back-link" href="/journal">
            ← Back to the journal
          </ReaderLink>
          <div className="article-category">
            {categoryName(post.category)} <span> / </span>{' '}
            {dateLabel(post.publishedAt)}
          </div>
          <h1>{post.title}</h1>
          <p className="article-deck">{post.excerpt}</p>
        </div>
        <div className="article-cover">
          <ReaderImage src={imageFor(post)} alt="" />
        </div>
        <div className="article-body">
          <div className="article-aside">
            <span>THE JOURNAL</span>
            <span>✳</span>
          </div>
          <div className="article-prose">
            {post.body
              .split(/\n\s*\n/)
              .filter(Boolean)
              .map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            <Video url={post.videoUrl} />
            <div className="article-end">✳</div>
          </div>
        </div>
      </article>
      {related.length > 0 && (
        <section className="related-section section-wrap">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Keep exploring</p>
              <h2>
                More to <em>discover.</em>
              </h2>
            </div>
            <ReaderLink className="outlined-link" href="/journal">
              All stories ↗
            </ReaderLink>
          </div>
          <div className="card-grid">
            {related.slice(0, 3).map((item) => (
              <Card key={item.id} post={item} />
            ))}
          </div>
        </section>
      )}
    </Shell>
  );
}
export function SiteAbout() {
  return (
    <Shell>
      <section className="about-page section-wrap">
        <p className="eyebrow">A note from the journal</p>
        <h1>
          Curiosity is
          <br />
          <em>a way of life.</em>
        </h1>
        <div className="about-grid">
          <div className="about-image">
            <ReaderImage src="/covers/valley.webp" alt="A mountain landscape" />
          </div>
          <div className="about-copy">
            <span className="about-star">✳</span>
            <h2>Welcome to Bringing Life in Desolation.</h2>
            <p>
              This is an independent space for stories, ideas, and a little
              perspective. From everyday life to technology, news, and reviews,
              there’s always something worth a closer look.
            </p>
            <p>Take your time, follow a thread, and see where it leads.</p>
            <ReaderLink className="button button-dark" href="/journal">
              Explore the journal <span aria-hidden="true">↗</span>
            </ReaderLink>
          </div>
        </div>
      </section>
    </Shell>
  );
}
export function SiteNotFound() {
  return (
    <Shell>
      <section className="not-found section-wrap">
        <p className="eyebrow">404 / Off the beaten path</p>
        <h1>
          Nothing here,
          <br />
          <em>yet.</em>
        </h1>
        <p>
          The page you’re looking for couldn’t be found. There’s plenty more to
          discover in the journal.
        </p>
        <ReaderLink className="button button-dark" href="/journal">
          Explore the journal ↗
        </ReaderLink>
      </section>
    </Shell>
  );
}
