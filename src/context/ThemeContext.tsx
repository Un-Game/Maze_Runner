"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

type Theme = {
  background: string;
  maze: string;
};

type ThemeContextType = {
  theme: Theme;
  updateTheme: (newTheme: Partial<Theme>) => void;
};

const defaultTheme: Theme = {
  background: '#0000AA',
  maze: '#000000',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  const updateTheme = (newTheme: Partial<Theme>) => {
    setTheme((prev) => ({ ...prev, ...newTheme }));
  };

  return (
    <ThemeContext.Provider value={{ theme, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
