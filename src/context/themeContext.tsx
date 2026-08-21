import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { setOrganizationTheme, resetToDefaultTheme, DEFAULT_PRIMARY, DEFAULT_SECONDARY } from '../utils/themeUtils';

interface OrganizationTheme {
  primaryColor: string;
  secondaryColor: string;
}

interface ThemeContextType {
  setTheme: (primaryColor: string, secondaryColor: string) => void;
  currentTheme: OrganizationTheme | null;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * Applies the tenant's brand colours to the CSS variables everything else reads.
 *
 * **The theme is not cached.** It used to be mirrored into `localStorage.orgTheme` and
 * re-applied on mount, which bought nothing — `TenantProvider` re-fetches the organization
 * on every load anyway — while creating a value that outlives the thing it describes. A
 * colour written by one tenant survived into the next, and a colour written before the
 * redesign survived the redesign. Both showed up as "the app is the wrong colour and I
 * cannot find where from".
 *
 * The starting point is the house theme, so the first paint is right even before the
 * organization request resolves.
 */
export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = React.useState<OrganizationTheme | null>(null);

  const setTheme = (primaryColor: string, secondaryColor: string) => {
    setOrganizationTheme(primaryColor, secondaryColor);
    setCurrentTheme({ primaryColor, secondaryColor });
  };

  useEffect(() => {
    // Clear the cache this provider used to write, so an old blue does not linger in
    // anyone's browser after this ships.
    try {
      localStorage.removeItem('orgTheme');
    } catch {
      /* storage unavailable — nothing to clear */
    }

    resetToDefaultTheme();
    setCurrentTheme({ primaryColor: DEFAULT_PRIMARY, secondaryColor: DEFAULT_SECONDARY });
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
