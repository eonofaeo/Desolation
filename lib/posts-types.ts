export type Category = 'life' | 'tech' | 'news' | 'reviews';

export type PostStatus = 'draft' | 'published';

export interface Post {
  id: string;
  slug: string;
  title: string;
  category: Category;
  excerpt: string;
  body: string;
  coverUrl: string | null;
  videoUrl: string | null;
  featured: boolean;
  status: PostStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export type PostSummary = Pick<
  Post,
  | 'id'
  | 'slug'
  | 'title'
  | 'category'
  | 'excerpt'
  | 'coverUrl'
  | 'featured'
  | 'publishedAt'
>;

export interface PostArchive {
  posts: PostSummary[];
  category?: Category;
  q: string;
  currentPage: number;
  hasNext: boolean;
}

export interface PostDetail {
  post: PostSummary & Pick<Post, 'body' | 'videoUrl'>;
  related: PostSummary[];
}

/** Fields accepted from an editor when creating a post. A slug may be omitted. */
export interface PostInput {
  slug?: string;
  title: string;
  category: Category;
  excerpt: string;
  body: string;
  coverUrl?: string | null;
  videoUrl?: string | null;
  featured?: boolean;
  status?: PostStatus;
}
