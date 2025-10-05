"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Users, 
  MessageSquare, 
  Globe, 
  Shield, 
  Heart,
  Star,
  CheckCircle,
  AlertTriangle,
  Info,
  Map,
  Building,
  Clock
} from "lucide-react";

export default function GuidelinesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-600 to-orange-600 rounded-2xl shadow-xl mb-6">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent mb-4">
            Hướng Dẫn Sử Dụng
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Khám phá và sử dụng hiệu quả các tính năng của trang web "Hành Trình Bác Hồ"
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Overview */}
          <Card className="border-2 border-red-200 bg-white/95 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Info className="w-6 h-6 text-red-600" />
                Tổng Quan Về Trang Web
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-lg text-gray-700 mb-4">
                "Hành Trình Bác Hồ" là một trang web giáo dục tương tác, cung cấp thông tin chi tiết về cuộc đời, 
                sự nghiệp và hành trình tìm đường cứu nước của Chủ tịch Hồ Chí Minh.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">🎯 Mục Tiêu</h3>
                  <p className="text-blue-700 text-sm">
                    Giáo dục thế hệ trẻ về lịch sử, tư tưởng và đạo đức của Bác Hồ
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">👥 Đối Tượng</h3>
                  <p className="text-green-700 text-sm">
                    Học sinh, sinh viên, giáo viên và tất cả những ai quan tâm đến lịch sử Việt Nam
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features Guide */}
          <Card className="border-2 border-blue-200 bg-white/95 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Star className="w-6 h-6 text-blue-600" />
                Hướng Dẫn Sử Dụng Các Tính Năng
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Timeline */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Clock className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">Dòng Thời Gian</h3>
                  </div>
                  <div className="pl-11 space-y-2">
                    <p className="text-gray-600 text-sm">
                      • Khám phá các sự kiện quan trọng trong cuộc đời Bác Hồ
                    </p>
                    <p className="text-gray-600 text-sm">
                      • Sử dụng bộ lọc để tìm kiếm theo năm, địa điểm, loại sự kiện
                    </p>
                    <p className="text-gray-600 text-sm">
                      • Click vào từng sự kiện để xem chi tiết và tư liệu
                    </p>
                  </div>
                </div>

                {/* Gallery */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <BookOpen className="w-5 h-5 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">Thư Viện</h3>
                  </div>
                  <div className="pl-11 space-y-2">
                    <p className="text-gray-600 text-sm">
                      • Xem bộ sưu tập hình ảnh, tài liệu quý giá
                    </p>
                    <p className="text-gray-600 text-sm">
                      • Sử dụng lightbox để xem ảnh với độ phân giải cao
                    </p>
                    <p className="text-gray-600 text-sm">
                      • Tìm kiếm theo từ khóa hoặc danh mục
                    </p>
                  </div>
                </div>

                {/* Letters */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <MessageSquare className="w-5 h-5 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">Thư & Văn Bản</h3>
                  </div>
                  <div className="pl-11 space-y-2">
                    <p className="text-gray-600 text-sm">
                      • Đọc các bức thư, bài viết của Bác Hồ
                    </p>
                    <p className="text-gray-600 text-sm">
                      • Tìm hiểu tư tưởng và phong cách viết của Người
                    </p>
                    <p className="text-gray-600 text-sm">
                      • Lưu lại những đoạn văn yêu thích
                    </p>
                  </div>
                </div>

                {/* World Map */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Map className="w-5 h-5 text-orange-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">Bản Đồ Thế Giới</h3>
                  </div>
                  <div className="pl-11 space-y-2">
                    <p className="text-gray-600 text-sm">
                      • Tương tác với bản đồ hành trình của Bác Hồ
                    </p>
                    <p className="text-gray-600 text-sm">
                      • Click vào các quốc gia để trả lời câu hỏi lịch sử
                    </p>
                    <p className="text-gray-600 text-sm">
                      • Sử dụng zoom và pan để khám phá chi tiết
                    </p>
                  </div>
                </div>

                {/* Virtual Museum */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <Building className="w-5 h-5 text-indigo-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">Bảo Tàng Ảo</h3>
                  </div>
                  <div className="pl-11 space-y-2">
                    <p className="text-gray-600 text-sm">
                      • Trải nghiệm bảo tàng 3D tương tác
                    </p>
                    <p className="text-gray-600 text-sm">
                      • Khám phá các hiện vật và tư liệu lịch sử
                    </p>
                    <p className="text-gray-600 text-sm">
                      • Tìm hiểu về cuộc sống và hoạt động của Bác Hồ
                    </p>
                  </div>
                </div>

                {/* Community */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-pink-100 rounded-lg">
                      <Users className="w-5 h-5 text-pink-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">Cộng Đồng</h3>
                  </div>
                  <div className="pl-11 space-y-2">
                    <p className="text-gray-600 text-sm">
                      • Chia sẻ bài viết và thảo luận
                    </p>
                    <p className="text-gray-600 text-sm">
                      • Tương tác với các thành viên khác
                    </p>
                    <p className="text-gray-600 text-sm">
                      • Đóng góp tư liệu và kiến thức
                    </p>
                  </div>
                </div>

                {/* Quiz */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <Shield className="w-5 h-5 text-red-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">Quiz Lịch Sử</h3>
                  </div>
                  <div className="pl-11 space-y-2">
                    <p className="text-gray-600 text-sm">
                      • Kiểm tra kiến thức về Bác Hồ và lịch sử Việt Nam
                    </p>
                    <p className="text-gray-600 text-sm">
                      • Chọn độ khó phù hợp với trình độ
                    </p>
                    <p className="text-gray-600 text-sm">
                      • Xem kết quả và giải thích chi tiết
                    </p>
                  </div>
                </div>

              </div>
            </CardContent>
          </Card>

          {/* Best Practices */}
          <Card className="border-2 border-green-200 bg-white/95 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <CheckCircle className="w-6 h-6 text-green-600" />
                Lời Khuyên Sử Dụng Hiệu Quả
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    Cho Học Sinh & Sinh Viên
                  </h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Bắt đầu với Dòng Thời Gian để có cái nhìn tổng quan</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Sử dụng Quiz để kiểm tra và củng cố kiến thức</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Tham gia Cộng Đồng để thảo luận và học hỏi</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Lưu lại những tư liệu quan trọng cho việc học tập</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-500" />
                    Cho Giáo Viên & Nhà Nghiên Cứu
                  </h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Sử dụng Thư Viện để tìm tư liệu giảng dạy</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Khám phá Bảo Tàng Ảo để có trải nghiệm đa chiều</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Đóng góp nội dung và chia sẻ kiến thức</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Sử dụng Bản Đồ Thế Giới cho bài giảng tương tác</span>
                    </li>
                  </ul>
                </div>

              </div>
            </CardContent>
          </Card>

          {/* Important Notes */}
          <Card className="border-2 border-yellow-200 bg-white/95 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
                Lưu Ý Quan Trọng
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">📚 Tính Chính Xác Lịch Sử</h4>
                  <p className="text-blue-700 text-sm">
                    Tất cả thông tin trên trang web đều được kiểm chứng từ các nguồn tư liệu chính thức và đáng tin cậy.
                  </p>
                </div>
                
                <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
                  <h4 className="font-semibold text-green-800 mb-2">🔄 Cập Nhật Thường Xuyên</h4>
                  <p className="text-green-700 text-sm">
                    Nội dung được cập nhật và bổ sung thường xuyên để đảm bảo tính đầy đủ và chính xác.
                  </p>
                </div>
                
                <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-r-lg">
                  <h4 className="font-semibold text-purple-800 mb-2">🤝 Tôn Trọng Cộng Đồng</h4>
                  <p className="font-semibold text-purple-700 text-sm">
                    Khi tham gia thảo luận, hãy tôn trọng các thành viên khác và tuân thủ các quy tắc ứng xử.
                  </p>
                </div>
                
                <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
                  <h4 className="font-semibold text-red-800 mb-2">🔒 Bảo Mật Thông Tin</h4>
                  <p className="text-red-700 text-sm">
                    Chúng tôi cam kết bảo vệ thông tin cá nhân của người dùng theo chính sách bảo mật.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card className="border-2 border-indigo-200 bg-white/95 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Globe className="w-6 h-6 text-indigo-600" />
                Liên Hệ & Hỗ Trợ
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-lg text-gray-700 mb-4">
                  Nếu bạn có câu hỏi, góp ý hoặc cần hỗ trợ, vui lòng liên hệ với chúng tôi:
                </p>
                <div className="flex justify-center gap-4">
                  <Badge className="bg-blue-600 text-white px-4 py-2">
                    📧 Email: support@hanhtrinhbacho.vn
                  </Badge>
                  <Badge className="bg-green-600 text-white px-4 py-2">
                    📞 Hotline: 1900-xxxx
                  </Badge>
                </div>
                <p className="text-sm text-gray-500 mt-4">
                  Chúng tôi sẽ phản hồi trong vòng 24 giờ làm việc.
                </p>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
