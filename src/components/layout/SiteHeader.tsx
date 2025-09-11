'use client';

import Link from 'next/link';
import { NavLink } from './NavLink';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

const navLinks = [
  { href: '/timeline', label: 'Dòng thời gian' },
  { href: '/gallery', label: 'Thư viện' },
  { href: '/letters', label: 'Thư & Văn bản' },
  { href: '/community', label: 'Cộng đồng' },
];

interface User {
  email: string;
  name?: string;
}

export function SiteHeader() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <image href="/patterns/logo-hcm202.svg" width="100" height="100" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-bold font-semibold text-lg text-primary">
                Ánh sáng lịch sử
              </span>
              <span className="text-xs text-muted-foreground hidden sm:block">
                Kho tư liệu – Dòng thời gian – Thư & Văn bản gốc
              </span>
            </div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navLinks.map((link) => (
            <NavLink key={link.href} href={link.href}>
              {link.label}
            </NavLink>
          ))}
        </nav>
        
        <div className="flex items-center gap-4">
          {!loading && (
            <>
              {user ? (
                <div className="flex items-center gap-4">
                  <Link href="/dashboard" className="text-sm text-foreground hover:text-heritage">
                    Trang cá nhân
                  </Link>
                  <span className="text-sm text-muted-foreground">
                    {user.email}
                  </span>
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    Đăng xuất
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/login">Đăng nhập</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/register">Đăng ký</Link>
                  </Button>
                </div>
              )}
            </>
          )}
          <Button asChild>
            <Link href="/community/submit">Đóng góp</Link>
          </Button>
          <Button variant="outline" size="sm" asChild className="border-red-200 text-red-700 hover:bg-red-50">
            <Link href="/admin/login">Admin</Link>
          </Button>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-full bg-trongdong-pattern opacity-[0.03] pointer-events-none -z-10"></div>
    </header>
  );
}
