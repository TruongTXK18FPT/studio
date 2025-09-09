import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import './globals.css';

const VERCEL_URL = process.env.VERCEL_URL ? `https://{VERCEL_URL}` : 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(VERCEL_URL),
  title: {
    default: 'Hành Trình Bác Hồ',
    template: `%s | Hành Trình Bác Hồ`,
  },
  description: 'Kho tư liệu toàn diện về cuộc đời, sự nghiệp và di sản của Chủ tịch Hồ Chí Minh. Khám phá dòng thời gian, thư viện ảnh, thư và các văn bản gốc.',
  openGraph: {
    title: 'Hành Trình Bác Hồ',
    description: 'Kho tư liệu toàn diện về cuộc đời và sự nghiệp của Chủ tịch Hồ Chí Minh.',
    url: VERCEL_URL,
    siteName: 'Hành Trình Bác Hồ',
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
    title: 'Hành Trình Bác Hồ',
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
        <link href="https://fonts.googleapis.com/css2?family=Literata:opsz,wght@7..72,400;7..72,500;7..72,700&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen bg-background text-foreground">
        <div className="relative flex min-h-screen flex-col">
          <div className="fixed top-0 left-0 w-full h-full bg-trongdong-pattern opacity-[0.06] pointer-events-none"></div>
          <SiteHeader />
          <main className="flex-1 container mx-auto px-4 py-8">
            {children}
          </main>
          <SiteFooter />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
