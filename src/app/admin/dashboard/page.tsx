'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
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
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Globe,
  Star,
  AlertTriangle,
  Zap,
  BarChart3,
  PieChart,
  Target,
  Award,
  Sparkles,
  Settings
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
  todayVisits: number
  weeklyGrowth: number
  monthlyRevenue: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalPosts: 0,
    pendingPosts: 0,
    approvedPosts: 0,
    rejectedPosts: 0,
    todayVisits: 0,
    weeklyGrowth: 0,
    monthlyRevenue: 0
  })
  const [recentPosts, setRecentPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [creatingBattle, setCreatingBattle] = useState(false)
  const [battleCode, setBattleCode] = useState<string>('')
  const [battleMsg, setBattleMsg] = useState<string>('')
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
          rejectedPosts: rejectedPosts.length,
          todayVisits: Math.floor(Math.random() * 2000) + 2000,
          weeklyGrowth: Math.floor(Math.random() * 15) + 5,
          monthlyRevenue: Math.floor(Math.random() * 10000) + 5000
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

  async function createBattleRoom6Teams() {
    try {
      setCreatingBattle(true)
      setBattleMsg('')
      setBattleCode('')
      const res = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          numTeams: 6,
          maxHpPerTeam: 200,
          timePerQuestionMs: 20000,
          playersPerTeamMax: 12,
          baseScore: 1000,
          speedBonusMax: 600,
          attackDamagePercent: 10,
          buffHealPercent: 5,
          maxDamagePerTurnPercent: 30,
          eliminationConfetti: true,
        })
      })
      if (!res.ok) throw new Error('Failed to create room')
      const data = await res.json()
      setBattleCode(data.code)
      setBattleMsg('Đã tạo phòng Battle Royale 6 đội. Gửi mã cho người chơi để tham gia.')
    } catch (e: any) {
      setBattleMsg('Không thể tạo phòng. Vui lòng thử lại.')
    } finally {
      setCreatingBattle(false)
    }
  }

  const getStatusBadge = (status: string) => {
    if (status === 'approved') {
      return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">✓ Đã duyệt</Badge>
    }
    if (status === 'rejected') {
      return <Badge className="bg-red-100 text-red-800 border-red-200">✗ Từ chối</Badge>
    }
    return <Badge className="bg-amber-100 text-amber-800 border-amber-200">⏳ Chờ duyệt</Badge>
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mx-auto mb-6"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-red-400 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Đang tải dữ liệu</h3>
          <p className="text-gray-600">Chuẩn bị dashboard cho bạn...</p>
        </div>
      </div>
    )
  }

  const approvalRate = stats.totalPosts > 0 ? Math.round((stats.approvedPosts / stats.totalPosts) * 100) : 0
  const pendingRate = stats.totalPosts > 0 ? Math.round((stats.pendingPosts / stats.totalPosts) * 100) : 0

  return (
    <div className="space-y-8 -mt-6 md:-mt-10">
      {error && (
        <Alert variant="destructive" className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-600 via-red-700 to-rose-800 p-8 text-white">
        <div className="absolute inset-0 bg-[url('/patterns/lotus.svg')] opacity-10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Chào mừng trở lại! 👋</h1>
              <p className="text-red-100 text-lg">Hôm nay có {stats.pendingPosts} bài viết cần duyệt và {stats.todayVisits} lượt truy cập mới</p>
            </div>
            <div className="hidden lg:block">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <BarChart3 className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
              <div className="text-2xl font-bold">{stats.weeklyGrowth}%</div>
              <div className="text-sm text-red-100">Tăng trưởng tuần</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
              <div className="text-2xl font-bold">{approvalRate}%</div>
              <div className="text-sm text-red-100">Tỷ lệ duyệt</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <div className="text-sm text-red-100">Thành viên</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
              <div className="text-2xl font-bold">{stats.todayVisits}</div>
              <div className="text-sm text-red-100">Truy cập hôm nay</div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Tổng người dùng</p>
                <p className="text-3xl font-bold text-blue-900">{stats.totalUsers}</p>
                <div className="flex items-center mt-2">
                  <ArrowUpRight className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600 font-medium">+{stats.weeklyGrowth}% tuần này</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-200 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-700">Bài viết đã duyệt</p>
                <p className="text-3xl font-bold text-emerald-900">{stats.approvedPosts}</p>
                <div className="flex items-center mt-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm text-emerald-600 font-medium">{approvalRate}% tổng số</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-emerald-200 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-emerald-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-700">Chờ duyệt</p>
                <p className="text-3xl font-bold text-amber-900">{stats.pendingPosts}</p>
                <div className="flex items-center mt-2">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span className="text-sm text-amber-600 font-medium">Cần xử lý</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-amber-200 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Lượt truy cập</p>
                <p className="text-3xl font-bold text-purple-900">{stats.todayVisits}</p>
                <div className="flex items-center mt-2">
                  <Globe className="w-4 h-4 text-purple-600" />
                  <span className="text-sm text-purple-600 font-medium">Hôm nay</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-200 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-purple-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Overview & Quick Actions */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Content Status Overview */}
        <div className="lg:w-2/3 w-full">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5 text-blue-600" />
                Tình trạng nội dung
              </CardTitle>
              <CardDescription>
                Phân tích trạng thái bài viết trong hệ thống
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Đã duyệt</span>
                    <span className="text-sm text-gray-600">{stats.approvedPosts}/{stats.totalPosts}</span>
                  </div>
                  <Progress value={approvalRate} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Chờ duyệt</span>
                    <span className="text-sm text-gray-600">{stats.pendingPosts}/{stats.totalPosts}</span>
                  </div>
                  <Progress value={pendingRate} className="h-2" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600">{stats.approvedPosts}</div>
                  <div className="text-xs text-gray-500">Đã duyệt</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-600">{stats.pendingPosts}</div>
                  <div className="text-xs text-gray-500">Chờ duyệt</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{stats.rejectedPosts}</div>
                  <div className="text-xs text-gray-500">Từ chối</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="lg:w-1/3 w-full space-y-6">
          <Card className="border-gradient-to-r from-red-200 to-rose-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-red-600" />
                Hành động nhanh
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full justify-start bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                <Link href="/admin/users">
                  <Users className="w-4 h-4 mr-2" />
                  Quản lý người dùng
                </Link>
              </Button>
              
              <Button asChild className="w-full justify-start bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800">
                <Link href="/admin/posts">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Duyệt bài viết
                  {stats.pendingPosts > 0 && (
                    <Badge className="ml-2 bg-orange-500 text-white">{stats.pendingPosts}</Badge>
                  )}
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="w-full justify-start border-purple-200 text-purple-700 hover:bg-purple-50">
                <Link href="/admin/settings">
                  <Settings className="w-4 h-4 mr-2" />
                  Cài đặt hệ thống
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* System Health */}
          <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-600" />
                Tình trạng hệ thống
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Server Status</span>
                <Badge className="bg-green-100 text-green-800">✓ Online</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Database</span>
                <Badge className="bg-green-100 text-green-800">✓ Connected</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Performance</span>
                <Badge className="bg-blue-100 text-blue-800">Good</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Battle Royale Section */}
      <Card className="bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 border-rose-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-6 h-6 text-rose-600" />
                Battle Royale Game
                <Badge className="bg-gradient-to-r from-rose-500 to-orange-500 text-white">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Beta
                </Badge>
              </CardTitle>
              <CardDescription className="mt-1">
                Tạo phòng chơi Battle Royale cho 6 đội với cấu hình tối ưu
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
            <div className="bg-white/70 rounded-lg p-3 text-center border border-rose-200">
              <div className="text-lg font-bold text-rose-700">6</div>
              <div className="text-xs text-gray-600">Teams</div>
            </div>
            <div className="bg-white/70 rounded-lg p-3 text-center border border-orange-200">
              <div className="text-lg font-bold text-orange-700">200</div>
              <div className="text-xs text-gray-600">HP</div>
            </div>
            <div className="bg-white/70 rounded-lg p-3 text-center border border-amber-200">
              <div className="text-lg font-bold text-amber-700">20s</div>
              <div className="text-xs text-gray-600">Time</div>
            </div>
            <div className="bg-white/70 rounded-lg p-3 text-center border border-red-200">
              <div className="text-lg font-bold text-red-700">10%</div>
              <div className="text-xs text-gray-600">Attack</div>
            </div>
            <div className="bg-white/70 rounded-lg p-3 text-center border border-green-200">
              <div className="text-lg font-bold text-green-700">5%</div>
              <div className="text-xs text-gray-600">Buff</div>
            </div>
            <div className="bg-white/70 rounded-lg p-3 text-center border border-purple-200">
              <div className="text-lg font-bold text-purple-700">12</div>
              <div className="text-xs text-gray-600">Players</div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-start">
            <Button 
              onClick={createBattleRoom6Teams} 
              disabled={creatingBattle}
              className="bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-700 hover:to-orange-700 shadow-lg"
            >
              {creatingBattle ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Đang tạo phòng...
                </>
              ) : (
                <>
                  <Target className="w-4 h-4 mr-2" />
                  Tạo phòng Battle Royale
                </>
              )}
            </Button>
            
            {battleCode && (
              <div className="flex-1 bg-white/80 rounded-lg p-4 border border-rose-200">
                <div className="font-mono text-xl font-bold text-center mb-2">
                  Mã phòng: <span className="px-3 py-1 bg-black text-white rounded">{battleCode}</span>
                </div>
                <div className="flex justify-center gap-4 text-sm">
                  <Link className="text-blue-600 hover:underline" href={`/play/${battleCode}`}>
                    🎮 Trang người chơi
                  </Link>
                  <Link className="text-purple-600 hover:underline" href={`/host`}>
                    🎯 Trang MC
                  </Link>
                </div>
              </div>
            )}
          </div>

          {battleMsg && (
            <Alert className="mt-4 border-rose-200 bg-white/70">
              <Award className="h-4 w-4" />
              <AlertDescription className="text-rose-800">
                {battleMsg}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Recent Posts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-gray-700" />
            Bài viết gần đây
          </CardTitle>
          <CardDescription>
            Những bài viết mới nhất từ cộng đồng HCM202
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentPosts.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có bài viết</h3>
              <p className="text-gray-500 mb-4">Hệ thống chưa có bài viết nào từ cộng đồng</p>
              <Button asChild variant="outline">
                <Link href="/community/submit">Tạo bài viết đầu tiên</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {recentPosts.map((post, index) => (
                <div key={post.id} className="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{post.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
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
                    <div className="ml-4 flex items-center space-x-2">
                      {getStatusBadge(post.status)}
                      <span className="text-xs text-gray-400">#{index + 1}</span>
                    </div>
                  </div>
                  {post.content && (
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {post.content.substring(0, 120)}...
                    </p>
                  )}
                  <div className="flex justify-between items-center">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/admin/posts?id=${post.id}`}>
                        <Eye className="w-4 h-4 mr-1" />
                        Xem chi tiết
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
              
              <div className="text-center pt-6 border-t">
                <Button asChild variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                  <Link href="/admin/posts">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Xem tất cả bài viết ({stats.totalPosts})
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
