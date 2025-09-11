import type { Metadata } from 'next';
import { CommunityForm } from '@/components/community/CommunityForm';

export const metadata: Metadata = {
  title: 'Chia sẻ bài viết',
  description: 'Đóng góp bài viết, tư liệu hoặc câu chuyện của bạn cho cộng đồng.',
};

export default function SubmitPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/5 via-red-800/5 to-red-700/5"></div>
      
      <div className="relative">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                Đóng Góp Bài Viết
              </h1>
              <p className="text-xl md:text-2xl text-red-100 max-w-3xl mx-auto leading-relaxed">
                Chia sẻ những câu chuyện, tư liệu quý báu về Chủ tịch Hồ Chí Minh
              </p>
              <div className="mt-8 flex items-center justify-center space-x-8 text-sm text-red-100">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Kiểm duyệt chuyên nghiệp</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>Cộng đồng đáng tin cậy</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Bảo mật thông tin</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Guidelines Section */}
          <div className="mb-12">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-red-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Hướng dẫn đóng góp
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Nội dung chất lượng</h3>
                  <p className="text-sm text-gray-600">Bài viết phải có liên quan đến Chủ tịch Hồ Chí Minh, có giá trị lịch sử và giáo dục</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Trình bày rõ ràng</h3>
                  <p className="text-sm text-gray-600">Sử dụng ngôn ngữ Việt Nam chuẩn, trình bày mạch lạc và dễ hiểu</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Nguồn đáng tin</h3>
                  <p className="text-sm text-gray-600">Cung cấp nguồn tham khảo rõ ràng, đáng tin cậy nếu có thể</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-red-100 overflow-hidden">
            <div className="bg-gradient-to-r from-red-600 to-red-700 p-6">
              <h2 className="text-2xl font-bold text-white text-center">
                Biểu mẫu đóng góp bài viết
              </h2>
              <p className="text-red-100 text-center mt-2">
                Vui lòng điền đầy đủ thông tin để chúng tôi có thể xem xét bài viết của bạn
              </p>
            </div>
            
            <div className="p-8">
              <CommunityForm />
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
              <p className="text-sm text-red-800 mb-2">
                <strong>Lưu ý:</strong> Bài viết của bạn sẽ được xem xét và phê duyệt bởi ban biên tập trước khi hiển thị công khai.
              </p>
              <p className="text-sm text-red-700">
                Thời gian xử lý thường từ 1-3 ngày làm việc. Chúng tôi sẽ thông báo kết quả qua email nếu bạn đã đăng ký tài khoản.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
