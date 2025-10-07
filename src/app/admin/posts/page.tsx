'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Trash2, 
  Eye,
  User,
  Calendar,
  MessageSquare
} from "lucide-react"
import { useRouter } from 'next/navigation'

interface Post {
  id: string
  title: string
  content: string | null
  status: string
  createdAt: string
  imageUrl: string | null
  references?: string[]
  metadata?: any
  author: {
    name: string | null
    email: string
  }
}

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [viewingPost, setViewingPost] = useState<Post | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/admin/posts', {
        credentials: 'include',
      })
      
      if (response.status === 401) {
        router.push('/admin/login')
        return
      }
      
      const data = await response.json()
      
      if (response.ok) {
        setPosts(data.posts)
      } else {
        setError(data.error || 'Không thể tải danh sách bài viết')
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
      setError('Không thể kết nối đến server')
    } finally {
      setLoading(false)
    }
  }

  const updatePostStatus = async (postId: string, status: string) => {
    setActionLoading(postId)
    try {
      const response = await fetch('/api/admin/posts', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ postId, status }),
      })

      if (response.status === 401) {
        router.push('/admin/login')
        return
      }

      const data = await response.json()
      
      if (response.ok) {
        setPosts(posts.map(post => 
          post.id === postId ? { ...post, status } : post
        ))
      } else {
        setError(data.error || 'Không thể cập nhật bài viết')
      }
    } catch (error) {
      console.error('Error updating post:', error)
      setError('Không thể kết nối đến server')
    } finally {
      setActionLoading(null)
    }
  }

  const deletePost = async (postId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa bài viết này?')) return

    setActionLoading(postId)
    try {
      const response = await fetch('/api/admin/posts', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ postId }),
      })

      if (response.status === 401) {
        router.push('/admin/login')
        return
      }

      const data = await response.json()
      
      if (response.ok) {
        setPosts(posts.filter(post => post.id !== postId))
      } else {
        setError(data.error || 'Không thể xóa bài viết')
      }
    } catch (error) {
      console.error('Error deleting post:', error)
      setError('Không thể kết nối đến server')
    } finally {
      setActionLoading(null)
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

  const pendingPosts = posts.filter(post => post.status === 'pending')
  const approvedPosts = posts.filter(post => post.status === 'approved')
  const rejectedPosts = posts.filter(post => post.status === 'rejected')

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
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Quản lý bài viết</h1>
          <p className="text-gray-600">Duyệt và quản lý các bài viết từ cộng đồng</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tổng bài viết</p>
                  <p className="text-2xl font-bold text-gray-900">{posts.length}</p>
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
                  <p className="text-2xl font-bold text-yellow-600">{pendingPosts.length}</p>
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
                  <p className="text-2xl font-bold text-green-600">{approvedPosts.length}</p>
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
                  <p className="text-2xl font-bold text-red-600">{rejectedPosts.length}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Posts List */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Danh sách bài viết</CardTitle>
            <CardDescription>
              Quản lý và duyệt các bài viết từ cộng đồng
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {posts.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Chưa có bài viết nào</p>
                </div>
              ) : (
                posts.map((post) => (
                  <div key={post.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{post.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                          <div className="flex items-center space-x-1">
                            <User className="w-4 h-4" />
                            <span>{post.author.name || post.author.email}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
                          </div>
                        </div>
                        {post.content && (
                          <p className="text-gray-700 text-sm line-clamp-2">
                            {post.content.substring(0, 150)}...
                          </p>
                        )}
                      </div>
                      <div className="ml-4">
                        {getStatusBadge(post.status)}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center space-x-2">
                        {post.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => updatePostStatus(post.id, 'approved')}
                              disabled={actionLoading === post.id}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Duyệt
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updatePostStatus(post.id, 'rejected')}
                              disabled={actionLoading === post.id}
                              className="border-red-300 text-red-700 hover:bg-red-50"
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Từ chối
                            </Button>
                          </>
                        )}
                        
                        {post.status === 'approved' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updatePostStatus(post.id, 'rejected')}
                            disabled={actionLoading === post.id}
                            className="border-red-300 text-red-700 hover:bg-red-50"
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Từ chối
                          </Button>
                        )}
                        
                        {post.status === 'rejected' && (
                          <Button
                            size="sm"
                            onClick={() => updatePostStatus(post.id, 'approved')}
                            disabled={actionLoading === post.id}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Duyệt
                          </Button>
                        )}
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-gray-300 text-gray-700 hover:bg-gray-50"
                          onClick={() => setViewingPost(post)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Xem
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deletePost(post.id)}
                          disabled={actionLoading === post.id}
                          className="border-red-300 text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Xóa
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
      <PostViewModal post={viewingPost} onClose={() => setViewingPost(null)} />
    </>
  )
}

