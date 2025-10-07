import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { AdminRedirect } from '@/components/layout/AdminRedirect';
import { ChatBox } from '@/components/chat/ChatBox';
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import './globals.css';

const VERCEL_URL = process.env.VERCEL_URL ? `https://anh-sang-lich-su.vercel.app` : 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(VERCEL_URL),
  title: {
    default: 'Ánh sáng lịch sử',
    template: `%s | Ánh sáng lịch sử`,
  },
  description: 'Kho tư liệu toàn diện về cuộc đời, sự nghiệp và di sản của Chủ tịch Hồ Chí Minh. Khám phá dòng thời gian, thư viện ảnh, thư và các văn bản gốc.',
  openGraph: {
    title: 'Ánh sáng lịch sử',
    description: 'Kho tư liệu toàn diện về cuộc đời và sự nghiệp của Chủ tịch Hồ Chí Minh.',
    url: VERCEL_URL,
    siteName: 'Ánh sáng lịch sử',
    images: [
      {
        url: '/og-base.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'vi_VN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ánh sáng lịch sử',
    description: 'Kho tư liệu toàn diện về cuộc đời và sự nghiệp của Chủ tịch Hồ Chí Minh.',
    images: ['/og-base.png'],
  },
  icons: {
    icon: '/favicon.ico',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen bg-background text-foreground" suppressHydrationWarning>
        <div className="relative flex min-h-screen flex-col">
          <div className="fixed top-0 left-0 w-full h-full bg-trongdong-pattern opacity-[0.2] pointer-events-none"></div>
          <AdminRedirect />
          <SiteHeader />
          <main className="flex-1 container mx-auto px-4 py-8">
            {children}
          </main>
          <SiteFooter />
          <ChatBox />
        </div>
        <Toaster />
        <Analytics />
        <SpeedInsights/>

      </body>
    </html>
  );
}
