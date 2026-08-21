// The portal recolours itself per tenant. Everything the redesign paints purple actually
// reads one of these four CSS variables, so a tenant with a green brand comes out green.
// See REDESIGN.md §1.

/** Rel8 house purple — the default when a tenant has set no brand colour. */
export const DEFAULT_PRIMARY = '#7F02A2';
export const DEFAULT_SECONDARY = '#B44FD0';

/**
 * The container/tint colour for the house purple: #F8E6FB.
 *
 * `tintColor()` derives this from the brand hue for any tenant, but for the default purple
 * we use the exact value from the mockups rather than a value that rounds to within one or
 * two steps of it.
 */
export const DEFAULT_TINT = '#F8E6FB';

export const hexToRgb = (hex: string): string => {
  const [r, g, b] = parseHex(hex);
  return `${r} ${g} ${b}`;
};

export const darkenColor = (hex: string, percent: number = 10): string => {
  const [r, g, b] = parseHex(hex);
  const shift = (255 * percent) / 100;
  return `${clamp(r - shift)} ${clamp(g - shift)} ${clamp(b - shift)}`;
};

/**
 * The lavender wash (`org-tint`). Not a white blend — a white blend desaturates the hue
 * and turns grey-ish. We keep the brand hue, cap the saturation and push the lightness up,
 * which is what the mockups actually do: #7F02A2 (289°, 97%, 32%) → #F8E6FB (289°, 76%, 94%).
 */
export const tintColor = (hex: string, lightness: number): string => {
  const [h, s] = rgbToHsl(...parseHex(hex));
  const [r, g, b] = hslToRgb(h, Math.min(s, 0.8), lightness);
  return `${r} ${g} ${b}`;
};

export const setOrganizationTheme = (primaryColor: string, secondaryColor: string) => {
  const root = document.documentElement;

  root.style.setProperty('--color-org-primary', hexToRgb(primaryColor));
  root.style.setProperty('--color-org-primary-hover', darkenColor(primaryColor, 8));

  root.style.setProperty('--color-org-secondary', hexToRgb(secondaryColor));
  root.style.setProperty('--color-org-secondary-hover', darkenColor(secondaryColor, 8));

  // The house purple's tint is pinned to the exact mockup value; every other brand derives
  // its own from the hue.
  const isDefault = primaryColor.toLowerCase() === DEFAULT_PRIMARY.toLowerCase();
  root.style.setProperty('--color-org-tint', isDefault ? hexToRgb(DEFAULT_TINT) : tintColor(primaryColor, 0.94));
  root.style.setProperty('--color-org-tint-strong', tintColor(primaryColor, 0.87));
};

export const resetToDefaultTheme = () => {
  setOrganizationTheme(DEFAULT_PRIMARY, DEFAULT_SECONDARY);
};

// ── colour maths ────────────────────────────────────────────────────────────

const clamp = (n: number) => Math.round(Math.min(255, Math.max(0, n)));

function parseHex(hex: string): [number, number, number] {
  let clean = hex.replace('#', '').trim();
  if (clean.length === 3) clean = clean.split('').map(c => c + c).join('');
  const match = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(clean);
  if (!match) return [0, 0, 0];
  return [parseInt(match[1], 16), parseInt(match[2], 16), parseInt(match[3], 16)];
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h: number;
  if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
  else if (max === gn) h = ((bn - rn) / d + 2) / 6;
  else h = ((rn - gn) / d + 4) / 6;
  return [h, s, l];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  if (s === 0) {
    const v = clamp(l * 255);
    return [v, v, v];
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return [clamp(hueToChannel(p, q, h + 1 / 3) * 255), clamp(hueToChannel(p, q, h) * 255), clamp(hueToChannel(p, q, h - 1 / 3) * 255)];
}

function hueToChannel(p: number, q: number, t: number): number {
  let tt = t;
  if (tt < 0) tt += 1;
  if (tt > 1) tt -= 1;
  if (tt < 1 / 6) return p + (q - p) * 6 * tt;
  if (tt < 1 / 2) return q;
  if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
  return p;
}