// Modal xem nội dung bài viết
// Đặt cuối component tree để tránh z-index issues
function PostViewModal({ post, onClose }: { post: Post | null, onClose: () => void }) {
  if (!post) return null
  const extractUrls = (text: string) => {
    const urlRegex = /https?:\/\/[^\s)]+/gi
    return Array.from(new Set((text.match(urlRegex) || [])))
  }
  const metaSources = Array.isArray((post as any)?.metadata?.sources) ? (post as any).metadata.sources : []
  const fallbackFromContent = post.content ? extractUrls(post.content) : []
  const refs: string[] = Array.isArray(post.references) && post.references.length > 0
    ? post.references
    : (metaSources.length > 0 ? metaSources : fallbackFromContent)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-4xl rounded-3xl overflow-hidden shadow-[0_30px_120px_rgba(0,0,0,0.45)] border-[3px] border-amber-900/50 bg-amber-50/95 backdrop-blur-sm">
        {/* Header */}
        {post.imageUrl ? (
          <div className="relative">
            <img src={post.imageUrl} alt={post.title} className="w-full h-56 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-amber-900/80 via-amber-900/20 to-transparent" />
            <div className="absolute bottom-3 left-0 right-0 px-6">
              <h2 className="text-2xl md:text-3xl font-extrabold text-amber-50 drop-shadow-[0_2px_0_rgba(0,0,0,0.35)]">{post.title}</h2>
            </div>
            <button onClick={onClose} className="absolute top-3 right-3 px-3 py-1.5 text-sm rounded-lg bg-amber-50/90 hover:bg-white text-amber-900 border border-amber-900/30 shadow">
              Đóng
            </button>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-amber-800 to-rose-700 px-6 py-5">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl md:text-3xl font-extrabold text-amber-50 drop-shadow">{post.title}</h2>
              <button onClick={onClose} className="px-3 py-1.5 text-sm rounded-lg bg-amber-50/90 hover:bg-white text-amber-900 border border-amber-200 shadow">Đóng</button>
            </div>
          </div>
        )}

        {/* Meta */}
        <div className="px-6 pt-5 pb-0">
          <div className="text-sm text-amber-950/90 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1"><User className="w-4 h-4" />{post.author?.name || post.author?.email}</span>
            <span className="inline-flex items-center gap-1"><Calendar className="w-4 h-4" />{new Date(post.createdAt).toLocaleString('vi-VN')}</span>
            <span className="inline-flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded-full text-xs border ${post.status==='approved' ? 'bg-green-100 text-green-800 border-green-300' : post.status==='rejected' ? 'bg-rose-100 text-rose-800 border-rose-300' : 'bg-amber-100 text-amber-900 border-amber-300'}`}>{post.status === 'approved' ? 'Đã duyệt' : post.status === 'rejected' ? 'Từ chối' : 'Chờ duyệt'}</span>
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4 max-h-[65vh] overflow-y-auto bg-[radial-gradient(circle_at_top_left,#fff7ed,transparent_60%),radial-gradient(circle_at_bottom_right,#fffbeb,transparent_55%)]">
          {post.content ? (
            <pre className="whitespace-pre-wrap text-amber-950 text-base leading-7">{post.content}</pre>
          ) : (
            <p className="text-amber-900/70 text-sm italic">Bài viết không có nội dung.</p>
          )}
          {Array.isArray(refs) && refs.length > 0 && (
            <div className="pt-3 border-t border-amber-900/20">
              <h3 className="text-sm font-semibold text-amber-900 mb-2">Tài liệu tham khảo</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                {refs.map((ref, i) => {
                  const href = /^https?:\/\//i.test(ref) ? ref : `https://${ref}`
                  return (
                    <li key={i}>
                      <a href={href} target="_blank" rel="noopener noreferrer" className="text-amber-900 underline underline-offset-2 hover:text-rose-700 break-all">
                        {ref}
                      </a>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}