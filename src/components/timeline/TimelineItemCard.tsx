'use client';

import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TimelineDetailDialog } from './TimelineDetailDialog';
import type { TimelineItem } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Calendar, MapPin } from 'lucide-react';

type TimelineItemCardProps = {
  item: TimelineItem;
  index: number;
};

export function TimelineItemCard({ item, index }: TimelineItemCardProps) {
  const isReversed = index % 2 !== 0;
  const thumbnail = item.media?.find(m => m.kind === 'photo');

  return (
    <div className="flex items-center w-full">
      <div className={cn('w-full md:w-5/12', isReversed ? 'md:order-last' : '')}>
        <Card className="hover:shadow-xl transition-shadow duration-300">
          {thumbnail && (
            <div className="relative aspect-video w-full">
                <Image
                    src={thumbnail.url}
                    alt={thumbnail.caption || item.title}
                    fill
                    className="object-cover rounded-t-2xl"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    data-ai-hint="history event"
                />
            </div>
          )}
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
                <div>
                    <CardTitle className="text-xl font-headline">{item.title}</CardTitle>
                    <CardDescription className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                        {item.date && <span className="flex items-center"><Calendar className="mr-1.5 h-4 w-4"/>{item.date}</span>}
                        {item.location && <span className="flex items-center"><MapPin className="mr-1.5 h-4 w-4"/>{item.location}</span>}
                    </CardDescription>
                </div>
                 <Badge variant="secondary" className="shrink-0">{item.year}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground line-clamp-3">{item.summary}</p>
          </CardContent>
          <CardFooter>
            <div className="flex justify-between items-center w-full">
              <div className="flex gap-2 flex-wrap">
                  <Badge variant="outline">{item.type}</Badge>
                  {item.tags?.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
              </div>
              <TimelineDetailDialog item={item}>
                <Button variant="link" className="text-primary">Xem chi tiết</Button>
              </TimelineDetailDialog>
            </div>
          </CardFooter>
        </Card>
      </div>

      <div className="hidden md:flex w-2/12 justify-center">
        <div className="w-6 h-6 rounded-full bg-primary/20 border-4 border-background ring-4 ring-primary flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
        </div>
      </div>

      <div className={cn('hidden md:block w-5/12', isReversed ? 'md:order-first' : '')}></div>
    </div>
  );
}
