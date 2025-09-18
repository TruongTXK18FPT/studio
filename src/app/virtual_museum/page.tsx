'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Building, Globe, ArrowLeft, Loader2, Play, X, Maximize2, Clock, Users, Eye } from 'lucide-react';
import Link from 'next/link';

export default function VirtualMuseumPage() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const handleStartExperience = () => {
    setIsFullscreen(true);
    setIsLoading(true);
  };

  const handleExitFullscreen = () => {
    setIsFullscreen(false);
    setIsLoading(false);
    setLoadError(false);
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
    setLoadError(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setLoadError(true);
  };

  // Handle ESC key to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isFullscreen) {
        handleExitFullscreen();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
        {/* Header Section */}
        <div className="bg-white border-b border-red-100 shadow-sm">
          <div className="container max-w-screen-2xl py-8">
            <div className="flex items-center gap-4 mb-6">
              <Button variant="outline" size="sm" asChild>
                <Link href="/" className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Quay lại
                </Link>
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <Badge variant="secondary" className="bg-red-100 text-red-800">
                <Globe className="w-3 h-3 mr-1" />
                Trải nghiệm ảo
              </Badge>
            </div>

            <div className="text-center max-w-4xl mx-auto">
              <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-800 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-6">
                <Building className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Bảo tàng Hồ Chí Minh Ảo
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Khám phá cuộc đời và sự nghiệp vĩ đại của Chủ tịch Hồ Chí Minh qua công nghệ thực tế ảo hiện đại. 
                Trải nghiệm bảo tàng trong không gian 3D tương tác, sống động như thật.
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container max-w-screen-2xl py-12">
          {/* Museum Information */}
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Thông tin Bảo tàng</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                    <Building className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">Bảo tàng Hồ Chí Minh</h3>
                    <p className="text-gray-600">
                      Nơi lưu giữ và trưng bày những hiện vật, tài liệu quý giá về cuộc đời và sự nghiệp 
                      cách mạng của Chủ tịch Hồ Chí Minh - vị lãnh tụ vĩ đại của dân tộc Việt Nam.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                    <Globe className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">Công nghệ Thực tế Ảo</h3>
                    <p className="text-gray-600">
                      Ứng dụng công nghệ 3D và thực tế ảo để tái hiện không gian bảo tàng một cách chân thực, 
                      cho phép du khách tham quan và tương tác từ xa.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                    <Eye className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">Trải nghiệm Immersive</h3>
                    <p className="text-gray-600">
                      Cảm nhận như đang thực sự có mặt tại bảo tàng với khả năng di chuyển tự do, 
                      quan sát chi tiết từng hiện vật và đọc thông tin giải thích.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Tính năng nổi bật</h2>
              <div className="grid grid-cols-2 gap-4">
                <Card className="border-red-100 p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="w-5 h-5 text-red-600" />
                    <span className="font-medium">24/7</span>
                  </div>
                  <p className="text-sm text-gray-600">Mở cửa mọi lúc</p>
                </Card>

                <Card className="border-red-100 p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="w-5 h-5 text-red-600" />
                    <span className="font-medium">Miễn phí</span>
                  </div>
                  <p className="text-sm text-gray-600">Không mất phí tham quan</p>
                </Card>

                <Card className="border-red-100 p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Maximize2 className="w-5 h-5 text-red-600" />
                    <span className="font-medium">Full HD</span>
                  </div>
                  <p className="text-sm text-gray-600">Chất lượng cao</p>
                </Card>

                <Card className="border-red-100 p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Globe className="w-5 h-5 text-red-600" />
                    <span className="font-medium">Toàn cầu</span>
                  </div>
                  <p className="text-sm text-gray-600">Truy cập từ mọi nơi</p>
                </Card>
              </div>
            </div>
          </div>

          {/* Source Information */}
          <Card className="border-red-100 bg-red-50/50 mb-12">
            <CardContent className="p-8">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-red-600 rounded-xl flex items-center justify-center">
                  <ExternalLink className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Nguồn thông tin</h3>
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className="border-red-200 text-red-800">
                      Nguồn chính thức
                    </Badge>
                    <span className="text-sm text-gray-600">
                      Website: <span className="font-mono">baotanghochiminh.baotangao.com</span>
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Start Experience Button */}
          <div className="text-center">
            <Button
              onClick={handleStartExperience}
              size="lg"
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-12 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              <Play className="w-6 h-6 mr-3" />
              Bắt đầu trải nghiệm
            </Button>
            <p className="text-gray-500 mt-4">
              Nhấn ESC để thoát chế độ toàn màn hình
            </p>
          </div>
        </div>
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black">
          {/* Header Controls */}
          <div className="absolute top-0 left-0 right-0 z-10 bg-black/80 backdrop-blur-sm">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4 text-white">
                <Building className="w-6 h-6" />
                <span className="text-lg font-semibold">Bảo tàng Hồ Chí Minh Ảo</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open('http://baotanghochiminh.baotangao.com/', '_blank')}
                  className="text-white hover:bg-white/20"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Mở tab mới
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleExitFullscreen}
                  className="text-white hover:bg-white/20"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-black/90 flex items-center justify-center z-20">
              <div className="flex flex-col items-center gap-6 text-white">
                <Loader2 className="w-12 h-12 animate-spin" />
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2">Đang tải bảo tàng ảo...</h3>
                  <p className="text-gray-300">Vui lòng chờ trong giây lát</p>
                </div>
              </div>
            </div>
          )}

          {/* Error State */}
          {loadError && (
            <div className="absolute inset-0 bg-black flex items-center justify-center z-20">
              <div className="text-center text-white max-w-md mx-auto p-8">
                <Building className="w-20 h-20 mx-auto mb-6 text-gray-400" />
                <h3 className="text-2xl font-semibold mb-4">Không thể tải bảo tàng</h3>
                <p className="text-gray-300 mb-6">
                  Có thể do kết nối mạng hoặc trang web tạm thời không khả dụng
                </p>
                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={() => setLoadError(false)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Thử lại
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.open('http://baotanghochiminh.baotangao.com/', '_blank')}
                    className="border-white text-white hover:bg-white hover:text-black"
                  >
                    Mở trang gốc
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Iframe */}
          <iframe
            src="http://baotanghochiminh.baotangao.com/"
            className="w-full h-full border-0 pt-16"
            title="Bảo tàng Hồ Chí Minh Ảo - Toàn màn hình"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation"
          />
        </div>
      )}
    </>
  );
}
