'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { 
  User, 
  Settings as SettingsIcon, 
  Shield, 
  Bell, 
  Palette, 
  Download, 
  Trash2,
  Eye,
  EyeOff,
  Mail,
  Phone,
  Calendar,
  Globe,
  Lock,
  Save,
  UserCog,
  History,
  HelpCircle
} from 'lucide-react'
import Link from 'next/link'

interface UserData {
  id: string
  email: string
  name?: string
  phone?: string
  createdAt: string
  role: string
}

interface UserSettings {
  notifications: {
    email: boolean
    quiz: boolean
    community: boolean
    timeline: boolean
  }
  privacy: {
    showProfile: boolean
    showActivity: boolean
    showStats: boolean
  }
  preferences: {
    theme: string
    language: string
    timezone: string
  }
}

export default function SettingsPage() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [settings, setSettings] = useState<UserSettings>({
    notifications: {
      email: true,
      quiz: true,
      community: true,
      timeline: false
    },
    privacy: {
      showProfile: true,
      showActivity: true,
      showStats: true
    },
    preferences: {
      theme: 'light',
      language: 'vi',
      timezone: 'Asia/Ho_Chi_Minh'
    }
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  })

  useEffect(() => {
    checkAuthAndFetchData()
  }, [])

  const checkAuthAndFetchData = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (!response.ok) {
        window.location.href = '/login'
        return
      }
      
      const data = await response.json()
      setUserData(data.user)
    } catch (error) {
      console.error('Auth check failed:', error)
      window.location.href = '/login'
    } finally {
      setLoading(false)
    }
  }

  const handleSettingChange = (category: keyof UserSettings, key: string, value: any) => {
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      // Here you would make actual API call to save settings
      console.log('Settings saved:', settings)
    } catch (error) {
      console.error('Failed to save settings:', error)
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordChange = async () => {
    if (passwords.new !== passwords.confirm) {
      alert('Mật khẩu mới không khớp!')
      return
    }
    
    setSaving(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Password changed')
      setPasswords({ current: '', new: '', confirm: '' })
      alert('Đổi mật khẩu thành công!')
    } catch (error) {
      console.error('Failed to change password:', error)
      alert('Có lỗi xảy ra khi đổi mật khẩu!')
    } finally {
      setSaving(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 p-4">
        <div className="container mx-auto max-w-4xl">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-300 rounded w-1/3"></div>
            <div className="h-96 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <SettingsIcon className="w-8 h-8 text-red-600" />
            Cài đặt tài khoản
          </h1>
          <p className="text-gray-600">
            Quản lý thông tin cá nhân, bảo mật và tùy chọn của bạn
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white shadow-sm">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Thông tin
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Bảo mật
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Thông báo
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Tùy chọn
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-red-600" />
                  Thông tin cá nhân
                </CardTitle>
                <CardDescription>
                  Cập nhật thông tin cá nhân của bạn
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </Label>
                    <Input 
                      id="email" 
                      value={userData?.email || ''} 
                      disabled 
                      className="bg-gray-50"
                    />
                    <p className="text-sm text-gray-500">Email không thể thay đổi</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <UserCog className="w-4 h-4" />
                      Họ và tên
                    </Label>
                    <Input 
                      id="name" 
                      placeholder="Nhập họ và tên"
                      value={userData?.name || ''}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Số điện thoại
                    </Label>
                    <Input 
                      id="phone" 
                      placeholder="Nhập số điện thoại"
                      type="tel"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Ngày tham gia
                    </Label>
                    <div className="p-3 bg-gray-50 rounded-md text-sm">
                      {userData ? formatDate(userData.createdAt) : 'Không xác định'}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-800">
                      {userData?.role === 'ADMIN' ? 'Quản trị viên' : 'Thành viên'}
                    </Badge>
                  </div>
                  <Button onClick={handleSaveSettings} disabled={saving} className="bg-red-600 hover:bg-red-700">
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-red-600" />
                  Đổi mật khẩu
                </CardTitle>
                <CardDescription>
                  Cập nhật mật khẩu để bảo vệ tài khoản của bạn
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Mật khẩu hiện tại</Label>
                    <div className="relative">
                      <Input 
                        id="current-password"
                        type={showPassword ? 'text' : 'password'}
                        value={passwords.current}
                        onChange={(e) => setPasswords(prev => ({ ...prev, current: e.target.value }))}
                        placeholder="Nhập mật khẩu hiện tại"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">Mật khẩu mới</Label>
                    <Input 
                      id="new-password"
                      type={showPassword ? 'text' : 'password'}
                      value={passwords.new}
                      onChange={(e) => setPasswords(prev => ({ ...prev, new: e.target.value }))}
                      placeholder="Nhập mật khẩu mới"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Xác nhận mật khẩu mới</Label>
                    <Input 
                      id="confirm-password"
                      type={showPassword ? 'text' : 'password'}
                      value={passwords.confirm}
                      onChange={(e) => setPasswords(prev => ({ ...prev, confirm: e.target.value }))}
                      placeholder="Nhập lại mật khẩu mới"
                    />
                  </div>
                </div>
                <Button 
                  onClick={handlePasswordChange} 
                  disabled={saving || !passwords.current || !passwords.new || !passwords.confirm}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  {saving ? 'Đang cập nhật...' : 'Đổi mật khẩu'}
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5 text-red-600" />
                  Hoạt động gần đây
                </CardTitle>
                <CardDescription>
                  Theo dõi các hoạt động đăng nhập và bảo mật
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">Đăng nhập thành công</p>
                      <p className="text-sm text-gray-500">Hôm nay, 14:30</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Thành công</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">Cập nhật thông tin</p>
                      <p className="text-sm text-gray-500">2 ngày trước</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">Cập nhật</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-red-600" />
                  Tùy chọn thông báo
                </CardTitle>
                <CardDescription>
                  Chọn loại thông báo bạn muốn nhận
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Thông báo email</Label>
                      <p className="text-sm text-gray-500">
                        Nhận thông báo qua email về các hoạt động quan trọng
                      </p>
                    </div>
                    <Switch 
                      checked={settings.notifications.email}
                      onCheckedChange={(checked) => handleSettingChange('notifications', 'email', checked)}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Thông báo quiz mới</Label>
                      <p className="text-sm text-gray-500">
                        Được thông báo khi có bài quiz mới
                      </p>
                    </div>
                    <Switch 
                      checked={settings.notifications.quiz}
                      onCheckedChange={(checked) => handleSettingChange('notifications', 'quiz', checked)}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Hoạt động cộng đồng</Label>
                      <p className="text-sm text-gray-500">
                        Thông báo về bình luận và tương tác trên bài viết của bạn
                      </p>
                    </div>
                    <Switch 
                      checked={settings.notifications.community}
                      onCheckedChange={(checked) => handleSettingChange('notifications', 'community', checked)}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Cập nhật timeline</Label>
                      <p className="text-sm text-gray-500">
                        Thông báo khi có sự kiện mới được thêm vào dòng thời gian
                      </p>
                    </div>
                    <Switch 
                      checked={settings.notifications.timeline}
                      onCheckedChange={(checked) => handleSettingChange('notifications', 'timeline', checked)}
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

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5 text-red-600" />
                  Tùy chọn hiển thị
                </CardTitle>
                <CardDescription>
                  Tùy chỉnh giao diện và ngôn ngữ
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      Ngôn ngữ
                    </Label>
                    <select 
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={settings.preferences.language}
                      onChange={(e) => handleSettingChange('preferences', 'language', e.target.value)}
                    >
                      <option value="vi">Tiếng Việt</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Múi giờ</Label>
                    <select 
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={settings.preferences.timezone}
                      onChange={(e) => handleSettingChange('preferences', 'timezone', e.target.value)}
                    >
                      <option value="Asia/Ho_Chi_Minh">Việt Nam (GMT+7)</option>
                      <option value="UTC">UTC (GMT+0)</option>
                    </select>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Quyền riêng tư</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Hiển thị thông tin cá nhân</Label>
                        <p className="text-sm text-gray-500">
                          Cho phép người khác xem thông tin cơ bản của bạn
                        </p>
                      </div>
                      <Switch 
                        checked={settings.privacy.showProfile}
                        onCheckedChange={(checked) => handleSettingChange('privacy', 'showProfile', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Hiển thị hoạt động</Label>
                        <p className="text-sm text-gray-500">
                          Cho phép người khác xem hoạt động học tập của bạn
                        </p>
                      </div>
                      <Switch 
                        checked={settings.privacy.showActivity}
                        onCheckedChange={(checked) => handleSettingChange('privacy', 'showActivity', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Hiển thị thống kê</Label>
                        <p className="text-sm text-gray-500">
                          Cho phép người khác xem thống kê điểm số và tiến độ
                        </p>
                      </div>
                      <Switch 
                        checked={settings.privacy.showStats}
                        onCheckedChange={(checked) => handleSettingChange('privacy', 'showStats', checked)}
                      />
                    </div>
                  </div>
                </div>

                <Button onClick={handleSaveSettings} disabled={saving} className="bg-red-600 hover:bg-red-700">
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Đang lưu...' : 'Lưu tùy chọn'}
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <Trash2 className="w-5 h-5" />
                  Vùng nguy hiểm
                </CardTitle>
                <CardDescription>
                  Các hành động không thể hoàn tác
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                    <h4 className="font-medium text-red-800 mb-2">Xóa tài khoản</h4>
                    <p className="text-sm text-red-600 mb-4">
                      Hành động này sẽ xóa vĩnh viễn tài khoản và toàn bộ dữ liệu của bạn. 
                      Không thể hoàn tác sau khi thực hiện.
                    </p>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Xóa tài khoản
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Help Section */}
        <Card className="shadow-lg border-0 mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-blue-600" />
              Cần hỗ trợ?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button asChild variant="outline" className="justify-start">
                <Link href="/help">
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Trung tâm hỗ trợ
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-start">
                <Link href="/contact">
                  <Mail className="w-4 h-4 mr-2" />
                  Liên hệ
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-start">
                <Link href="/privacy">
                  <Shield className="w-4 h-4 mr-2" />
                  Chính sách bảo mật
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}