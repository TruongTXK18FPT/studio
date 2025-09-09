import type { Post } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Image from 'next/image';

type PostCardProps = {
  post: Post;
};

export function PostCard({ post }: PostCardProps) {
  const authorInitial = post.author ? post.author.charAt(0).toUpperCase() : 'V';

  return (
    <Card className="flex flex-col h-full">
      {post.cover && (
        <div className="relative aspect-video w-full">
          <Image src={post.cover} alt={post.title} fill className="object-cover rounded-t-2xl" data-ai-hint="article cover"/>
        </div>
      )}
      <CardHeader>
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarFallback>{authorInitial}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{post.author || 'Vô danh'}</p>
            <p className="text-xs text-muted-foreground">{new Date(post.createdAt).toLocaleDateString('vi-VN')}</p>
          </div>
        </div>
        <CardTitle className="text-xl font-headline mt-4">{post.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground line-clamp-3">{post.content}</p>
      </CardContent>
      <CardFooter className="flex-col items-start gap-4">
        <div className="flex flex-wrap gap-2">
            {post.tags?.map((tag) => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
        </div>
        <Badge
          className={cn(
            post.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          )}
          variant="outline"
        >
          {post.status === 'approved' ? 'Đã kiểm duyệt' : 'Đang chờ duyệt'}
        </Badge>
      </CardFooter>
    </Card>
  );
}
