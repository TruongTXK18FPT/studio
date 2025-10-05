"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Lock, 
  Eye, 
  Database, 
  User, 
  Mail,
  Phone,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Info,
  Globe,
  Settings,
  FileText
} from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-xl mb-6">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Chính Sách Bảo Mật
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Cam kết bảo vệ thông tin cá nhân và quyền riêng tư của người dùng
          </p>
          <Badge className="bg-blue-100 text-blue-800 px-4 py-2 mt-4">
            Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN')}
          </Badge>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Introduction */}
          <Card className="border-2 border-blue-200 bg-white/95 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Info className="w-6 h-6 text-blue-600" />
                Giới Thiệu
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-lg text-gray-700 mb-4">
                Trang web "Hành Trình Bác Hồ" (hanhtrinhbacho.vn) cam kết bảo vệ quyền riêng tư và thông tin cá nhân 
                của người dùng. Chính sách bảo mật này giải thích cách chúng tôi thu thập, sử dụng, lưu trữ và bảo vệ 
                thông tin của bạn khi sử dụng dịch vụ của chúng tôi.
              </p>
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                <p className="text-blue-800 font-medium">
                  Bằng việc sử dụng trang web này, bạn đồng ý với các điều khoản trong chính sách bảo mật này.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Information Collection */}
          <Card className="border-2 border-green-200 bg-white/95 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Database className="w-6 h-6 text-green-600" />
                Thông Tin Chúng Tôi Thu Thập
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <User className="w-5 h-5 text-green-600" />
                    Thông Tin Cá Nhân
                  </h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Họ và tên</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Địa chỉ email</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Mật khẩu (được mã hóa)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Thông tin hồ sơ (tùy chọn)</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-blue-600" />
                    Thông Tin Sử Dụng
                  </h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Địa chỉ IP</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Loại trình duyệt và thiết bị</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Trang web đã truy cập</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Thời gian truy cập</span>
                    </li>
                  </ul>
                </div>

              </div>
            </CardContent>
          </Card>

          {/* How We Use Information */}
          <Card className="border-2 border-purple-200 bg-white/95 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Settings className="w-6 h-6 text-purple-600" />
                Cách Chúng Tôi Sử Dụng Thông Tin
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="space-y-4">
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-800 mb-2">🔐 Xác Thực & Bảo Mật</h4>
                    <ul className="text-purple-700 text-sm space-y-1">
                      <li>• Xác thực danh tính người dùng</li>
                      <li>• Bảo vệ tài khoản khỏi truy cập trái phép</li>
                      <li>• Phát hiện và ngăn chặn hoạt động đáng ngờ</li>
                    </ul>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">📊 Cải Thiện Dịch Vụ</h4>
                    <ul className="text-blue-700 text-sm space-y-1">
                      <li>• Phân tích cách sử dụng để tối ưu hóa</li>
                      <li>• Phát triển tính năng mới</li>
                      <li>• Cải thiện trải nghiệm người dùng</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">📧 Giao Tiếp</h4>
                    <ul className="text-green-700 text-sm space-y-1">
                      <li>• Gửi thông báo quan trọng</li>
                      <li>• Cập nhật về tính năng mới</li>
                      <li>• Hỗ trợ kỹ thuật khi cần thiết</li>
                    </ul>
                  </div>
                  
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-orange-800 mb-2">📈 Thống Kê & Báo Cáo</h4>
                    <ul className="text-orange-700 text-sm space-y-1">
                      <li>• Tạo báo cáo sử dụng (ẩn danh)</li>
                      <li>• Phân tích xu hướng giáo dục</li>
                      <li>• Đánh giá hiệu quả nội dung</li>
                    </ul>
                  </div>
                </div>

              </div>
            </CardContent>
          </Card>

          {/* Data Protection */}
          <Card className="border-2 border-red-200 bg-white/95 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Lock className="w-6 h-6 text-red-600" />
                Bảo Vệ Dữ Liệu
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Mã Hóa Dữ Liệu</h3>
                  <p className="text-gray-600 text-sm">
                    Tất cả dữ liệu nhạy cảm được mã hóa bằng các thuật toán bảo mật tiên tiến
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Bảo Mật Máy Chủ</h3>
                  <p className="text-gray-600 text-sm">
                    Máy chủ được bảo vệ bằng tường lửa và các biện pháp bảo mật đa lớp
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Eye className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Giám Sát Liên Tục</h3>
                  <p className="text-gray-600 text-sm">
                    Hệ thống được giám sát 24/7 để phát hiện và ngăn chặn các mối đe dọa
                  </p>
                </div>

              </div>
            </CardContent>
          </Card>

          {/* Cookies */}
          <Card className="border-2 border-yellow-200 bg-white/95 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <FileText className="w-6 h-6 text-yellow-600" />
                Chính Sách Cookie
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <p className="text-gray-700">
                  Chúng tôi sử dụng cookie và các công nghệ tương tự để cải thiện trải nghiệm của bạn trên trang web.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-yellow-800 mb-2">🍪 Cookie Cần Thiết</h4>
                    <p className="text-yellow-700 text-sm">
                      Để trang web hoạt động bình thường, bao gồm xác thực và bảo mật
                    </p>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">📊 Cookie Phân Tích</h4>
                    <p className="text-blue-700 text-sm">
                      Giúp chúng tôi hiểu cách người dùng tương tác với trang web
                    </p>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">⚙️ Cookie Chức Năng</h4>
                    <p className="text-green-700 text-sm">
                      Lưu trữ các tùy chọn và cài đặt cá nhân của bạn
                    </p>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-800 mb-2">🎯 Cookie Quảng Cáo</h4>
                    <p className="text-purple-700 text-sm">
                      Hiển thị quảng cáo phù hợp (nếu có) và đo lường hiệu quả
                    </p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 text-sm">
                    <strong>Lưu ý:</strong> Bạn có thể quản lý cookie thông qua cài đặt trình duyệt của mình. 
                    Tuy nhiên, việc tắt một số cookie có thể ảnh hưởng đến chức năng của trang web.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Rights */}
          <Card className="border-2 border-indigo-200 bg-white/95 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <User className="w-6 h-6 text-indigo-600" />
                Quyền Của Người Dùng
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">Quyền Truy Cập & Kiểm Soát</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Xem và cập nhật thông tin cá nhân</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Tải xuống dữ liệu cá nhân</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Xóa tài khoản và dữ liệu</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Từ chối xử lý dữ liệu</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">Quyền Bảo Vệ</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Được thông báo về việc thu thập dữ liệu</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Được bảo vệ khỏi xử lý bất hợp pháp</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Được bồi thường nếu có thiệt hại</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Khiếu nại với cơ quan có thẩm quyền</span>
                    </li>
                  </ul>
                </div>

              </div>
            </CardContent>
          </Card>

          {/* Data Sharing */}
          <Card className="border-2 border-gray-200 bg-white/95 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Globe className="w-6 h-6 text-gray-600" />
                Chia Sẻ Thông Tin
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <p className="text-gray-700">
                  Chúng tôi <strong>KHÔNG</strong> bán, cho thuê hoặc chia sẻ thông tin cá nhân của bạn với bên thứ ba, 
                  trừ các trường hợp sau:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
                    <h4 className="font-semibold text-red-800 mb-2">🚨 Yêu Cầu Pháp Lý</h4>
                    <p className="text-red-700 text-sm">
                      Khi có yêu cầu từ cơ quan pháp luật có thẩm quyền
                    </p>
                  </div>
                  
                  <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded-r-lg">
                    <h4 className="font-semibold text-orange-800 mb-2">🛡️ Bảo Vệ Quyền Lợi</h4>
                    <p className="text-orange-700 text-sm">
                      Để bảo vệ quyền lợi, tài sản hoặc an toàn của chúng tôi và người dùng
                    </p>
                  </div>
                  
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">🤝 Đối Tác Tin Cậy</h4>
                    <p className="text-blue-700 text-sm">
                      Với các đối tác dịch vụ đáng tin cậy (với sự đồng ý của bạn)
                    </p>
                  </div>
                  
                  <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
                    <h4 className="font-semibold text-green-800 mb-2">📊 Thống Kê Ẩn Danh</h4>
                    <p className="text-green-700 text-sm">
                      Chia sẻ dữ liệu thống kê đã được ẩn danh hóa
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact & Updates */}
          <Card className="border-2 border-teal-200 bg-white/95 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Mail className="w-6 h-6 text-teal-600" />
                Liên Hệ & Cập Nhật
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <p className="text-lg text-gray-700">
                  Nếu bạn có câu hỏi về chính sách bảo mật này hoặc muốn thực hiện quyền của mình:
                </p>
                
                <div className="flex justify-center gap-4 flex-wrap">
                  <Badge className="bg-teal-600 text-white px-4 py-2">
                    <Mail className="w-4 h-4 mr-2" />
                    privacy@hanhtrinhbacho.vn
                  </Badge>
                  <Badge className="bg-blue-600 text-white px-4 py-2">
                    <Phone className="w-4 h-4 mr-2" />
                    1900-xxxx
                  </Badge>
                </div>
                
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg max-w-2xl mx-auto">
                  <h4 className="font-semibold text-yellow-800 mb-2">📅 Cập Nhật Chính Sách</h4>
                  <p className="text-yellow-700 text-sm">
                    Chúng tôi có thể cập nhật chính sách bảo mật này theo thời gian. 
                    Mọi thay đổi sẽ được thông báo trên trang web và qua email.
                  </p>
                </div>
                
                <p className="text-sm text-gray-500">
                  Chúng tôi cam kết bảo vệ quyền riêng tư của bạn và sẽ phản hồi mọi yêu cầu trong vòng 30 ngày.
                </p>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
