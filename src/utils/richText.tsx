import { sanitizeHtml } from "./html";

/**
 * Renders sanitised rich text with the styling Tailwind's preflight strips.
 *
 * Preflight zeroes heading sizes, list markers and margins, so editor content renders as an
 * undifferentiated wall without this. Written as explicit `[&_tag]` rules rather than a
 * `@tailwindcss/typography` dependency, since this is the only place that needs them.
 */
export const RichText = ({ html, className = "" }: { html?: string | null; className?: string }) => {
  const clean = sanitizeHtml(html);
  if (!clean) return null;

  return (
    <div
      className={
        "text-[15px] text-ink leading-relaxed " +
        "[&_p]:mb-4 [&_p:last-child]:mb-0 " +
        "[&_h1]:text-[26px] [&_h1]:font-semibold [&_h1]:text-ink [&_h1]:mt-6 [&_h1]:mb-3 " +
        "[&_h2]:text-[22px] [&_h2]:font-semibold [&_h2]:text-ink [&_h2]:mt-6 [&_h2]:mb-3 " +
        "[&_h3]:text-[18px] [&_h3]:font-semibold [&_h3]:text-ink [&_h3]:mt-5 [&_h3]:mb-2 " +
        "[&_h4]:text-[16px] [&_h4]:font-semibold [&_h4]:text-ink [&_h4]:mt-4 [&_h4]:mb-2 " +
        "[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_li]:mb-1 " +
        "[&_strong]:font-semibold [&_b]:font-semibold [&_em]:italic " +
        "[&_a]:text-org-primary [&_a]:underline " +
        "[&_blockquote]:border-l-4 [&_blockquote]:border-org-tint-strong [&_blockquote]:pl-4 [&_blockquote]:text-muted [&_blockquote]:my-4 " +
        "[&_img]:max-w-full [&_img]:rounded-lg [&_img]:my-4 " +
        "[&_code]:bg-org-tint [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm " +
        "[&_pre]:bg-org-tint/60 [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:my-4 " +
        "[&_hr]:my-6 [&_hr]:border-hairline " +
        "[&_table]:w-full [&_table]:my-4 [&_th]:text-left [&_th]:font-medium [&_th]:border-b [&_th]:border-hairline [&_th]:py-2 [&_td]:py-2 [&_td]:border-b [&_td]:border-hairline " +
        className
      }
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
};

export default RichText;
