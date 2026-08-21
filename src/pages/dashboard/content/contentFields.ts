/**
 * Field accessors for News, Publication and Gallery.
 *
 * Checked against the backend models, because none of the three call their fields what the
 * portal has historically called them:
 *
 *   News        topic, content, bannerUrl, attachmentUrls[], comments[], likes[], dislikes[]
 *   Publication title, content, bannerUrl, attachmentUrls[], comments[], likes[]
 *   Gallery     images[{url, caption}], imageUrl[] (legacy), caption
 *
 * So a news item has **no `name` and no `body`** — it is `topic` and `content` — and a
 * publication's title is `title`, not `name`. The fallbacks below keep older records
 * rendering, but the first key in each chain is the schema's.
 *
 * `likes` and `dislikes` are **arrays of member ids**, not counts. The count is the array
 * length, and "have I liked this" is membership of the array — the page this replaced read
 * `localStorage.getItem("userId")`, a key nothing ever writes, so its like state was always
 * false.
 *
 * Comments are a **flat** subdocument array — `{ _id, userId, content, createdAt }`, with
 * `userId` populated as `{ name, email, imageUrl }`. There is no `parentId`, so replies do
 * not exist, and no per-comment likes. See REDESIGN.md §5.
 */

export const newsTitle = (item: any): string => item?.topic || item?.name || item?.title || "Untitled";
export const newsBody = (item: any): string => item?.content || item?.body || "";

export const publicationTitle = (item: any): string => item?.title || item?.name || "Untitled";
export const publicationBody = (item: any): string => item?.content || item?.body || "";

/** Both models store the banner the same way. */
export const contentBanner = (item: any): string | undefined => item?.bannerUrl || undefined;

export const commentCount = (item: any): number => (Array.isArray(item?.comments) ? item.comments.length : 0);
export const likeCount = (item: any): number => (Array.isArray(item?.likes) ? item.likes.length : 0);
export const dislikeCount = (item: any): number => (Array.isArray(item?.dislikes) ? item.dislikes.length : 0);

/**
 * `likes` may be raw ids, or populated objects — `getPublicationById` populates them as
 * `{ name, email }`. Handle both.
 */
export const hasLiked = (item: any, memberId?: string | null): boolean => {
  if (!memberId || !Array.isArray(item?.likes)) return false;
  return item.likes.some((entry: any) => String(entry?._id ?? entry) === String(memberId));
};

export const hasDisliked = (item: any, memberId?: string | null): boolean => {
  if (!memberId || !Array.isArray(item?.dislikes)) return false;
  return item.dislikes.some((entry: any) => String(entry?._id ?? entry) === String(memberId));
};

/** The author line. Neither model stores one, so this is whatever the API attaches. */
export const contentAuthor = (item: any): string => item?.author?.name || item?.authorName || item?.createdBy?.name || "Admin";

export interface GalleryImage {
  url: string;
  caption?: string;
}

/**
 * Gallery items hold `images: [{url, caption}]`; `imageUrl: [String]` is the pre-change
 * shape the controller still normalises alongside it. Read both.
 */
export const galleryImages = (item: any): GalleryImage[] => {
  if (Array.isArray(item?.images) && item.images.length > 0) {
    return item.images.filter((image: any) => image?.url).map((image: any) => ({ url: image.url, caption: image.caption || item?.caption || "" }));
  }
  if (Array.isArray(item?.imageUrl)) {
    return item.imageUrl.filter(Boolean).map((url: string) => ({ url, caption: item?.caption || "" }));
  }
  return [];
};
