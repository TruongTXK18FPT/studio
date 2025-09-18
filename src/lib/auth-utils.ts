/**
 * Utility functions for authentication and header refresh
 */

/**
 * Triggers header authentication refresh after successful login
 * This function should be called after any successful authentication action
 */
export const triggerHeaderAuthRefresh = () => {
  if (typeof window === 'undefined') return;

  // Method 1: Dispatch custom event for components that listen to it
  window.dispatchEvent(new CustomEvent('login-success'));
  
  // Method 2: Call global refresh function if available (from SiteHeader)
  if ((window as any).refreshHeaderAuth) {
    (window as any).refreshHeaderAuth();
  }
};

/**
 * Triggers header logout refresh after successful logout
 * This function should be called after any successful logout action
 */
export const triggerHeaderLogoutRefresh = () => {
  if (typeof window === 'undefined') return;

  // Dispatch custom logout event
  window.dispatchEvent(new CustomEvent('logout-success'));
  
  // Call global refresh function if available
  if ((window as any).refreshHeaderAuth) {
    (window as any).refreshHeaderAuth();
  }
};

/**
 * Check if user is authenticated by calling the auth API
 * Returns user data if authenticated, null otherwise
 */
export const checkAuthStatus = async () => {
  try {
    const response = await fetch('/api/auth/me', {
      credentials: 'include'
    });
    
    if (response.ok) {
      const userData = await response.json();
      return userData.user;
    }
    
    return null;
  } catch (error) {
    console.error('Auth check failed:', error);
    return null;
  }
};

/**
 * Type definitions for authentication
 */
export interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

/**
 * Global type declarations for window object
 */
declare global {
  interface Window {
    refreshHeaderAuth?: () => Promise<User | null>;
  }
}
