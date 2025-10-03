'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { 
  Shield, 
  Users, 
  MessageSquare, 
  BarChart3, 
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  Bell,
  Search,
  ChevronDown,
  Activity,
  FileText,
  Zap
} from 'lucide-react'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [adminUser, setAdminUser] = useState<any>(null)
  const pathname = usePathname()
  const router = useRouter()

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'include'
        })
        
        if (response.status === 401) {
          router.push('/admin/login')
          return
        }
        
        const userData = await response.json()
        if (userData.user?.role !== 'admin') {
          router.push('/admin/login')
          return
        }
        
        setAdminUser(userData.user)
        setIsAuthenticated(true)
      } catch (error) {
        console.error('Auth check failed:', error)
        router.push('/admin/login')
      } finally {
        setIsLoading(false)
      }
    }

    // Skip auth check for login page
    if (pathname === '/admin/login') {
      setIsLoading(false)
      return
    }

    checkAuth()
  }, [pathname, router])

  const navigation = [
    {
      name: 'Dashboard',
      href: '/admin/dashboard',
      icon: BarChart3,
      current: pathname === '/admin/dashboard',
      description: 'Tổng quan hệ thống'
    },
    {
      name: 'Quản lý bài viết',
      href: '/admin/posts',
      icon: MessageSquare,
      current: pathname === '/admin/posts',
      description: 'Duyệt và quản lý nội dung',
      badge: '3'
    },
    {
      name: 'Quản lý người dùng',
      href: '/admin/users',
      icon: Users,
      current: pathname === '/admin/users',
      description: 'Thành viên hệ thống'
    },
    {
      name: 'Hoạt động',
      href: '/admin/activity',
      icon: Activity,
      current: pathname === '/admin/activity',
      description: 'Nhật ký hoạt động'
    },
    {
      name: 'Cài đặt',
      href: '/admin/settings',
      icon: Settings,
      current: pathname === '/admin/settings',
      description: 'Cấu hình hệ thống'
    }
  ]

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { 
        method: 'POST',
        credentials: 'include'
      })
      router.push('/admin/login')
    } catch (error) {
      console.error('Logout error:', error)
      router.push('/admin/login')
    }
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mx-auto mb-6"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-red-400 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Đang xác thực</h3>
          <p className="text-gray-600">Vui lòng chờ trong giây lát...</p>
        </div>
      </div>
    )
  }

  // Don't render admin layout for login page
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  // Don't render admin layout if not authenticated
  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex">

      {/* Sidebar (scrolls with content, not fixed) */}
      <div className={`
        w-72 bg-white/95 backdrop-blur-xl shadow-2xl border-r border-gray-200/50 flex-shrink-0
      `}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-20 px-6 border-b border-gray-200/50 bg-gradient-to-r from-red-600 to-red-700">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <div>
              <span className="text-lg font-bold text-white">Admin Panel</span>
              <p className="text-xs text-red-100">HCM202 Management</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden text-white hover:bg-white/20"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 relative overflow-hidden
                  ${item.current 
                    ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:shadow-md'
                  }
                `}
                onClick={() => setSidebarOpen(false)}
              >
                {item.current && (
                  <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-red-500 opacity-10"></div>
                )}
                <Icon className={`w-5 h-5 mr-3 relative z-10 ${item.current ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'}`} />
                <div className="flex-1 relative z-10">
                  <div className="flex items-center justify-between">
                    <span>{item.name}</span>
                    {item.badge && (
                      <Badge className="bg-orange-500 text-white text-xs px-1.5 py-0.5 min-w-0">
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                  <p className={`text-xs mt-0.5 ${item.current ? 'text-red-100' : 'text-gray-500'}`}>
                    {item.description}
                  </p>
                </div>
              </Link>
            )
          })}
        </nav>

        {/* Quick Actions */}
        <div className="px-4 py-4 border-t border-gray-200/50">
          <div className="space-y-2">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="w-full justify-start border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Về trang chính
              </Link>
            </Button>
          </div>
        </div>

        {/* Admin Profile */}
        <div className="px-4 py-4 border-t border-gray-200/50 bg-gray-50/50">
          <div className="flex items-center space-x-3 mb-3">
            <Avatar className="w-10 h-10 border-2 border-red-200">
              <AvatarFallback className="bg-gradient-to-br from-red-500 to-red-600 text-white font-semibold">
                {adminUser?.name?.charAt(0) || adminUser?.email?.charAt(0) || 'A'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {adminUser?.name || 'Admin'}
              </p>
              <p className="text-xs text-gray-500 truncate">{adminUser?.email}</p>
            </div>
          </div>
          <Button
            onClick={logout}
            variant="outline"
            size="sm"
            className="w-full border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Đăng xuất
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-200/50">
          <div className="flex items-center justify-between h-16 px-6">
            {/* Mobile menu button */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden"
              >
                <Menu className="w-6 h-6" />
              </Button>
              
              {/* Page title */}
              <div className="hidden lg:block">
                <h1 className="text-xl font-semibold text-gray-900">
                  {navigation.find(item => item.current)?.name || 'Admin Panel'}
                </h1>
                <p className="text-sm text-gray-500">
                  {navigation.find(item => item.current)?.description || 'Quản lý hệ thống HCM202'}
                </p>
              </div>
            </div>

            {/* Header actions */}
            <div className="flex items-center space-x-3">
              {/* Search */}
              <Button variant="ghost" size="sm" className="hidden md:flex">
                <Search className="w-5 h-5" />
              </Button>
              
              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
              </Button>
              
              {/* Quick create */}
              <Button size="sm" className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-lg hidden md:flex">
                <Zap className="w-4 h-4 mr-2" />
                Tạo nhanh
              </Button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="min-h-screen">
          <div className="max-w-full px-6 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}