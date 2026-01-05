import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type EnvironmentType = 'members' | 'excos' | 'committee';

interface EnvironmentContextType {
  selectedEnvironments: EnvironmentType[];
  toggleEnvironment: (environment: EnvironmentType) => void;
  isEnvironmentActive: (environment: EnvironmentType) => boolean;
  clearAllEnvironments: () => void;
}

const EnvironmentContext = createContext<EnvironmentContextType | undefined>(undefined);

export const useEnvironmentContext = () => {
  const context = useContext(EnvironmentContext);
  if (context === undefined) {
    throw new Error('useEnvironmentContext must be used within an EnvironmentProvider');
  }
  return context;
};

interface EnvironmentProviderProps {
  children: ReactNode;
}

export const EnvironmentProvider: React.FC<EnvironmentProviderProps> = ({ children }) => {
  // Default to members environment
  const [selectedEnvironments, setSelectedEnvironments] = useState<EnvironmentType[]>(['members']);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('selectedEnvironments');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Ensure at least one environment is selected
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSelectedEnvironments(parsed);
        }
      } catch (error) {
        console.error('Error parsing stored environments:', error);
      }
    }
  }, []);

  // Save to localStorage whenever selectedEnvironments changes
  useEffect(() => {
    localStorage.setItem('selectedEnvironments', JSON.stringify(selectedEnvironments));
  }, [selectedEnvironments]);

  const toggleEnvironment = (environment: EnvironmentType) => {
    setSelectedEnvironments((prev) => {
      const isActive = prev.includes(environment);
      
      if (isActive) {
        // If trying to deactivate the last environment, prevent it
        if (prev.length === 1) {
          return prev; // Keep at least one environment active
        }
        // Remove the environment
        return prev.filter((env) => env !== environment);
      } else {
        // Add the environment
        return [...prev, environment];
      }
    });
  };

  const isEnvironmentActive = (environment: EnvironmentType): boolean => {
    return selectedEnvironments.includes(environment);
  };

  const clearAllEnvironments = () => {
    setSelectedEnvironments(['members']); // Reset to default
  };

  return (
    <EnvironmentContext.Provider
      value={{
        selectedEnvironments,
        toggleEnvironment,
        isEnvironmentActive,
        clearAllEnvironments,
      }}
    >
      {children}
    </EnvironmentContext.Provider>
  );
};

