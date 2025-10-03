import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { ArrowLeft, Calendar, User, Tag, ExternalLink, Heart, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

type Props = {
  params: { id: string };
};

async function getPost(id: string) {
  try {
    const { prisma } = await import('@/lib/prisma');
    
    const post = await prisma.post.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        content: true,
        tags: true,
        status: true,
        createdAt: true,
        imageUrl: true
      }
    });

    if (!post) return null;

    return {
      id: post.id,
      title: post.title,
      content: post.content || '',
      tags: Array.isArray(post.tags) ? post.tags as string[] : [],
      status: post.status as 'approved' | 'pending' | 'rejected',
      createdAt: post.createdAt.toISOString(),
      imageUrl: post.imageUrl
    };
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost(params.id);
  
  if (!post) {
    return {
      title: 'Bài viết không tìm thấy',
    };
  }

  return {
    title: post.title,
    description: post.content.substring(0, 160) + '...',
    openGraph: {
      title: post.title,
      description: post.content.substring(0, 160) + '...',
      images: post.imageUrl ? [post.imageUrl] : [],
    }
  };
}

export default async function PostDetailPage({ params }: Props) {
  const post = await getPost(params.id);

  if (!post) {
    notFound();
  }

  const authorName = 'Ẩn danh';
  const sourceLink = undefined as unknown as string | undefined;
  const publishedDate = new Date(post.createdAt).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <article className="min-h-screen bg-gradient-to-br from-red-50/30 via-orange-50/30 to-yellow-50/30">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-800 to-red-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/patterns/lotus.svg')] opacity-10 bg-repeat bg-center"></div>
        <div className="relative container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Button asChild variant="ghost" className="text-white hover:bg-white/10 mb-6">
              <Link href="/community">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại cộng đồng
              </Link>
            </Button>
            
            <div className="space-y-4">
              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="bg-white/20 text-white border-white/30">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
              
              {/* Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                {post.title}
              </h1>
              
              {/* Meta info */}
              <div className="flex flex-wrap items-center gap-6 text-white/80">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>{authorName}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>{publishedDate}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Article Content */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-xl">
                <CardContent className="p-8">
                  {/* Featured Image */}
                  {post.imageUrl && (
                    <div className="relative aspect-video w-full mb-8 rounded-lg overflow-hidden">
                      <Image
                        src={post.imageUrl}
                        alt={post.title}
                        fill
                        className="object-cover"
                        priority
                      />
                    </div>
                  )}
                  
                  {/* Article Content */}
                  <div className="prose prose-lg prose-red max-w-none">
                    {post.content.split('\n').map((paragraph, pIndex) => (
                      paragraph.trim() && (
                        <p key={`para-${pIndex}-${paragraph.slice(0, 20)}`} className="text-gray-700 leading-relaxed mb-6">
                          {paragraph}
                        </p>
                      )
                    ))}
                  </div>
                  
                  {/* Source Link */}
                  {sourceLink && (
                    <div className="mt-8 p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border-l-4 border-red-600">
                      <h4 className="font-semibold text-red-800 mb-2 flex items-center">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Nguồn tham khảo
                      </h4>
                      <a 
                        href={sourceLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-red-600 hover:text-red-800 underline break-all"
                      >
                        {sourceLink}
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Author Card */}
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <User className="mr-2 h-5 w-5 text-red-600" />
                    Tác giả
                  </h3>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{authorName}</p>
                      <p className="text-sm text-gray-600">Thành viên cộng đồng</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Tương tác</h3>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Heart className="mr-2 h-4 w-4" />
                      Yêu thích
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Share2 className="mr-2 h-4 w-4" />
                      Chia sẻ
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Related Tags */}
              {post.tags && post.tags.length > 0 && (
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <Tag className="mr-2 h-5 w-5 text-red-600" />
                      Thẻ liên quan
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="bg-red-50 border-red-200 text-red-800">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Publication Info */}
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Thông tin xuất bản</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><strong>Ngày đăng:</strong> {publishedDate}</p>
                    <p><strong>Trạng thái:</strong> Đã duyệt</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Related Articles Section */}
      <div className="bg-gradient-to-r from-red-800 to-red-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Khám phá thêm
            </h2>
            <p className="text-white/80 mb-8">
              Tìm hiểu thêm về cuộc đời và sự nghiệp của Chủ tịch Hồ Chí Minh
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white hover:text-red-800">
                <Link href="/timeline">
                  Dòng thời gian lịch sử
                </Link>
              </Button>
              <Button asChild variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white hover:text-red-800">
                <Link href="/gallery">
                  Thư viện ảnh
                </Link>
              </Button>
              <Button asChild variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white hover:text-red-800">
                <Link href="/letters">
                  Thư & Văn bản
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}