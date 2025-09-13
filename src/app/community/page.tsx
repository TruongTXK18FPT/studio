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
    const response = await fetch(`${process.env.VERCEL_URL || 'http://localhost:9002'}/api/community/posts`, {
      cache: 'no-store'
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.posts || [];
    }
  } catch (error) {
    console.error('Error fetching posts:', error);
  }
  
  return [];
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
      </div>
    </section>
  );
}
