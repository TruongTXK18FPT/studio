import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { CommunityClient } from '@/components/community/CommunityClient';
import communityData from '@/data/community.json';
import type { Post } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Cộng đồng',
  description: 'Nơi cộng đồng cùng nhau chia sẻ, đóng góp những bài viết, tư liệu và câu chuyện về Bác Hồ.',
};

export default function CommunityPage() {
  const posts = communityData as Post[];

  return (
    <section className="w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
        <div className="text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">Góc Cộng Đồng</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl">
            Cùng nhau chia sẻ, thảo luận và làm phong phú thêm kho tư liệu về hành trình của Bác.
          </p>
        </div>
        <Button asChild size="lg">
          <Link href="/community/submit">
            <PlusCircle className="mr-2 h-5 w-5" />
            Chia sẻ bài viết
          </Link>
        </Button>
      </div>

      <CommunityClient initialPosts={posts} />
    </section>
  );
}
