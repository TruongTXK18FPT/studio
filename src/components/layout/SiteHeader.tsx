'use client';

import Link from 'next/link';
import { NavLink } from './NavLink';
import { Button } from '@/components/ui/button';

const navLinks = [
  { href: '/', label: 'Dòng thời gian' },
  { href: '/gallery', label: 'Thư viện' },
  { href: '/letters', label: 'Thư & Văn bản' },
  { href: '/community', label: 'Cộng đồng' },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="flex items-center space-x-4">
          <div className="flex flex-col">
            <span className="font-bold font-headline text-lg text-primary">
              Hành Trình Bác Hồ
            </span>
            <span className="text-xs text-muted-foreground hidden sm:block">
              Kho tư liệu – Dòng thời gian – Thư & Văn bản gốc
            </span>
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
           <Button asChild>
              <Link href="/community/submit">Đóng góp</Link>
           </Button>
           {/* Mobile menu trigger can be added here */}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-full bg-trongdong-pattern opacity-[0.03] pointer-events-none -z-10"></div>
    </header>
  );
}
