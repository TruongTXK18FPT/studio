'use client';

import Link from 'next/link';
import { NavLink } from './NavLink';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import { Search, Menu, X, Heart, User, Settings, LogOut, Shield, BookOpen, MessageSquare, Clock, Globe } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const navLinks = [
  { href: '/timeline', label: 'Dòng thời gian', icon: Clock, description: 'Hành trình cuộc đời Bác' },
  { href: '/gallery', label: 'Thư viện', icon: BookOpen, description: 'Hình ảnh & tư liệu quý' },
  { href: '/letters', label: 'Thư & Văn bản', icon: MessageSquare, description: 'Di sản văn học' },
  { href: '/community', label: 'Cộng đồng', icon: Globe, description: 'Chia sẻ & thảo luận' },
  { href: '/quiz', label: 'Quiz lịch sử', icon: Shield, description: 'Kiểm tra kiến thức' },
];

interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

export function SiteHeader() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'include'
        });
        if (response.ok) {
          const userData = await response.json();
          setUser(userData.user); // Updated to match the new API response format
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Main Header */}
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-4 hover:opacity-80 transition-opacity">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <image href="/patterns/logo-hcm202.svg" width="100" height="100" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-primary bg-gradient-to-r from-red-800 to-red-900 bg-clip-text text-transparent">
                HCM202
              </span>
              <span className="text-xs text-muted-foreground hidden sm:block">
                Ánh sáng lịch sử Việt Nam
              </span>
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <div key={link.href} className="group relative">
                <NavLink 
                  href={link.href}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-red-50 hover:text-red-800 transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </NavLink>
                
                {/* Tooltip */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                  {link.description}
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                </div>
              </div>
            );
          })}
        </nav>

        {/* Search Bar */}
        <div className="hidden md:flex items-center space-x-4 flex-1 max-w-md mx-6">
          <form onSubmit={handleSearch} className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Tìm kiếm sự kiện, văn bản..."
              className="pl-10 pr-4 py-2 border-gray-300 focus:border-red-500 focus:ring-red-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>
        
        {/* User Menu & Actions */}
        <div className="flex items-center gap-3">
          {/* Contribute Button */}
          <Button 
            asChild 
            className="hidden sm:flex bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg"
          >
            <Link href="/community/submit" className="flex items-center space-x-2">
              <Heart className="w-4 h-4" />
              <span>Đóng góp</span>
            </Link>
          </Button>

          {/* User Authentication */}
          {!loading && (
            <>
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2 hover:bg-red-50">
                      <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div className="hidden sm:flex flex-col items-start">
                        <span className="text-sm font-medium">{user.name || 'Người dùng'}</span>
                        <span className="text-xs text-gray-500">
                          {user.role === 'admin' && (
                            <Badge variant="secondary" className="text-xs bg-red-100 text-red-800">
                              <Shield className="w-3 h-3 mr-1" />
                              Admin
                            </Badge>
                          )}
                        </span>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-3 py-2">
                      <p className="text-sm font-medium">{user.name || 'Người dùng'}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        Trang cá nhân
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="flex items-center">
                        <Settings className="w-4 h-4 mr-2" />
                        Cài đặt
                      </Link>
                    </DropdownMenuItem>
                    {user.role === 'admin' && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href="/admin/dashboard" className="flex items-center text-red-600">
                            <Shield className="w-4 h-4 mr-2" />
                            Quản trị viên
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                      <LogOut className="w-4 h-4 mr-2" />
                      Đăng xuất
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" asChild className="hidden sm:flex">
                    <Link href="/login">Đăng nhập</Link>
                  </Button>
                  <Button size="sm" asChild className="hidden sm:flex">
                    <Link href="/register">Đăng ký</Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild className="border-red-200 text-red-700 hover:bg-red-50">
                    <Link href="/admin/login" className="flex items-center space-x-1">
                      <Shield className="w-4 h-4" />
                      <span className="hidden sm:inline">Admin</span>
                    </Link>
                  </Button>
                </div>
              )}
            </>
          )}

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="lg:hidden">
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col h-full">
                {/* Mobile Header */}
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 flex items-center justify-center">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <image href="/patterns/logo-hcm202.svg" width="100" height="100" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="font-bold text-lg">HCM202</h2>
                    <p className="text-sm text-gray-600">Ánh sáng lịch sử</p>
                  </div>
                </div>

                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Tìm kiếm..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </form>

                <Separator className="mb-6" />

                {/* Mobile Navigation */}
                <nav className="space-y-2 flex-1">
                  {navLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-50 transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Icon className="w-5 h-5 text-red-600" />
                        <div>
                          <span className="font-medium">{link.label}</span>
                          <p className="text-sm text-gray-600">{link.description}</p>
                        </div>
                      </Link>
                    );
                  })}
                </nav>

                <Separator className="my-6" />

                {/* Mobile User Actions */}
                <div className="space-y-3">
                  <Button asChild className="w-full bg-gradient-to-r from-red-600 to-red-700">
                    <Link href="/community/submit" onClick={() => setMobileMenuOpen(false)}>
                      <Heart className="w-4 h-4 mr-2" />
                      Đóng góp bài viết
                    </Link>
                  </Button>

                  {user ? (
                    <div className="space-y-2">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="font-medium">{user.name || 'Người dùng'}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        {user.role === 'ADMIN' && (
                          <Badge className="mt-2 bg-red-100 text-red-800">
                            <Shield className="w-3 h-3 mr-1" />
                            Admin
                          </Badge>
                        )}
                      </div>
                      <Button variant="outline" asChild className="w-full">
                        <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                          <User className="w-4 h-4 mr-2" />
                          Trang cá nhân
                        </Link>
                      </Button>
                      {user.role === 'ADMIN' && (
                        <Button variant="outline" asChild className="w-full border-red-200 text-red-700">
                          <Link href="/admin/dashboard" onClick={() => setMobileMenuOpen(false)}>
                            <Shield className="w-4 h-4 mr-2" />
                            Quản trị viên
                          </Link>
                        </Button>
                      )}
                      <Button variant="outline" onClick={handleLogout} className="w-full text-red-600">
                        <LogOut className="w-4 h-4 mr-2" />
                        Đăng xuất
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Button variant="outline" asChild className="w-full">
                        <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                          Đăng nhập
                        </Link>
                      </Button>
                      <Button asChild className="w-full">
                        <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                          Đăng ký
                        </Link>
                      </Button>
                      <Button variant="outline" asChild className="w-full border-red-200 text-red-700">
                        <Link href="/admin/login" onClick={() => setMobileMenuOpen(false)}>
                          <Shield className="w-4 h-4 mr-2" />
                          Admin
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Decorative Pattern */}
      <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-r from-red-50/30 to-transparent opacity-50 pointer-events-none -z-10"></div>
    </header>
  );
}
