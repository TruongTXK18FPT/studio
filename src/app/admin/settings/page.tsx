'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Settings as SettingsIcon,
  Shield,
  Database,
  Users,
  Mail,
  Globe,
  Server,
  AlertTriangle,
  Save,
  Download,
  Upload,
  RefreshCw,
  Bell,
  Lock,
  Eye,
  BarChart3,
  FileText,
  Calendar,
  UserCog,
  Trash2,
  HelpCircle,
  Activity
} from 'lucide-react'

interface SystemSettings {
  general: {
    siteName: string
    siteDescription: string
    allowRegistration: boolean
    requireEmailVerification: boolean
    maintenanceMode: boolean
  }
  notifications: {
    emailNotifications: boolean
    systemAlerts: boolean
    userActivity: boolean
    securityAlerts: boolean
  }
  security: {
    maxLoginAttempts: number
    sessionTimeout: number
    requireStrongPassword: boolean
    enableTwoFactor: boolean
  }
  content: {
    autoApprovePost: boolean
    allowGuestView: boolean
    showUserStats: boolean
    enableComments: boolean
  }
}

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [systemStats, setSystemStats] = useState({
    totalUsers: 0,
    totalPosts: 0,
    pendingPosts: 0,
    activeUsers: 0
  })
  const [settings, setSettings] = useState<SystemSettings>({
    general: {
      siteName: 'Học Tập Tư Tưởng Hồ Chí Minh',
      siteDescription: 'Nền tảng học tập toàn diện về tư tưởng và đạo đức Hồ Chí Minh',
      allowRegistration: true,
      requireEmailVerification: false,
      maintenanceMode: false
    },
    notifications: {
      emailNotifications: true,
      systemAlerts: true,
      userActivity: false,
      securityAlerts: true
    },
    security: {
      maxLoginAttempts: 5,
      sessionTimeout: 7200,
      requireStrongPassword: true,
      enableTwoFactor: false
    },
    content: {
      autoApprovePost: false,
      allowGuestView: true,
      showUserStats: true,
      enableComments: true
    }
  })

  useEffect(() => {
    checkAdminAuth()
  }, [])

  const checkAdminAuth = async () => {
    try {
      const response = await fetch('/api/auth/me', { credentials: 'include' })
      if (response.status === 401) {
        window.location.href = '/admin/login'
        return
      }
      const data = await response.json()
      const role = (data?.user?.role || '').toString().toLowerCase()
      if (role !== 'admin') {
        window.location.href = '/admin/login'
        return
      }

      await fetchSystemStats()
    } catch (error) {
      console.error('Admin auth check failed:', error)
      window.location.href = '/admin/login'
    } finally {
      setLoading(false)
    }
  }

  const fetchSystemStats = async () => {
    try {
      const response = await fetch('/api/admin/stats', { credentials: 'include' })
      if (response.ok) {
        const stats = await response.json()
        setSystemStats(stats)
      }
    } catch (error) {
      console.error('Failed to fetch system stats:', error)
    }
  }

  const handleSettingChange = (category: keyof SystemSettings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }))
  }

  const handleSaveSettings = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(settings)
      })
      
      if (response.ok) {
        alert('Cài đặt đã được lưu thành công!')
      } else {
        throw new Error('Failed to save settings')
      }
    } catch (error) {
      console.error('Failed to save settings:', error)
      alert('Có lỗi xảy ra khi lưu cài đặt!')
    } finally {
      setSaving(false)
    }
  }

  const handleBackupData = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/admin/backup', { credentials: 'include' })
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `backup-${new Date().toISOString().split('T')[0]}.json`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Backup failed:', error)
      alert('Có lỗi xảy ra khi sao lưu dữ liệu!')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-yellow-50 p-4">
        <div className="container mx-auto max-w-5xl">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-300 rounded w-1/3"></div>
            <div className="h-96 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-yellow-50 p-4">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <SettingsIcon className="w-8 h-8 text-red-600" />
            Cài đặt hệ thống
          </h1>
          <p className="text-gray-600">
            Quản lý và cấu hình hệ thống, bảo mật và các tính năng
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Tổng người dùng</p>
                  <p className="text-3xl font-bold">{systemStats.totalUsers}</p>
                </div>
                <Users className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Tổng bài viết</p>
                  <p className="text-3xl font-bold">{systemStats.totalPosts}</p>
                </div>
                <FileText className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm font-medium">Chờ duyệt</p>
                  <p className="text-3xl font-bold">{systemStats.pendingPosts}</p>
                </div>
                <Calendar className="w-8 h-8 text-yellow-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Đang hoạt động</p>
                  <p className="text-3xl font-bold">{systemStats.activeUsers}</p>
                </div>
                <Activity className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white shadow-sm">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Chung
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Bảo mật
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Nội dung
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Thông báo
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-2">
              <Server className="w-4 h-4" />
              Hệ thống
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-6">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-red-600" />
                  Cài đặt chung
                </CardTitle>
                <CardDescription>
                  Cấu hình thông tin cơ bản của hệ thống
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="site-name">Tên trang web</Label>
                    <Input 
                      id="site-name"
                      value={settings.general.siteName}
                      onChange={(e) => handleSettingChange('general', 'siteName', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="site-description">Mô tả trang web</Label>
                    <Textarea 
                      id="site-description"
                      value={settings.general.siteDescription}
                      onChange={(e) => handleSettingChange('general', 'siteDescription', e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Cho phép đăng ký</Label>
                      <p className="text-sm text-gray-500">
                        Người dùng mới có thể tạo tài khoản
                      </p>
                    </div>
                    <Switch 
                      checked={settings.general.allowRegistration}
                      onCheckedChange={(checked) => handleSettingChange('general', 'allowRegistration', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Yêu cầu xác thực email</Label>
                      <p className="text-sm text-gray-500">
                        Người dùng phải xác thực email trước khi sử dụng
                      </p>
                    </div>
                    <Switch 
                      checked={settings.general.requireEmailVerification}
                      onCheckedChange={(checked) => handleSettingChange('general', 'requireEmailVerification', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Chế độ bảo trì</Label>
                      <p className="text-sm text-gray-500">
                        Tạm thời tắt trang web để bảo trì
                      </p>
                    </div>
                    <Switch 
                      checked={settings.general.maintenanceMode}
                      onCheckedChange={(checked) => handleSettingChange('general', 'maintenanceMode', checked)}
                    />
                  </div>
                </div>

                <Button onClick={handleSaveSettings} disabled={saving} className="bg-red-600 hover:bg-red-700">
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Đang lưu...' : 'Lưu cài đặt'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-red-600" />
                  Cài đặt bảo mật
                </CardTitle>
                <CardDescription>
                  Cấu hình bảo mật và quyền truy cập
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="max-login">Số lần đăng nhập tối đa</Label>
                    <Input 
                      id="max-login"
                      type="number"
                      value={settings.security.maxLoginAttempts}
                      onChange={(e) => handleSettingChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="session-timeout">Thời gian hết hạn phiên (giây)</Label>
                    <Input 
                      id="session-timeout"
                      type="number"
                      value={settings.security.sessionTimeout}
                      onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Yêu cầu mật khẩu mạnh</Label>
                      <p className="text-sm text-gray-500">
                        Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số
                      </p>
                    </div>
                    <Switch 
                      checked={settings.security.requireStrongPassword}
                      onCheckedChange={(checked) => handleSettingChange('security', 'requireStrongPassword', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Xác thực 2 yếu tố</Label>
                      <p className="text-sm text-gray-500">
                        Bật xác thực 2 yếu tố cho tài khoản admin
                      </p>
                    </div>
                    <Switch 
                      checked={settings.security.enableTwoFactor}
                      onCheckedChange={(checked) => handleSettingChange('security', 'enableTwoFactor', checked)}
                    />
                  </div>
                </div>

                <Button onClick={handleSaveSettings} disabled={saving} className="bg-red-600 hover:bg-red-700">
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Đang lưu...' : 'Lưu cài đặt bảo mật'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Settings */}
          <TabsContent value="content" className="space-y-6">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-red-600" />
                  Cài đặt nội dung
                </CardTitle>
                <CardDescription>
                  Quản lý nội dung và tương tác người dùng
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Tự động duyệt bài viết</Label>
                      <p className="text-sm text-gray-500">
                        Bài viết được tự động duyệt mà không cần phê duyệt thủ công
                      </p>
                    </div>
                    <Switch 
                      checked={settings.content.autoApprovePost}
                      onCheckedChange={(checked) => handleSettingChange('content', 'autoApprovePost', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Cho phép khách xem</Label>
                      <p className="text-sm text-gray-500">
                        Người dùng chưa đăng nhập có thể xem nội dung
                      </p>
                    </div>
                    <Switch 
                      checked={settings.content.allowGuestView}
                      onCheckedChange={(checked) => handleSettingChange('content', 'allowGuestView', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Hiển thị thống kê người dùng</Label>
                      <p className="text-sm text-gray-500">
                        Hiển thị số liệu thống kê về hoạt động của người dùng
                      </p>
                    </div>
                    <Switch 
                      checked={settings.content.showUserStats}
                      onCheckedChange={(checked) => handleSettingChange('content', 'showUserStats', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Cho phép bình luận</Label>
                      <p className="text-sm text-gray-500">
                        Người dùng có thể bình luận trên bài viết
                      </p>
                    </div>
                    <Switch 
                      checked={settings.content.enableComments}
                      onCheckedChange={(checked) => handleSettingChange('content', 'enableComments', checked)}
                    />
                  </div>
                </div>

                <Button onClick={handleSaveSettings} disabled={saving} className="bg-red-600 hover:bg-red-700">
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Đang lưu...' : 'Lưu cài đặt nội dung'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-red-600" />
                  Cài đặt thông báo
                </CardTitle>
                <CardDescription>
                  Cấu hình hệ thống thông báo và cảnh báo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Thông báo email</Label>
                      <p className="text-sm text-gray-500">
                        Gửi thông báo quan trọng qua email
                      </p>
                    </div>
                    <Switch 
                      checked={settings.notifications.emailNotifications}
                      onCheckedChange={(checked) => handleSettingChange('notifications', 'emailNotifications', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Cảnh báo hệ thống</Label>
                      <p className="text-sm text-gray-500">
                        Nhận cảnh báo về tình trạng hệ thống
                      </p>
                    </div>
                    <Switch 
                      checked={settings.notifications.systemAlerts}
                      onCheckedChange={(checked) => handleSettingChange('notifications', 'systemAlerts', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Hoạt động người dùng</Label>
                      <p className="text-sm text-gray-500">
                        Thông báo về hoạt động của người dùng
                      </p>
                    </div>
                    <Switch 
                      checked={settings.notifications.userActivity}
                      onCheckedChange={(checked) => handleSettingChange('notifications', 'userActivity', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Cảnh báo bảo mật</Label>
                      <p className="text-sm text-gray-500">
                        Cảnh báo về các vấn đề bảo mật
                      </p>
                    </div>
                    <Switch 
                      checked={settings.notifications.securityAlerts}
                      onCheckedChange={(checked) => handleSettingChange('notifications', 'securityAlerts', checked)}
                    />
                  </div>
                </div>

                <Button onClick={handleSaveSettings} disabled={saving} className="bg-red-600 hover:bg-red-700">
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Đang lưu...' : 'Lưu cài đặt thông báo'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Management */}
          <TabsContent value="system" className="space-y-6">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-red-600" />
                  Quản lý hệ thống
                </CardTitle>
                <CardDescription>
                  Sao lưu, khôi phục và bảo trì hệ thống
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      Sao lưu dữ liệu
                    </h4>
                    <p className="text-sm text-gray-500 mb-4">
                      Tạo bản sao lưu toàn bộ dữ liệu hệ thống
                    </p>
                    <Button 
                      onClick={handleBackupData} 
                      disabled={saving}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      {saving ? 'Đang sao lưu...' : 'Tạo bản sao lưu'}
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      Khôi phục dữ liệu
                    </h4>
                    <p className="text-sm text-gray-500 mb-4">
                      Khôi phục dữ liệu từ bản sao lưu
                    </p>
                    <Button variant="outline" className="w-full">
                      <Upload className="w-4 h-4 mr-2" />
                      Chọn file khôi phục
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <RefreshCw className="w-4 h-4" />
                    Bảo trì hệ thống
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button variant="outline" className="justify-start">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Xóa cache
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Tối ưu database
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <Eye className="w-4 h-4 mr-2" />
                      Xem log hệ thống
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="w-5 h-5" />
                  Vùng nguy hiểm
                </CardTitle>
                <CardDescription>
                  Các hành động có thể ảnh hưởng nghiêm trọng đến hệ thống
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                    <h4 className="font-medium text-red-800 mb-2">Reset toàn bộ hệ thống</h4>
                    <p className="text-sm text-red-600 mb-4">
                      Xóa toàn bộ dữ liệu và đặt lại hệ thống về trạng thái ban đầu. 
                      Hành động này không thể hoàn tác.
                    </p>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Reset hệ thống
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* System Information */}
        <Card className="shadow-lg border-0 mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="w-5 h-5 text-blue-600" />
              Thông tin hệ thống
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label className="text-sm font-medium text-gray-700">Phiên bản</Label>
                <p className="text-lg font-semibold">v1.0.0</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Database</Label>
                <p className="text-lg font-semibold">PostgreSQL</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Thời gian chạy</Label>
                <p className="text-lg font-semibold">24h 15m</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}