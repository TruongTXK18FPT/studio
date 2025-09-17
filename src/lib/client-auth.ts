// Client-side authentication utilities
export async function clearAuthSession() {
  try {
    // Call logout endpoint to clear server-side cookie
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include'
    })
    
    // Clear any client-side storage (if you're storing tokens there)
    localStorage.removeItem('session')
    sessionStorage.removeItem('session')
    
    // Reload to ensure clean state
    window.location.reload()
  } catch (error) {
    console.error('Failed to clear auth session:', error)
    // Force reload even if logout fails
    window.location.reload()
  }
}

export async function checkAuthStatus() {
  try {
    const response = await fetch('/api/auth/me', {
      credentials: 'include'
    })
    
    if (response.status === 401) {
      // Session is invalid, clear everything
      await clearAuthSession()
      return null
    }
    
    const data = await response.json()
    return data.user
  } catch (error) {
    console.error('Failed to check auth status:', error)
    return null
  }
}