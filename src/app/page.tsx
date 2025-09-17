'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  BookOpen, 
  Trophy, 
  Calendar,
  Brain,
  Globe,
  Users,
  ArrowRight,
  FileText,
  Target,
  Heart
} from 'lucide-react'

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false)
  const [currentQuote, setCurrentQuote] = useState(0)
  const [activeFeature, setActiveFeature] = useState(0)

  // Quotes rotation effect
  useEffect(() => {
    setIsVisible(true)
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  // Auto-rotate features every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const quotes = [
    {
      text: "Không có gì quý hơn độc lập tự do",
      author: "Chủ tịch Hồ Chí Minh"
    },
    {
      text: "Học, học nữa, học mãi",
      author: "Chủ tịch Hồ Chí Minh"
    }
  ]

  const features = [
    {
      title: "Dòng Thời Gian Lịch Sử",
      description: "Khám phá hành trình cuộc đời và sự nghiệp của Chủ tịch Hồ Chí Minh qua timeline tương tác",
      icon: Calendar,
      href: "/timeline",
      color: "bg-blue-100 text-blue-600"
    },
    {
      title: "Bài Quiz Tương Tác", 
      description: "Kiểm tra kiến thức về tư tưởng Hồ Chí Minh qua các câu hỏi được thiết kế khoa học",
      icon: Brain,
      href: "/quiz",
      color: "bg-green-100 text-green-600"
    },
    {
      title: "Thư Viện Thư Tín",
      description: "Đọc những bức thư quý giá của Bác Hồ gửi đến nhân dân và đồng chí",
      icon: FileText,
      href: "/letters", 
      color: "bg-purple-100 text-purple-600"
    },
    {
      title: "Cộng Đồng Học Tập",
      description: "Chia sẻ và thảo luận với cộng đồng về tư tưởng và đạo đức Hồ Chí Minh",
      icon: Users,
      href: "/community",
      color: "bg-orange-100 text-orange-600"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-yellow-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 px-4">
        <div className="absolute inset-0 opacity-10">
          <Image
            src="/patterns/unnamed.svg"
            alt="Pattern"
            fill
            className="object-cover"
          />
        </div>
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-red-800 mb-6">
            Ánh Sáng Lịch Sử
            <br />
            <span className="text-yellow-600">Hồ Chí Minh</span>
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
            Khám phá và học hỏi những giá trị vĩnh cửu từ tư tưởng của Chủ tịch Hồ Chí Minh. 
            Nền tảng học tập toàn diện với timeline lịch sử, bài quiz tương tác và cộng đồng học tập.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-red-600 hover:bg-red-700">
              <Link href="/timeline">
                <Calendar className="mr-2 h-5 w-5" />
                Khám Phá Timeline
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-red-600 text-red-600 hover:bg-red-50">
              <Link href="/quiz">
                <Brain className="mr-2 h-5 w-5" />
                Bắt Đầu Quiz
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-12 px-4 bg-red-800 text-white">
        <div className="container mx-auto text-center">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <blockquote className="text-2xl md:text-3xl font-light italic mb-4">
              "{quotes[currentQuote].text}"
            </blockquote>
            <cite className="text-yellow-300 font-medium">
              - {quotes[currentQuote].author}
            </cite>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-red-800 mb-4">
              Tính Năng Nổi Bật
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Khám phá tư tưởng Hồ Chí Minh qua nhiều hình thức học tập đa dạng và sinh động
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Card 
                key={feature.title} 
                className={`transition-all duration-300 hover:shadow-lg cursor-pointer ${
                  activeFeature === features.indexOf(feature) ? 'ring-2 ring-red-500 scale-105' : ''
                }`}
              >
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">
                    {feature.description}
                  </CardDescription>
                  <Button asChild variant="outline" className="w-full">
                    <Link href={feature.href}>
                      Khám Phá <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Journey Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-yellow-100 to-red-100">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-red-800 mb-4">
              Hành Trình Học Tập
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Theo dõi tiến trình học tập của bạn và đạt được những thành tựu đáng tự hào
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Học Tập</h3>
              <p className="text-gray-600">
                Khám phá tư tưởng qua timeline, thư tín và tài liệu quý giá
              </p>
            </div>

            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Target className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Thực Hành</h3>
              <p className="text-gray-600">
                Kiểm tra kiến thức qua các bài quiz và hoạt động tương tác
              </p>
            </div>

            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Trophy className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Thành Tựu</h3>
              <p className="text-gray-600">
                Đạt được những mốc quan trọng trong hành trình học tập
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 px-4 bg-red-800 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Bắt Đầu Hành Trình Học Tập Ngay Hôm Nay
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Cùng nhau khám phá và ứng dụng những giá trị vĩnh cửu của tư tưởng Hồ Chí Minh vào cuộc sống
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="bg-yellow-500 hover:bg-yellow-600 text-red-800">
              <Link href="/register">
                <Heart className="mr-2 h-5 w-5" />
                Đăng Ký Ngay
              </Link>
            </Button>
            <Button asChild size="lg" className="bg-white text-red-800 hover:bg-yellow-100 hover:text-red-900 border-2 border-white">
              <Link href="/gallery">
                <Globe className="mr-2 h-5 w-5" />
                Khám Phá Thêm
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}