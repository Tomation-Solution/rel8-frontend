import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { setOrganizationTheme } from '../utils/themeUtils';

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
    // Load saved theme on mount
    const savedTheme = localStorage.getItem('orgTheme');
    if (savedTheme) {
      const { primaryColor, secondaryColor } = JSON.parse(savedTheme);
      setOrganizationTheme(primaryColor, secondaryColor);
      setCurrentTheme({ primaryColor, secondaryColor });
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