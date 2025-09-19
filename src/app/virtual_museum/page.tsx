'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ExternalLink, Building, Globe, ArrowLeft, Loader2, Play, X, 
  Maximize2, Clock, Users, Eye, Shield, RefreshCw, Wifi
} from 'lucide-react';
import Link from 'next/link';

export default function VirtualMuseumPage() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [proxyStatus, setProxyStatus] = useState<'checking' | 'ready' | 'error'>('checking');
  
  // Use our proxy URL instead of direct HTTP URL
  const proxyUrl = '/api/proxy/museum?path=/';
  const originalUrl = 'http://baotanghochiminh.baotangao.com/';

  // Check if proxy is working
  useEffect(() => {
    const checkProxy = async () => {
      try {
        const response = await fetch(proxyUrl, { method: 'HEAD' });
        if (response.ok) {
          setProxyStatus('ready');
        } else {
          setProxyStatus('error');
        }
      } catch (error) {
        console.error('Proxy check failed:', error);
        setProxyStatus('error');
      }
    };

    checkProxy();
  }, [proxyUrl]);

  const handleStartExperience = () => {
    if (proxyStatus !== 'ready') {
      // Fallback to opening in new tab
      window.open(originalUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    
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

  const handleRetry = () => {
    setLoadError(false);
    setIsLoading(true);
    // Force iframe reload by changing src
    const iframe = document.querySelector('iframe');
    if (iframe) {
      iframe.src = iframe.src;
    }
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
              
              {/* Proxy Status Badge */}
              {proxyStatus === 'ready' && (
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  <Shield className="w-3 h-3 mr-1" />
                  Proxy HTTPS
                </Badge>
              )}
              {proxyStatus === 'checking' && (
                <Badge variant="outline" className="border-blue-200 text-blue-800">
                  <Wifi className="w-3 h-3 mr-1" />
                  Đang kiểm tra...
                </Badge>
              )}
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

              {/* Proxy Status Info */}
              {proxyStatus === 'ready' && (
                <Alert className="mb-6 border-green-200 bg-green-50">
                  <Shield className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    <strong>Kết nối an toàn:</strong> Đã thiết lập proxy HTTPS thành công. 
                    Bạn có thể trải nghiệm bảo tàng trực tiếp trên trang web này.
                  </AlertDescription>
                </Alert>
              )}

              {proxyStatus === 'error' && (
                <Alert className="mb-6 border-orange-200 bg-orange-50">
                  <AlertDescription className="text-orange-800">
                    <strong>Proxy không khả dụng:</strong> Sẽ mở bảo tàng trong tab mới để đảm bảo trải nghiệm tốt nhất.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        </div>

        {/* Main Content - Keep your existing content */}
        <div className="container max-w-screen-2xl py-12">
          {/* Museum Information */}
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Your existing museum info content */}
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

          {/* Enhanced Source Information */}
          <Card className="border-red-100 bg-red-50/50 mb-12">
            <CardContent className="p-8">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-red-600 rounded-xl flex items-center justify-center">
                  {proxyStatus === 'ready' ? (
                    <Shield className="w-8 h-8 text-white" />
                  ) : (
                    <ExternalLink className="w-8 h-8 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {proxyStatus === 'ready' ? 'Kết nối Proxy HTTPS' : 'Nguồn thông tin'}
                  </h3>
                  <p className="text-lg text-gray-700 mb-4">
                    {proxyStatus === 'ready' 
                      ? 'Đã thiết lập proxy server để cung cấp trải nghiệm an toàn qua HTTPS'
                      : 'Bảo tàng ảo được phát triển bởi baotangao.com - nền tảng bảo tàng ảo hàng đầu Việt Nam'
                    }
                  </p>
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className="border-red-200 text-red-800">
                      {proxyStatus === 'ready' ? 'Proxy Active' : 'Nguồn chính thức'}
                    </Badge>
                    <span className="text-sm text-gray-600">
                      Website: <span className="font-mono">baotanghochiminh.baotangao.com</span>
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Start Experience Section */}
          <div className="text-center">
            {proxyStatus !== 'checking' && (
              <>
                <Button
                  onClick={handleStartExperience}
                  size="lg"
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-12 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  <Play className="w-6 h-6 mr-3" />
                  {proxyStatus === 'ready' ? 'Bắt đầu trải nghiệm' : 'Mở bảo tàng (Tab mới)'}
                </Button>
                
                <p className="text-gray-500 mt-4">
                  {proxyStatus === 'ready' 
                    ? 'Nhấn ESC để thoát chế độ toàn màn hình'
                    : 'Sẽ mở trong tab mới để đảm bảo trải nghiệm tốt nhất'
                  }
                </p>
              </>
            )}

            {proxyStatus === 'checking' && (
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-red-600" />
                <p className="text-gray-600">Đang thiết lập kết nối proxy...</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fullscreen Modal - Only show if proxy is ready */}
      {isFullscreen && proxyStatus === 'ready' && (
        <div className="fixed inset-0 z-50 bg-black">
          {/* Header Controls */}
          <div className="absolute top-0 left-0 right-0 z-10 bg-black/80 backdrop-blur-sm">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4 text-white">
                <Building className="w-6 h-6" />
                <span className="text-lg font-semibold">Bảo tàng Hồ Chí Minh Ảo</span>
                <Badge className="bg-green-600 text-white">
                  <Shield className="w-3 h-3 mr-1" />
                  Proxy HTTPS
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRetry}
                  className="text-white hover:bg-white/20"
                  disabled={isLoading}
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Làm mới
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(originalUrl, '_blank')}
                  className="text-white hover:bg-white/20"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Tab mới
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
                  <h3 className="text-xl font-semibold mb-2">Đang tải qua proxy HTTPS...</h3>
                  <p className="text-gray-300">Vui lòng chờ trong giây lát</p>
                </div>
              </div>
            </div>
          )}

          {/* Error State */}
          {loadError && (
            <div className="absolute inset-0 bg-black flex items-center justify-center z-20">
              <div className="text-center text-white max-w-lg mx-auto p-8">
                <Building className="w-20 h-20 mx-auto mb-6 text-gray-400" />
                <h3 className="text-2xl font-semibold mb-4">Lỗi kết nối proxy</h3>
                <p className="text-gray-300 mb-6">
                  Có thể do server proxy quá tải hoặc trang web nguồn không khả dụng.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={handleRetry}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Thử lại
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.open(originalUrl, '_blank')}
                    className="border-white text-white hover:bg-white hover:text-black"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Mở trang gốc
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Iframe using Proxy */}
          {!loadError && (
            <iframe
              src={proxyUrl}
              className="w-full h-full border-0 pt-16"
              title="Bảo tàng Hồ Chí Minh Ảo - Proxy HTTPS"
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              sandbox="allow-scripts allow-forms allow-popups"
              referrerPolicy="no-referrer-when-downgrade"
              allow="camera; microphone; fullscreen; display-capture"
            />
          )}
        </div>
      )}
    </>
  );
}
