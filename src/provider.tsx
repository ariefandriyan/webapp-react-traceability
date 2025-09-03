import type { NavigateOptions } from "react-router-dom";
import React, { createContext, useContext, useEffect, useState } from "react";

import { HeroUIProvider } from "@heroui/system";
import { useHref, useNavigate } from "react-router-dom";

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NavigateOptions;
  }
}

// Create our own theme context
const ThemeContext = createContext<{
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  syncTheme: () => void;
} | null>(null);

// Export the hook separately to avoid Fast Refresh issues
const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<'light' | 'dark'>('light');
  const [isInitialized, setIsInitialized] = useState(false);

  const applyTheme = (newTheme: 'light' | 'dark') => {
    const root = document.documentElement;
    const body = document.body;
    
    console.log(`[ThemeProvider] Before applying theme - Root classes:`, root.classList.toString());
    
    // Remove both classes first
    root.classList.remove('light', 'dark');
    
    // Add the new theme class

    root.classList.add(newTheme);
    
    // Also set data attribute for HeroUI compatibility
    root.setAttribute('data-theme', newTheme);
    
    // Force body styles for immediate visual feedback
    if (newTheme === 'light') {
      body.style.backgroundColor = '#ffffff';
      body.style.color = '#000000';
      root.style.colorScheme = 'light';
    } else {
      body.style.backgroundColor = '#111827';
      body.style.color = '#f9fafb';
      root.style.colorScheme = 'dark';
    }
    
    // Save to localStorage
    localStorage.setItem('theme', newTheme);
    
    console.log(`[ThemeProvider] After applying theme ${newTheme} - Root classes:`, root.classList.toString());
    console.log(`[ThemeProvider] localStorage theme:`, localStorage.getItem('theme'));
    console.log(`[ThemeProvider] data-theme attribute:`, root.getAttribute('data-theme'));
    console.log(`[ThemeProvider] Body background:`, body.style.backgroundColor);
  };

  const setTheme = (newTheme: 'light' | 'dark') => {
    console.log(`[ThemeProvider] setTheme called with: ${newTheme}`);
    console.log(`[ThemeProvider] Current theme state: ${theme}`);
    setThemeState(newTheme);
    // Don't call applyTheme here - let the useEffect handle it
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    console.log(`[ThemeProvider] toggleTheme called - Current: ${theme}, New: ${newTheme}`);
    setTheme(newTheme);
  };

  const syncTheme = () => {
    console.log('[ThemeProvider] syncTheme called - forcing synchronization');
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const rootClasses = document.documentElement.classList.toString();
    
    console.log('[ThemeProvider] Current state:', {
      reactState: theme,
      localStorage: savedTheme,
      rootClasses,
      domHasDark: rootClasses.includes('dark'),
      domHasLight: rootClasses.includes('light')
    });
    
    if (savedTheme && savedTheme !== theme) {
      console.log(`[ThemeProvider] Syncing state from localStorage: ${savedTheme}`);
      setThemeState(savedTheme);
      applyTheme(savedTheme);
    }
  };

  useEffect(() => {
    if (!isInitialized) {
      console.log("[ThemeProvider] Initializing...");
      
      // Get initial theme - prioritize localStorage
      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
      
      // Also check what's currently applied to DOM
      const currentRootClasses = document.documentElement.classList.toString();
      const domHasDark = currentRootClasses.includes('dark');
      const domHasLight = currentRootClasses.includes('light');
      
      console.log('[ThemeProvider] Initial theme determination:', {
        savedTheme,
        systemPrefersDark,
        initialTheme,
        currentRootClasses,
        domHasDark,
        domHasLight
      });
      
      // If DOM already has a theme applied that differs from our calculation, use DOM state
      let finalTheme = initialTheme;
      if (savedTheme && ((savedTheme === 'dark' && domHasDark) || (savedTheme === 'light' && domHasLight))) {
        finalTheme = savedTheme;
        console.log('[ThemeProvider] Using saved theme that matches DOM:', finalTheme);
      } else if (savedTheme) {
        console.log('[ThemeProvider] Saved theme differs from DOM, applying saved theme:', savedTheme);
        finalTheme = savedTheme;
      }
      
      setThemeState(finalTheme);
      applyTheme(finalTheme);
      setIsInitialized(true);
      
      console.log('[ThemeProvider] Initialization complete with theme:', finalTheme);
    }
  }, [isInitialized]);

  // Add effect to sync theme state with DOM changes
  useEffect(() => {
    if (isInitialized) {
      console.log(`[ThemeProvider] Theme state changed to: ${theme}`);
      applyTheme(theme);
    }
  }, [theme, isInitialized]);
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, syncTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export function Provider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  return (
    <ThemeProvider>
      <HeroUIProvider navigate={navigate} useHref={useHref}>
        {children}
      </HeroUIProvider>
    </ThemeProvider>
  );
}

// Export the hook separately to avoid Fast Refresh issues
export { useTheme };
