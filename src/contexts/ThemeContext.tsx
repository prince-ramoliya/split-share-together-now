
import * as React from 'react';
const { createContext, useContext, useEffect, useState } = React;

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  console.log('ThemeProvider: Starting, React available:', !!React);
  console.log('ThemeProvider: useState available:', !!useState);
  
  const [theme, setTheme] = useState<Theme>(() => {
    console.log('ThemeProvider: Inside useState initializer');
    const savedTheme = localStorage.getItem('expense-splitter-theme') as Theme;
    return savedTheme || 'light';
  });

  useEffect(() => {
    localStorage.setItem('expense-splitter-theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
