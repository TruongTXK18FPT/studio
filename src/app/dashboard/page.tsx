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
  History,
  BookOpen,
  Eye,
  Edit,
  Trash2,
  Users,
  Target
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

interface Quiz {
  id: string
  title: string
  description?: string
  difficulty: string
  category?: string
  tags: string[]
  timeLimit?: number
  isPublic: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
  questions: Array<{
    id: string
    question: string
    type: string
    difficulty: string
  }>
  _count: {
    results: number
  }
}

interface UserStats {
  totalPosts: number
  approvedPosts: number
  pendingPosts: number
  rejectedPosts: number
  totalQuizzes: number
  publicQuizzes: number
  totalQuizResults: number
}

interface UserData {
  id: string
  email: string
  name?: string
  createdAt: string
}

export default function DashboardPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [stats, setStats] = useState<UserStats | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'posts' | 'quizzes'>('posts')

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
      // Fetch posts
      const postsResponse = await fetch('/api/user/posts')
      if (postsResponse.ok) {
        const postsData = await postsResponse.json()
        setPosts(postsData.posts || [])
        setStats(postsData.stats || null)
        setUserData(postsData.user || null)
      }

      // Fetch quizzes
      const quizzesResponse = await fetch('/api/user/quizzes')
      if (quizzesResponse.ok) {
        const quizzesData = await quizzesResponse.json()
        setQuizzes(quizzesData.quizzes || [])
      }
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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'hard': return 'bg-orange-100 text-orange-800'
      case 'expert': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Dễ'
      case 'medium': return 'Trung bình'
      case 'hard': return 'Khó'
      case 'expert': return 'Chuyên gia'
      default: return difficulty
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

  const handleEditPost = (postId: string) => {
    // TODO: Implement edit post functionality
    console.log('Edit post:', postId)
    // Có thể redirect đến trang edit hoặc mở modal
  }

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
      return
    }

    try {
      const response = await fetch(`/api/user/posts/${postId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        // Refresh data after deletion
        fetchUserData()
      } else {
        console.error('Failed to delete post')
      }
    } catch (error) {
      console.error('Error deleting post:', error)
    }
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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Tổng bài viết</p>
                  <p className="text-3xl font-bold">{stats?.totalPosts || 0}</p>
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
                  <p className="text-3xl font-bold">{stats?.approvedPosts || 0}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Quiz của bạn</p>
                  <p className="text-3xl font-bold">{quizzes.length}</p>
                </div>
                <BookOpen className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Lượt làm quiz</p>
                  <p className="text-3xl font-bold">
                    {quizzes.reduce((sum, quiz) => sum + quiz._count.results, 0)}
                  </p>
                </div>
                <Users className="w-8 h-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg bg-gradient-to-br from-red-500 to-red-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm font-medium">Bị từ chối</p>
                  <p className="text-3xl font-bold">{stats?.rejectedPosts || 0}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-200" />
              </div>
            </CardContent>
          </Card>
        </div>

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
              <Button asChild className="w-full justify-start bg-purple-600 hover:bg-purple-700">
                <Link href="/quiz/create">
                  <Plus className="w-4 h-4 mr-2" />
                  Tạo quiz mới
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

        {/* Content Management */}
        <Card className="shadow-lg border-0 mt-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  {activeTab === 'posts' ? <FileText className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
                  {activeTab === 'posts' ? `Bài viết của bạn (${posts.length})` : `Quiz của bạn (${quizzes.length})`}
                </CardTitle>
                <CardDescription>
                  {activeTab === 'posts' 
                    ? 'Danh sách các bài viết bạn đã đóng góp cho cộng đồng'
                    : 'Danh sách các quiz bạn đã tạo'
                  }
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={activeTab === 'posts' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('posts')}
                  className="flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Bài viết
                </Button>
                <Button
                  variant={activeTab === 'quizzes' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('quizzes')}
                  className="flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  Quiz
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {activeTab === 'posts' ? (
              posts.length === 0 ? (
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
                          <div className="flex gap-1">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/community/${post.id}`}>
                                <Eye className="w-4 h-4" />
                              </Link>
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleEditPost(post.id)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleDeletePost(post.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(post.createdAt)}
                          </span>
                          {post.updatedAt !== post.createdAt && (
                            <span className="flex items-center gap-1 text-blue-600">
                              <Edit className="w-4 h-4" />
                              Cập nhật: {formatDate(post.updatedAt)}
                            </span>
                          )}
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
                        <div className="text-xs text-gray-400">
                          ID: {post.id.slice(-8)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              quizzes.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium mb-2">Chưa có quiz nào</p>
                  <p className="text-sm mb-6">
                    Hãy tạo quiz đầu tiên để chia sẻ kiến thức với cộng đồng
                  </p>
                  <Button asChild className="bg-purple-600 hover:bg-purple-700">
                    <Link href="/quiz/create">
                      <Plus className="w-4 h-4 mr-2" />
                      Tạo quiz đầu tiên
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {quizzes.map((quiz) => (
                    <div key={quiz.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                            {quiz.title}
                          </h3>
                          <p className="text-gray-600 text-sm line-clamp-2">
                            {quiz.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Badge className={getDifficultyColor(quiz.difficulty)}>
                            {getDifficultyLabel(quiz.difficulty)}
                          </Badge>
                          <Badge className={quiz.isPublic ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                            {quiz.isPublic ? 'Công khai' : 'Riêng tư'}
                          </Badge>
                          <div className="flex gap-1">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/quiz/${quiz.id}`}>
                                <Eye className="w-4 h-4" />
                              </Link>
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(quiz.createdAt)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Target className="w-4 h-4" />
                            {quiz.questions.length} câu hỏi
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {quiz._count.results} lượt làm
                          </span>
                          {quiz.tags && quiz.tags.length > 0 && (
                            <div className="flex gap-1">
                              {quiz.tags.slice(0, 2).map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {quiz.tags.length > 2 && (
                                <span className="text-xs text-gray-400">+{quiz.tags.length - 2}</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
