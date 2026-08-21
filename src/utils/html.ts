import DOMPurify, { type Config } from "dompurify";

/**
 * News and publication bodies are **rich HTML** written in the admin's editor — headings,
 * lists, bold, links, `&nbsp;` entities, the lot.
 *
 * Two things were wrong before this:
 *
 * 1. Detail pages rendered the body as a text node, so members read the raw markup:
 *    `<p><strong>News&nbsp;Details:</strong></p>...`
 * 2. Cards ran it through `unformatText()`, a bare `replace(/<[^>]*>/g, "")`, which strips
 *    tags but leaves entities — so excerpts came out as
 *    `The&nbsp;Federal&nbsp;Government&nbsp;has...`
 *
 * Rendering it means `dangerouslySetInnerHTML`, which means sanitising. The content is
 * authored by the association's own admins rather than the public, but it is still HTML
 * from a database: without this, a compromised admin account or a stored-XSS in the editor
 * becomes script execution in every member's browser.
 */

/**
 * Conservative allowlist — everything a WYSIWYG editor emits, nothing that executes.
 *
 * No `script`, `style`, `iframe`, `form` or `input`; no event handlers (DOMPurify strips
 * `on*` regardless). `target`/`rel` are permitted so the hook below can harden links.
 */
const CONFIG: Config = {
  ALLOWED_TAGS: [
    "p", "br", "hr", "span", "div",
    "strong", "b", "em", "i", "u", "s", "sub", "sup", "mark", "small",
    "h1", "h2", "h3", "h4", "h5", "h6",
    "ul", "ol", "li",
    "blockquote", "pre", "code",
    "a", "img",
    "table", "thead", "tbody", "tfoot", "tr", "th", "td",
  ],
  ALLOWED_ATTR: ["href", "title", "alt", "src", "target", "rel", "colspan", "rowspan"],
  // `javascript:` and friends never survive; data: images are allowed because editors inline them.
  ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|tel):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i,
};

let hookInstalled = false;

/**
 * Any link that survives opens in a new tab with `noopener`, so a linked page cannot reach
 * back into the portal through `window.opener`.
 */
const installHook = () => {
  if (hookInstalled || typeof window === "undefined") return;
  DOMPurify.addHook("afterSanitizeAttributes", node => {
    if (node.tagName === "A" && node.getAttribute("href")) {
      node.setAttribute("target", "_blank");
      node.setAttribute("rel", "noopener noreferrer nofollow");
    }
  });
  hookInstalled = true;
};

/** Sanitised HTML, ready for `dangerouslySetInnerHTML`. */
export const sanitizeHtml = (html?: string | null): string => {
  if (!html) return "";
  installHook();
  return DOMPurify.sanitize(String(html), CONFIG);
};

/**
 * Plain text for card excerpts, search and `line-clamp`.
 *
 * Parses rather than regexes: `replace(/<[^>]*>/g, "")` leaves `&nbsp;`, `&quot;` and
 * `&#39;` behind, which is exactly how excerpts ended up full of `&nbsp;`. Letting the
 * browser parse the fragment decodes entities correctly and cannot be fooled by a `>`
 * inside an attribute.
 *
 * Uses `DOMParser`, so nothing is loaded or executed — no `innerHTML` on a live node.
 */
export const htmlToText = (html?: string | null): string => {
  if (!html) return "";
  const raw = String(html);

  if (typeof window === "undefined" || typeof window.DOMParser === "undefined") {
    // Non-browser fallback: strip tags, then the entities that actually show up.
    return raw
      .replace(/<[^>]*>/g, " ")
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/&quot;/gi, '"')
      .replace(/&#39;/g, "'")
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">")
      .replace(/\s+/g, " ")
      .trim();
  }

  const doc = new DOMParser().parseFromString(raw, "text/html");
  // Block-level tags should read as breaks, not run words together.
  doc.querySelectorAll("p, div, br, li, h1, h2, h3, h4, h5, h6, tr").forEach(node => node.after(" "));
  return (doc.body.textContent || "").replace(/\s+/g, " ").trim();
};
