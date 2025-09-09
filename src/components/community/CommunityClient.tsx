'use client';

import { useState, useMemo } from 'react';
import type { Post } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { PostCard } from './PostCard';

type CommunityClientProps = {
  initialPosts: Post[];
};

export function CommunityClient({ initialPosts }: CommunityClientProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPosts = useMemo(() => {
    if (!searchTerm) return initialPosts;
    return initialPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [initialPosts, searchTerm]);

  return (
    <div>
      <div className="mb-8 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Tìm kiếm bài viết, tác giả, hoặc thẻ..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
         {filteredPosts.length === 0 && (
            <div className="text-center col-span-1 md:col-span-2 lg:col-span-3 py-16">
              <h3 className="text-xl font-medium">Không tìm thấy bài viết nào</h3>
              <p className="text-muted-foreground mt-2">
                Hãy thử với từ khóa khác hoặc đóng góp bài viết của bạn!
              </p>
            </div>
          )}
      </div>
    </div>
  );
}
