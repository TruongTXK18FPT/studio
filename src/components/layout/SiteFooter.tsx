import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Heart, Star, Clock, BookOpen, MessageSquare, Globe, Mail, Phone, MapPin, Facebook, Youtube, Twitter, Github } from 'lucide-react';

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-red-900 via-red-800 to-red-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/patterns/lotus.svg')] opacity-5 bg-repeat bg-center"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      
      <div className="relative container mx-auto px-4 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/20">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-xl bg-gradient-to-r from-white to-red-100 bg-clip-text text-transparent">
                  HCM202
                </h3>
                <p className="text-red-100 text-sm">Ánh sáng lịch sử</p>
              </div>
            </div>
            <p className="text-red-100 leading-relaxed mb-6">
              Nơi lưu giữ và chia sẻ những tư liệu quý báu về cuộc đời và sự nghiệp vĩ đại của 
              Chủ tịch Hồ Chí Minh - vị lãnh tụ kính yêu của dân tộc Việt Nam.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <div className="text-2xl font-bold text-white">1890</div>
                <div className="text-xs text-red-100">Năm sinh</div>
              </div>
              <div className="text-center p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <div className="text-2xl font-bold text-white">79</div>
                <div className="text-xs text-red-100">Năm cuộc đời</div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-6 flex items-center">
              <BookOpen className="w-5 h-5 mr-2" />
              Khám phá
            </h4>
            <ul className="space-y-3">
              {[
                { href: '/timeline', label: 'Dòng thời gian', icon: Clock },
                { href: '/gallery', label: 'Thư viện ảnh', icon: BookOpen },
                { href: '/letters', label: 'Thư & Văn bản', icon: MessageSquare },
                { href: '/community', label: 'Cộng đồng', icon: Globe },
                { href: '/quiz', label: 'Quiz lịch sử', icon: Star },
              ].map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.href}>
                    <Link 
                      href={link.href} 
                      className="flex items-center text-red-100 hover:text-white transition-colors duration-200 group"
                    >
                      <Icon className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Community & Support */}
          <div>
            <h4 className="font-semibold text-lg mb-6 flex items-center">
              <Heart className="w-5 h-5 mr-2" />
              Cộng đồng
            </h4>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/community/submit" 
                  className="text-red-100 hover:text-white transition-colors duration-200"
                >
                  Đóng góp bài viết
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  className="text-red-100 hover:text-white transition-colors duration-200"
                >
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link 
                  href="/guidelines" 
                  className="text-red-100 hover:text-white transition-colors duration-200"
                >
                  Hướng dẫn đóng góp
                </Link>
              </li>
              <li>
                <Link 
                  href="/privacy" 
                  className="text-red-100 hover:text-white transition-colors duration-200"
                >
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link 
                  href="/terms" 
                  className="text-red-100 hover:text-white transition-colors duration-200"
                >
                  Điều khoản sử dụng
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 className="font-semibold text-lg mb-6 flex items-center">
              <Mail className="w-5 h-5 mr-2" />
              Liên hệ
            </h4>
            
            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-red-100">
                <Mail className="w-4 h-4 mr-3 flex-shrink-0" />
                <a href="mailto:contact@hcm202.vn" className="hover:text-white transition-colors">
                  contact@hcm202.vn
                </a>
              </div>
              <div className="flex items-center text-red-100">
                <Phone className="w-4 h-4 mr-3 flex-shrink-0" />
                <span>+84 (024) 3936 1234</span>
              </div>
              <div className="flex items-start text-red-100">
                <MapPin className="w-4 h-4 mr-3 flex-shrink-0 mt-1" />
                <span className="text-sm leading-relaxed">
                  FPT University, Việt Nam
                </span>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <p className="text-sm font-medium text-red-100 mb-3">Theo dõi chúng tôi:</p>
              <div className="flex space-x-3">
                {[
                  { icon: Facebook, href: '#', label: 'Facebook' },
                  { icon: Youtube, href: '#', label: 'YouTube' },
                  { icon: Twitter, href: '#', label: 'Twitter' },
                  { icon: Github, href: 'https://github.com/TruongTXK18FPT', label: 'GitHub' },
                ].map((social) => {
                  const Icon = social.icon;
                  return (
                    <Button
                      key={social.label}
                      variant="ghost"
                      size="sm"
                      asChild
                      className="w-10 h-10 p-0 bg-white/10 hover:bg-white/20 border border-white/20 text-white hover:text-white transition-all duration-200 hover:scale-110"
                    >
                      <a href={social.href} target="_blank" rel="noopener noreferrer" title={social.label}>
                        <Icon className="w-4 h-4" />
                      </a>
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-white/20 mb-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Copyright */}
          <div className="text-center md:text-left">
            <p className="text-red-100 text-sm mb-2">
              © {currentYear} HCM202. Mọi quyền được bảo lưu.
            </p>
            <p className="text-red-200 text-xs">
              Tôn trọng nguồn gốc tư liệu • Trích dẫn rõ ràng • Chia sẻ tri thức
            </p>
          </div>

          {/* Newsletter Signup */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-white">Nhận thông tin mới</p>
              <p className="text-xs text-red-100">Cập nhật tư liệu & sự kiện</p>
            </div>
            <Button 
              variant="outline" 
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50 transition-all duration-200"
              asChild
            >
              <Link href="/register">
                <Mail className="w-4 h-4 mr-2" />
                Đăng ký
              </Link>
            </Button>
          </div>
        </div>

        {/* Inspirational Quote */}
        <div className="text-center mt-12 pt-8 border-t border-white/20">
          <blockquote className="text-lg md:text-xl font-light italic text-white/90 mb-4 max-w-2xl mx-auto">
            "Không có gì quý hơn độc lập, tự do!"
          </blockquote>
          <cite className="text-red-100 text-sm">— Chủ tịch Hồ Chí Minh —</cite>
        </div>
      </div>
    </footer>
  );
}
