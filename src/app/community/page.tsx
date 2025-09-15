import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { CommunityClient } from '@/components/community/CommunityClient';

export const metadata: Metadata = {
  title: 'Cộng đồng',
  description: 'Nơi cộng đồng cùng nhau chia sẻ, đóng góp những bài viết, tư liệu và câu chuyện về Bác Hồ.',
};

async function getPosts() {
  try {
    // Import prisma directly for server-side fetching
    const { prisma } = await import('@/lib/prisma');
    
    const posts = await prisma.post.findMany({
      where: { status: 'approved' },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        content: true,
        tags: true,
        status: true,
        createdAt: true,
        metadata: true
      }
    });

    return posts.map(post => ({
      id: post.id,
      title: post.title,
      content: post.content || '',
      tags: Array.isArray(post.tags) ? post.tags as string[] : [],
      status: post.status as 'approved' | 'pending' | 'rejected',
      createdAt: post.createdAt.toISOString(),
      metadata: post.metadata as any
    }));
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export default async function CommunityPage() {
  const posts = await getPosts();

  return (
    <section className="w-full min-h-screen bg-gradient-to-br from-red-50/30 via-orange-50/30 to-yellow-50/30">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-800 to-red-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/patterns/lotus.svg')] opacity-10 bg-repeat bg-center"></div>
        <div className="relative container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Góc Cộng Đồng
            </h1>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed max-w-3xl mx-auto mb-8">
              Cùng nhau chia sẻ, thảo luận và làm phong phú thêm kho tư liệu về hành trình của Bác
            </p>
            <Button asChild size="lg" className="bg-white text-red-800 hover:bg-red-50 font-semibold">
              <Link href="/community/submit">
                <PlusCircle className="mr-2 h-5 w-5" />
                Chia sẻ bài viết
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <CommunityClient initialPosts={posts} />
        {posts.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-xl font-medium mb-4">Chưa có bài viết nào được duyệt</h3>
            <p className="text-muted-foreground mb-6">
              Hãy trở thành người đầu tiên đóng góp bài viết cho cộng đồng!
            </p>
            <Button asChild>
              <Link href="/community/submit">
                <PlusCircle className="mr-2 h-4 w-4" />
                Viết bài đầu tiên
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
