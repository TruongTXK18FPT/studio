'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Trash2, 
  Eye,
  User,
  Calendar,
  MessageSquare,
  LogOut,
  Users,
  FileText,
  TrendingUp
} from "lucide-react"
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Post {
  id: string
  title: string
  content: string | null
  status: string
  createdAt: string
  imageUrl: string | null
  author: {
    name: string | null
    email: string
  }
}

interface DashboardStats {
  totalUsers: number
  totalPosts: number
  pendingPosts: number
  approvedPosts: number
  rejectedPosts: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalPosts: 0,
    pendingPosts: 0,
    approvedPosts: 0,
    rejectedPosts: 0
  })
  const [recentPosts, setRecentPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch dashboard statistics
      const [postsResponse, usersResponse] = await Promise.all([
        fetch('/api/admin/posts', { credentials: 'include' }),
        fetch('/api/admin/users?limit=1', { credentials: 'include' })
      ])
      
      if (postsResponse.status === 401 || usersResponse.status === 401) {
        router.push('/admin/login')
        return
      }
      
      const [postsData, usersData] = await Promise.all([
        postsResponse.json(),
        usersResponse.json()
      ])
      
      if (postsResponse.ok && usersResponse.ok) {
        const posts = postsData.posts || []
        const pendingPosts = posts.filter((post: Post) => post.status === 'pending')
        const approvedPosts = posts.filter((post: Post) => post.status === 'approved')
        const rejectedPosts = posts.filter((post: Post) => post.status === 'rejected')
        
        setStats({
          totalUsers: usersData.pagination?.total || 0,
          totalPosts: posts.length,
          pendingPosts: pendingPosts.length,
          approvedPosts: approvedPosts.length,
          rejectedPosts: rejectedPosts.length
        })
        
        // Get recent posts (last 5)
        setRecentPosts(posts.slice(0, 5))
      } else {
        setError('Không thể tải dữ liệu dashboard')
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      setError('Không thể kết nối đến server')
    } finally {
      setLoading(false)
    }
  }

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

  const getStatusBadge = (status: string) => {
    if (status === 'approved') {
      return <Badge className="bg-green-100 text-green-800 border-green-200">Đã duyệt</Badge>
    }
    if (status === 'rejected') {
      return <Badge className="bg-red-100 text-red-800 border-red-200">Từ chối</Badge>
    }
    return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Chờ duyệt</Badge>
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Tổng quan hoạt động hệ thống HCM202</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card className="bg-white border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Người dùng</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.totalUsers}</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tổng bài viết</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalPosts}</p>
                </div>
                <MessageSquare className="w-8 h-8 text-gray-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-yellow-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Chờ duyệt</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pendingPosts}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Đã duyệt</p>
                  <p className="text-2xl font-bold text-green-600">{stats.approvedPosts}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-red-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Từ chối</p>
                  <p className="text-2xl font-bold text-red-600">{stats.rejectedPosts}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/admin/users">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Quản lý người dùng</h3>
                    <p className="text-sm text-gray-600">Thêm, sửa, xóa tài khoản</p>
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>

          <Card className="bg-white hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/admin/posts">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Quản lý bài viết</h3>
                    <p className="text-sm text-gray-600">Duyệt và quản lý nội dung</p>
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>

          <Card className="bg-white hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Thống kê</h3>
                  <p className="text-sm text-gray-600">Xem báo cáo chi tiết</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Posts */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Bài viết gần đây
            </CardTitle>
            <CardDescription>
              Những bài viết mới nhất từ cộng đồng
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentPosts.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Chưa có bài viết nào</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentPosts.map((post) => (
                  <div key={post.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{post.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                          <div className="flex items-center space-x-1">
                            <User className="w-4 h-4" />
                            <span>{post.author.name || post.author.email}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
                          </div>
                        </div>
                      </div>
                      <div className="ml-4">
                        {getStatusBadge(post.status)}
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="text-center pt-4">
                  <Button asChild variant="outline">
                    <Link href="/admin/posts">
                      Xem tất cả bài viết
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
