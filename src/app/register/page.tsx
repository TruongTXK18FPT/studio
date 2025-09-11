'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password, name: name || undefined })
      })

      const data = await response.json()

      if (response.ok) {
        router.push('/login?message=Đăng ký thành công, vui lòng đăng nhập')
      } else {
        setError(data.error || 'Có lỗi xảy ra')
      }
    } catch (error) {
      console.error('Register error:', error)
      setError('Có lỗi kết nối, vui lòng thử lại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-amber-50 to-yellow-50 bg-lotus-pattern flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-[url('/patterns/TRONGDONGVECTOR-402x400.svg')] opacity-5 bg-repeat bg-center"></div>
      <div className="absolute top-10 right-10 w-32 h-32 bg-red-800/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 left-10 w-40 h-40 bg-amber-600/5 rounded-full blur-3xl"></div>
      
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/95 backdrop-blur-sm relative z-10">
        <CardHeader className="text-center pb-8 pt-8 bg-gradient-to-r from-red-800 to-red-900 text-white rounded-t-lg relative">
          <div className="absolute inset-0 bg-[url('/patterns/unnamed.svg')] opacity-10 bg-repeat bg-center rounded-t-lg"></div>
          <div className="relative">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border border-white/30">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12C14.21 12 16 10.21 16 8S14.21 4 12 4 8 5.79 8 8 9.79 12 12 12M12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"/>
              </svg>
            </div>
            <CardTitle className="text-2xl font-bold text-white tracking-wide">
              Đăng ký
            </CardTitle>
            <CardDescription className="text-white/90 leading-relaxed mt-2">
              Tham gia cộng đồng tìm hiểu về hành trình của Bác Hồ
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2">
                <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-3">
              <Label htmlFor="name" className="text-sm font-semibold text-gray-800 flex items-center space-x-2">
                <svg className="w-4 h-4 text-red-800" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                <span>Họ và tên</span>
                <span className="text-gray-500 text-xs">(tuỳ chọn)</span>
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 text-base border-2 border-gray-200 focus:border-red-800 focus:ring-2 focus:ring-red-800/20 rounded-xl transition-all duration-200"
                placeholder="Nhập họ và tên của bạn"
              />
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="email" className="text-sm font-semibold text-gray-800 flex items-center space-x-2">
                <svg className="w-4 h-4 text-red-800" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span>Địa chỉ email</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 text-base border-2 border-gray-200 focus:border-red-800 focus:ring-2 focus:ring-red-800/20 rounded-xl transition-all duration-200"
                placeholder="Nhập địa chỉ email của bạn"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="password" className="text-sm font-semibold text-gray-800 flex items-center space-x-2">
                <svg className="w-4 h-4 text-red-800" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span>Mật khẩu</span>
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 text-base border-2 border-gray-200 focus:border-red-800 focus:ring-2 focus:ring-red-800/20 rounded-xl transition-all duration-200"
                placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-gradient-to-r from-red-800 to-red-900 hover:from-red-900 hover:to-red-950 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Đang đăng ký...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  <span>Tạo tài khoản</span>
                </div>
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-600">Đã có tài khoản?</span>
              </div>
            </div>
            <div className="mt-4">
              <Link 
                href="/login" 
                className="inline-flex items-center space-x-2 text-red-800 hover:text-red-900 font-semibold transition-colors duration-200 hover:underline"
              >
                <span>Đăng nhập ngay</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
