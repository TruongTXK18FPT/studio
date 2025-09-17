'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  Calendar, 
  FileText, 
  CheckCircle, 
  Clock, 
  XCircle, 
  TrendingUp,
  User,
  Settings,
  Plus,
  BarChart3,
  History
} from 'lucide-react'
import Link from 'next/link'

interface Post {
  id: string
  title: string
  content: string
  status: 'pending' | 'approved' | 'rejected'
  tags: string[]
  createdAt: string
  updatedAt: string
  metadata?: any
}

interface UserStats {
  totalPosts: number
  approvedPosts: number
  pendingPosts: number
  rejectedPosts: number
}

interface UserData {
  id: string
  email: string
  name?: string
  createdAt: string
}

export default function DashboardPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [stats, setStats] = useState<UserStats | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check authentication first
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (!response.ok) {
        window.location.href = '/login'
        return
      }
      // If authenticated, fetch user data
      fetchUserData()
    } catch (err) {
      console.error('Auth check failed:', err)
      window.location.href = '/login'
    }
  }

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user/posts')
      if (!response.ok) {
        throw new Error('Failed to fetch user data')
      }
      
      const data = await response.json()
      setPosts(data.posts || [])
      setStats(data.stats || null)
      setUserData(data.user || null)
    } catch (err) {
      console.error('Error fetching user data:', err)
      setError('Không thể tải dữ liệu người dùng')
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Đã duyệt'
      case 'pending':
        return 'Chờ duyệt'
      case 'rejected':
        return 'Từ chối'
      default:
        return 'Không xác định'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 p-4">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8">
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 p-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center py-12">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Có lỗi xảy ra</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={fetchUserData}>Thử lại</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Trang cá nhân
          </h1>
          <p className="text-gray-600 leading-relaxed">
            Chào mừng bạn đến với trang cá nhân, quản lý hoạt động và đóng góp của bạn
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Tổng bài viết</p>
                    <p className="text-3xl font-bold">{stats.totalPosts}</p>
                  </div>
                  <FileText className="w-8 h-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Đã duyệt</p>
                    <p className="text-3xl font-bold">{stats.approvedPosts}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-200" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-100 text-sm font-medium">Chờ duyệt</p>
                    <p className="text-3xl font-bold">{stats.pendingPosts}</p>
                  </div>
                  <Clock className="w-8 h-8 text-yellow-200" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg bg-gradient-to-br from-red-500 to-red-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-100 text-sm font-medium">Từ chối</p>
                    <p className="text-3xl font-bold">{stats.rejectedPosts}</p>
                  </div>
                  <XCircle className="w-8 h-8 text-red-200" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          {/* User Info */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <User className="w-5 h-5" />
                Thông tin tài khoản
              </CardTitle>
              <CardDescription>
                Chi tiết về tài khoản của bạn
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {userData && (
                <>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Email:</p>
                    <p className="text-gray-900">{userData.email}</p>
                  </div>
                  {userData.name && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Họ và tên:</p>
                      <p className="text-gray-900">{userData.name}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Ngày tham gia:</p>
                    <p className="text-gray-900">{formatDate(userData.createdAt)}</p>
                  </div>
                </>
              )}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Trạng thái:</p>
                <Badge className="bg-green-100 text-green-800">
                  Đã xác thực
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <TrendingUp className="w-5 h-5" />
                Hành động nhanh
              </CardTitle>
              <CardDescription>
                Các tính năng và tác vụ phổ biến
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full justify-start bg-red-600 hover:bg-red-700">
                <Link href="/community/submit">
                  <Plus className="w-4 h-4 mr-2" />
                  Đóng góp bài viết mới
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/timeline">
                  <History className="w-4 h-4 mr-2" />
                  Xem dòng thời gian
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/quiz">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Làm bài quiz
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <Settings className="w-5 h-5" />
                Cài đặt
              </CardTitle>
              <CardDescription>
                Quản lý tài khoản và bảo mật
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                Đổi mật khẩu
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Cập nhật thông tin
              </Button>
              <form action="/api/auth/logout" method="POST">
                <Button 
                  type="submit" 
                  variant="destructive" 
                  className="w-full justify-start"
                >
                  Đăng xuất
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* User Posts */}
        <Card className="shadow-lg border-0 mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <FileText className="w-5 h-5" />
              Bài viết của bạn ({posts.length})
            </CardTitle>
            <CardDescription>
              Danh sách các bài viết bạn đã đóng góp cho cộng đồng
            </CardDescription>
          </CardHeader>
          <CardContent>
            {posts.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium mb-2">Chưa có bài viết nào</p>
                <p className="text-sm mb-6">
                  Hãy bắt đầu chia sẻ kiến thức và câu chuyện về lịch sử với cộng đồng
                </p>
                <Button asChild className="bg-red-600 hover:bg-red-700">
                  <Link href="/community/submit">
                    <Plus className="w-4 h-4 mr-2" />
                    Viết bài đầu tiên
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <div key={post.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-2">
                          {post.content}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        {getStatusIcon(post.status)}
                        <Badge className={getStatusColor(post.status)}>
                          {getStatusText(post.status)}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(post.createdAt)}
                        </span>
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex gap-1">
                            {post.tags.slice(0, 3).map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {post.tags.length > 3 && (
                              <span className="text-xs text-gray-400">+{post.tags.length - 3}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
