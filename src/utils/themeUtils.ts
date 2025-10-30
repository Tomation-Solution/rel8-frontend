// src/utils/themeUtils.ts

export const hexToRgb = (hex: string): string => {
  // Remove # if present
  const cleanHex = hex.replace('#', '');
  
  const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(cleanHex);
  if (!result) return '0 0 0';
  
  return `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}`;
};

export const darkenColor = (hex: string, percent: number = 10): string => {
  const cleanHex = hex.replace('#', '');
  const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(cleanHex);
  if (!result) return '0 0 0';
  
  const r = Math.max(0, parseInt(result[1], 16) - (255 * percent / 100));
  const g = Math.max(0, parseInt(result[2], 16) - (255 * percent / 100));
  const b = Math.max(0, parseInt(result[3], 16) - (255 * percent / 100));
  
  return `${Math.round(r)} ${Math.round(g)} ${Math.round(b)}`;
};

export const setOrganizationTheme = (primaryColor: string, secondaryColor: string) => {
  const root = document.documentElement;
  
  // Set primary colors
  root.style.setProperty('--color-org-primary', hexToRgb(primaryColor));
  root.style.setProperty('--color-org-primary-hover', darkenColor(primaryColor, 15));
  
  // Set secondary colors
  root.style.setProperty('--color-org-secondary', hexToRgb(secondaryColor));
  root.style.setProperty('--color-org-secondary-hover', darkenColor(secondaryColor, 15));
};

export const resetToDefaultTheme = () => {
  setOrganizationTheme('#015595', '#01AAFF');
};