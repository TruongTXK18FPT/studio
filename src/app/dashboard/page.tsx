import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default async function DashboardPage() {
  const session = await getSession()

  if (!session) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-ivory bg-lotus-pattern p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-heritage mb-2">
            Trang cá nhân
          </h1>
          <p className="text-gray-600 leading-relaxed">
            Chào mừng bạn đến với trang cá nhân của mình
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="shadow-lg border border-gray-200">
            <CardHeader>
              <CardTitle className="text-heritage">Thông tin tài khoản</CardTitle>
              <CardDescription>
                Chi tiết về tài khoản của bạn
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Email:</p>
                <p className="text-gray-900">{session.email}</p>
              </div>
              {session.name && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Họ và tên:</p>
                  <p className="text-gray-900">{session.name}</p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Trạng thái:</p>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Đã xác thực
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border border-gray-200">
            <CardHeader>
              <CardTitle className="text-heritage">Hoạt động gần đây</CardTitle>
              <CardDescription>
                Các hoạt động của bạn trên hệ thống
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <p>Chưa có hoạt động nào</p>
                <p className="text-sm mt-2">
                  Hãy bắt đầu khám phá các tính năng của chúng tôi
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border border-gray-200">
            <CardHeader>
              <CardTitle className="text-heritage">Đóng góp của bạn</CardTitle>
              <CardDescription>
                Nội dung bạn đã chia sẻ với cộng đồng
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <p>Chưa có đóng góp nào</p>
                <Button asChild className="mt-4 bg-heritage hover:bg-heritage/90">
                  <a href="/community/submit">Đóng góp ngay</a>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border border-gray-200">
            <CardHeader>
              <CardTitle className="text-heritage">Cài đặt</CardTitle>
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
      </div>
    </div>
  )
}
