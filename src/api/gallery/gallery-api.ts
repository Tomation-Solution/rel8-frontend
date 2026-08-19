import apiTenant from "../baseApi";

/**
 * Fetch a page of gallery items.
 *
 * BE-19: the `not_chapters=True` parameter is gone — it filtered on a `chapter` field
 * the Gallery model never had, so it matched everything. The endpoint now also applies
 * the same audience scoping as the rest of the content API.
 *
 * The response gained pagination metadata; this unwraps it so callers keep receiving a
 * plain array (all four call sites treat it as one). Use `fetchGalleryPage` when you
 * need the page info.
 */
export const fetchAllGalleryData = async (page: number) => {
  const { gallery } = await fetchGalleryPage(page);
  return gallery;
};

export interface GalleryPage {
  gallery: any[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

export const fetchGalleryPage = async (page: number): Promise<GalleryPage> => {
  const response = await apiTenant.get(`/api/content/gallery_version2/?page=${page}`);
  const data = response.data;
  // Tolerate the pre-change array shape so a stale backend does not break the page.
  if (Array.isArray(data)) {
    return { gallery: data, page, limit: data.length, total: data.length, hasMore: false };
  }
  return {
    gallery: Array.isArray(data?.gallery) ? data.gallery : [],
    page: data?.page ?? page,
    limit: data?.limit ?? 10,
    total: data?.total ?? 0,
    hasMore: Boolean(data?.hasMore),
  };
};

// Fetch gallery data by id
export const fetchGalleryItem = async (id: string | null) => {
  if (id) {
    const response = await apiTenant.get(`/api/content/gallery/${id}/`);
    return response.data;
  }
};
