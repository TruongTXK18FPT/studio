"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Scale, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Info,
  Users,
  Globe,
  Mail,
  Phone,
  Calendar,
  BookOpen,
  Heart,
  Star
} from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-orange-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-600 to-orange-600 rounded-2xl shadow-xl mb-6">
            <Scale className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent mb-4">
            Điều Khoản Sử Dụng
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Các điều khoản và điều kiện sử dụng trang web "Hành Trình Bác Hồ"
          </p>
          <Badge className="bg-red-100 text-red-800 px-4 py-2 mt-4">
            Có hiệu lực từ: {new Date().toLocaleDateString('vi-VN')}
          </Badge>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Introduction */}
          <Card className="border-2 border-red-200 bg-white/95 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Info className="w-6 h-6 text-red-600" />
                Giới Thiệu
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-lg text-gray-700 mb-4">
                Chào mừng bạn đến với trang web "Hành Trình Bác Hồ" (hanhtrinhbacho.vn). 
                Những điều khoản sử dụng này ("Điều khoản") quy định việc bạn sử dụng trang web và dịch vụ của chúng tôi.
              </p>
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
                <p className="text-red-800 font-medium">
                  Bằng việc truy cập hoặc sử dụng trang web này, bạn đồng ý tuân thủ và bị ràng buộc bởi các điều khoản này.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Acceptance of Terms */}
          <Card className="border-2 border-blue-200 bg-white/95 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <CheckCircle className="w-6 h-6 text-blue-600" />
                Chấp Nhận Điều Khoản
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <p className="text-gray-700">
                  Khi bạn sử dụng trang web của chúng tôi, bạn xác nhận rằng:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">✅ Tuân Thủ Pháp Luật</h4>
                    <p className="text-blue-700 text-sm">
                      Bạn đủ tuổi và có quyền hợp pháp để tham gia các hoạt động trên trang web
                    </p>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">📋 Đọc & Hiểu</h4>
                    <p className="text-green-700 text-sm">
                      Bạn đã đọc, hiểu và đồng ý với tất cả các điều khoản trong tài liệu này
                    </p>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-800 mb-2">🔄 Cập Nhật</h4>
                    <p className="text-purple-700 text-sm">
                      Bạn sẽ kiểm tra thường xuyên để cập nhật các thay đổi về điều khoản
                    </p>
                  </div>
                  
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-orange-800 mb-2">🤝 Hợp Tác</h4>
                    <p className="text-orange-700 text-sm">
                      Bạn sẽ hợp tác và tuân thủ các quy tắc ứng xử của cộng đồng
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Permitted Use */}
          <Card className="border-2 border-green-200 bg-white/95 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <BookOpen className="w-6 h-6 text-green-600" />
                Sử Dụng Được Phép
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <p className="text-gray-700">
                  Bạn được phép sử dụng trang web cho các mục đích sau:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <Heart className="w-5 h-5 text-green-600" />
                      Mục Đích Giáo Dục
                    </h3>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Học tập và nghiên cứu về lịch sử Việt Nam</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Tìm hiểu về cuộc đời và sự nghiệp Bác Hồ</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Sử dụng tài liệu cho mục đích học tập</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Tham gia các hoạt động giáo dục tương tác</span>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <Users className="w-5 h-5 text-blue-600" />
                      Tương Tác Cộng Đồng
                    </h3>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Chia sẻ kiến thức và kinh nghiệm</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Thảo luận về các chủ đề lịch sử</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Đóng góp nội dung có giá trị</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Hỗ trợ các thành viên khác</span>
                      </li>
                    </ul>
                  </div>

                </div>
              </div>
            </CardContent>
          </Card>

          {/* Prohibited Use */}
          <Card className="border-2 border-red-200 bg-white/95 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <XCircle className="w-6 h-6 text-red-600" />
                Sử Dụng Bị Cấm
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <p className="text-gray-700">
                  Bạn <strong>KHÔNG ĐƯỢC PHÉP</strong> sử dụng trang web cho các mục đích sau:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
                    <h4 className="font-semibold text-red-800 mb-2">🚫 Hoạt Động Bất Hợp Pháp</h4>
                    <ul className="text-red-700 text-sm space-y-1">
                      <li>• Vi phạm pháp luật Việt Nam</li>
                      <li>• Xâm phạm quyền sở hữu trí tuệ</li>
                      <li>• Phát tán nội dung độc hại</li>
                      <li>• Hoạt động lừa đảo hoặc gian lận</li>
                    </ul>
                  </div>
                  
                  <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded-r-lg">
                    <h4 className="font-semibold text-orange-800 mb-2">⚠️ Nội Dung Không Phù Hợp</h4>
                    <ul className="text-orange-700 text-sm space-y-1">
                      <li>• Nội dung khiêu dâm hoặc bạo lực</li>
                      <li>• Thông tin sai lệch về lịch sử</li>
                      <li>• Nội dung phân biệt đối xử</li>
                      <li>• Spam hoặc quảng cáo không mong muốn</li>
                    </ul>
                  </div>
                  
                  <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-r-lg">
                    <h4 className="font-semibold text-purple-800 mb-2">🔧 Can Thiệp Hệ Thống</h4>
                    <ul className="text-purple-700 text-sm space-y-1">
                      <li>• Hacking hoặc tấn công hệ thống</li>
                      <li>• Phá vỡ bảo mật trang web</li>
                      <li>• Sử dụng bot hoặc script tự động</li>
                      <li>• Tải quá mức hoặc làm chậm dịch vụ</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 border-l-4 border-gray-400 p-4 rounded-r-lg">
                    <h4 className="font-semibold text-gray-800 mb-2">👥 Ứng Xử Không Phù Hợp</h4>
                    <ul className="text-gray-700 text-sm space-y-1">
                      <li>• Quấy rối hoặc đe dọa người khác</li>
                      <li>• Giả mạo danh tính</li>
                      <li>• Vi phạm quyền riêng tư</li>
                      <li>• Hành vi không tôn trọng cộng đồng</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Intellectual Property */}
          <Card className="border-2 border-purple-200 bg-white/95 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Shield className="w-6 h-6 text-purple-600" />
                Sở Hữu Trí Tuệ
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <p className="text-gray-700">
                  Tất cả nội dung trên trang web, bao gồm nhưng không giới hạn:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">📚 Nội Dung Được Bảo Vệ</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start gap-2">
                        <Star className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Văn bản, hình ảnh, video</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Star className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Thiết kế giao diện và logo</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Star className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Phần mềm và mã nguồn</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Star className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Cơ sở dữ liệu và tư liệu</span>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">⚖️ Quyền Sử Dụng</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Sử dụng cho mục đích giáo dục</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Trích dẫn với ghi nguồn</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Không được sao chép thương mại</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Không được phân phối lại</span>
                      </li>
                    </ul>
                  </div>

                </div>
                
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                  <h4 className="font-semibold text-yellow-800 mb-2">📝 Lưu Ý Quan Trọng</h4>
                  <p className="text-yellow-700 text-sm">
                    Một số tư liệu lịch sử có thể thuộc về các tổ chức khác. Chúng tôi sử dụng chúng với sự cho phép 
                    hoặc theo quy định của pháp luật về sử dụng hợp lý cho mục đích giáo dục.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Content */}
          <Card className="border-2 border-blue-200 bg-white/95 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Users className="w-6 h-6 text-blue-600" />
                Nội Dung Người Dùng
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <p className="text-gray-700">
                  Khi bạn đóng góp nội dung lên trang web (bài viết, bình luận, hình ảnh):
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">✅ Trách Nhiệm Của Bạn</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Đảm bảo nội dung chính xác và phù hợp</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Không vi phạm quyền sở hữu trí tuệ</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Tôn trọng quyền riêng tư của người khác</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Chịu trách nhiệm về nội dung đăng tải</span>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">🛡️ Quyền Của Chúng Tôi</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start gap-2">
                        <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Kiểm duyệt nội dung trước khi hiển thị</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Xóa nội dung vi phạm điều khoản</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Sử dụng nội dung để cải thiện dịch vụ</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Chia sẻ nội dung phù hợp với cộng đồng</span>
                      </li>
                    </ul>
                  </div>

                </div>
              </div>
            </CardContent>
          </Card>

          {/* Disclaimers */}
          <Card className="border-2 border-yellow-200 bg-white/95 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
                Tuyên Bố Miễn Trừ Trách Nhiệm
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                    <h4 className="font-semibold text-yellow-800 mb-2">📚 Nội Dung Giáo Dục</h4>
                    <p className="text-yellow-700 text-sm">
                      Mặc dù chúng tôi cố gắng đảm bảo tính chính xác, nội dung chỉ mang tính chất giáo dục 
                      và không thay thế cho nghiên cứu chuyên sâu.
                    </p>
                  </div>
                  
                  <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded-r-lg">
                    <h4 className="font-semibold text-orange-800 mb-2">🔗 Liên Kết Bên Ngoài</h4>
                    <p className="text-orange-700 text-sm">
                      Chúng tôi không chịu trách nhiệm về nội dung của các trang web bên ngoài 
                      được liên kết từ trang web của chúng tôi.
                    </p>
                  </div>
                  
                  <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
                    <h4 className="font-semibold text-red-800 mb-2">⚡ Gián Đoạn Dịch Vụ</h4>
                    <p className="text-red-700 text-sm">
                      Chúng tôi không đảm bảo trang web sẽ hoạt động liên tục không gián đoạn 
                      do bảo trì hoặc sự cố kỹ thuật.
                    </p>
                  </div>
                  
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">💻 Tương Thích Thiết Bị</h4>
                    <p className="text-blue-700 text-sm">
                      Chúng tôi cố gắng đảm bảo tương thích với nhiều thiết bị, nhưng không thể 
                      đảm bảo hoạt động hoàn hảo trên mọi thiết bị.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Limitation of Liability */}
          <Card className="border-2 border-gray-200 bg-white/95 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Shield className="w-6 h-6 text-gray-600" />
                Giới Hạn Trách Nhiệm
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <p className="text-gray-700">
                  Trong phạm vi tối đa được pháp luật cho phép:
                </p>
                
                <div className="bg-gray-50 border-l-4 border-gray-400 p-4 rounded-r-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">⚖️ Giới Hạn Trách Nhiệm</h4>
                  <ul className="text-gray-700 text-sm space-y-1">
                    <li>• Chúng tôi không chịu trách nhiệm cho bất kỳ thiệt hại trực tiếp, gián tiếp nào</li>
                    <li>• Không chịu trách nhiệm về mất dữ liệu, lợi nhuận hoặc cơ hội kinh doanh</li>
                    <li>• Trách nhiệm tối đa không vượt quá số tiền bạn đã trả cho dịch vụ (nếu có)</li>
                    <li>• Không chịu trách nhiệm về hành vi của người dùng khác</li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">🛡️ Bảo Vệ Pháp Lý</h4>
                  <p className="text-blue-700 text-sm">
                    Bạn đồng ý bảo vệ và bồi thường cho chúng tôi khỏi mọi khiếu nại, thiệt hại 
                    phát sinh từ việc bạn vi phạm các điều khoản này hoặc sử dụng trái phép dịch vụ.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Termination */}
          <Card className="border-2 border-red-200 bg-white/95 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <XCircle className="w-6 h-6 text-red-600" />
                Chấm Dứt Dịch Vụ
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <p className="text-gray-700">
                  Chúng tôi có quyền chấm dứt hoặc tạm ngưng quyền truy cập của bạn trong các trường hợp:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-red-800 mb-2">🚫 Vi Phạm Điều Khoản</h4>
                    <ul className="text-red-700 text-sm space-y-1">
                      <li>• Vi phạm các điều khoản sử dụng</li>
                      <li>• Hoạt động bất hợp pháp</li>
                      <li>• Gây hại cho cộng đồng</li>
                      <li>• Lạm dụng hệ thống</li>
                    </ul>
                  </div>
                  
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-orange-800 mb-2">⚙️ Lý Do Kỹ Thuật</h4>
                    <ul className="text-orange-700 text-sm space-y-1">
                      <li>• Bảo trì hệ thống</li>
                      <li>• Cập nhật dịch vụ</li>
                      <li>• Sự cố bảo mật</li>
                      <li>• Yêu cầu pháp lý</li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                  <h4 className="font-semibold text-yellow-800 mb-2">📋 Quy Trình Chấm Dứt</h4>
                  <p className="text-yellow-700 text-sm">
                    Trước khi chấm dứt, chúng tôi sẽ thông báo trước (trừ trường hợp khẩn cấp) 
                    và cho bạn cơ hội khắc phục vi phạm (nếu có thể).
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Changes to Terms */}
          <Card className="border-2 border-indigo-200 bg-white/95 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Calendar className="w-6 h-6 text-indigo-600" />
                Thay Đổi Điều Khoản
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <p className="text-gray-700">
                  Chúng tôi có thể cập nhật các điều khoản này theo thời gian để phản ánh:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-indigo-800 mb-2">🔄 Cập Nhật Dịch Vụ</h4>
                    <ul className="text-indigo-700 text-sm space-y-1">
                      <li>• Tính năng mới</li>
                      <li>• Cải tiến dịch vụ</li>
                      <li>• Thay đổi công nghệ</li>
                      <li>• Phản hồi người dùng</li>
                    </ul>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-800 mb-2">⚖️ Yêu Cầu Pháp Lý</h4>
                    <ul className="text-purple-700 text-sm space-y-1">
                      <li>• Thay đổi luật pháp</li>
                      <li>• Quy định mới</li>
                      <li>• Yêu cầu cơ quan</li>
                      <li>• Chuẩn mực quốc tế</li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">📢 Thông Báo Thay Đổi</h4>
                  <p className="text-blue-700 text-sm">
                    Mọi thay đổi quan trọng sẽ được thông báo trước ít nhất 30 ngày thông qua 
                    email, thông báo trên trang web hoặc các kênh liên lạc khác.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="border-2 border-teal-200 bg-white/95 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Mail className="w-6 h-6 text-teal-600" />
                Thông Tin Liên Hệ
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <p className="text-lg text-gray-700">
                  Nếu bạn có câu hỏi về các điều khoản này hoặc cần hỗ trợ:
                </p>
                
                <div className="flex justify-center gap-4 flex-wrap">
                  <Badge className="bg-teal-600 text-white px-4 py-2">
                    <Mail className="w-4 h-4 mr-2" />
                    legal@hanhtrinhbacho.vn
                  </Badge>
                  <Badge className="bg-blue-600 text-white px-4 py-2">
                    <Phone className="w-4 h-4 mr-2" />
                    1900-xxxx
                  </Badge>
                </div>
                
                <div className="bg-teal-50 border-l-4 border-teal-400 p-4 rounded-r-lg max-w-2xl mx-auto">
                  <h4 className="font-semibold text-teal-800 mb-2">🏛️ Địa Chỉ Văn Phòng</h4>
                  <p className="text-teal-700 text-sm">
                    Trung tâm Giáo dục Lịch sử Việt Nam<br/>
                    123 Đường Lịch Sử, Quận 1, TP. Hồ Chí Minh<br/>
                    Việt Nam
                  </p>
                </div>
                
                <p className="text-sm text-gray-500">
                  Chúng tôi cam kết phản hồi mọi yêu cầu trong vòng 5 ngày làm việc.
                </p>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
