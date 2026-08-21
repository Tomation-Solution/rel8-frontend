import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { setOrganizationTheme, resetToDefaultTheme } from '../utils/themeUtils';

interface OrganizationTheme {
  primaryColor: string;
  secondaryColor: string;
}

interface ThemeContextType {
  setTheme: (primaryColor: string, secondaryColor: string) => void;
  currentTheme: OrganizationTheme | null;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = React.useState<OrganizationTheme | null>(null);

  const setTheme = (primaryColor: string, secondaryColor: string) => {
    setOrganizationTheme(primaryColor, secondaryColor);
    
    const theme = { primaryColor, secondaryColor };
    setCurrentTheme(theme);
    
    // Save to localStorage for persistence
    localStorage.setItem('orgTheme', JSON.stringify(theme));
  };

  useEffect(() => {
    /*
     * Restore the tenant's theme, but never leave the app on a half-set palette.
     *
     * This used to do nothing at all when `orgTheme` was absent or unparseable, so the
     * CSS `:root` fallback was the only thing painting — and a stale value written by an
     * earlier tenant survived forever, which is one way the app ends up looking like a
     * brand it no longer serves. Anything missing or malformed now resets to the house
     * theme explicitly.
     */
    const savedTheme = localStorage.getItem('orgTheme');
    if (!savedTheme) {
      resetToDefaultTheme();
      return;
    }
    try {
      const { primaryColor, secondaryColor } = JSON.parse(savedTheme);
      if (!primaryColor || !secondaryColor) throw new Error('incomplete theme');
      setOrganizationTheme(primaryColor, secondaryColor);
      setCurrentTheme({ primaryColor, secondaryColor });
    } catch {
      localStorage.removeItem('orgTheme');
      resetToDefaultTheme();
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ setTheme, currentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};