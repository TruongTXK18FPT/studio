'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function AdminRedirect() {
  const router = useRouter();

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          
          if (data.user?.role === 'admin') {
            // Redirect admin to dashboard if they're on regular pages
            const currentPath = window.location.pathname;
            if (!currentPath.startsWith('/admin') && currentPath !== '/') {
              router.push('/admin/dashboard');
            }
          }
        }
      } catch (error) {
        console.error('Admin check error:', error);
      }
    };

    checkAdminStatus();
  }, [router]);

  return null; // This component doesn't render anything
}