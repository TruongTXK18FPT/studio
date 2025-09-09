'use client';

import { useState, useMemo, useTransition } from 'react';
import type { TimelineItem } from '@/lib/types';
import { TimelineFilters } from './TimelineFilters';
import { TimelineItemCard } from './TimelineItemCard';
import { filterTimelineItems } from '@/ai/flows/filter-timeline-by-keywords';
import { Skeleton } from '@/components/ui/skeleton';

type TimelineClientProps = {
  initialItems: TimelineItem[];
};

export function TimelineClient({ initialItems }: TimelineClientProps) {
  const [isPending, startTransition] = useTransition();
  const [items, setItems] = useState<TimelineItem[]>(initialItems);
  const [yearRange, setYearRange] = useState<[number, number]>([1911, 1969]);
  const [selectedType, setSelectedType] = useState<string>('all');

  const handleKeywordsChange = (keywords: string) => {
    startTransition(async () => {
      if (!keywords) {
        setItems(initialItems);
        return;
      }
      try {
        const filtered = await filterTimelineItems({ timelineItems: initialItems, keywords });
        setItems(filtered as TimelineItem[]);
      } catch (error) {
        console.error('Error filtering timeline:', error);
        // Optionally, show a toast notification for the error
        setItems(initialItems); // Revert to initial items on error
      }
    });
  };

  const filteredItems = useMemo(() => {
    return items
      .filter(item => item.year >= yearRange[0] && item.year <= yearRange[1])
      .filter(item => selectedType === 'all' || item.type === selectedType);
  }, [items, yearRange, selectedType]);

  return (
    <>
      <TimelineFilters
        onKeywordsChange={handleKeywordsChange}
        onYearChange={setYearRange}
        onTypeChange={setSelectedType}
        minYear={1911}
        maxYear={1969}
      />
      <div className="relative mt-12 w-full">
        {/* Timeline Rail */}
        <div className="absolute left-1/2 -ml-0.5 h-full w-0.5 bg-border" aria-hidden="true"></div>

        <div className="space-y-16">
          {isPending
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className={`flex ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center w-full`}>
                  <div className="w-full md:w-5/12 p-4">
                     <Skeleton className="h-64 w-full rounded-2xl" />
                  </div>
                  <div className="w-2/12 hidden md:flex justify-center">
                    <Skeleton className="w-6 h-6 rounded-full" />
                  </div>
                </div>
              ))
            : filteredItems.map((item, index) => (
                <TimelineItemCard key={item.id} item={item} index={index} />
              ))
          }
           {filteredItems.length === 0 && !isPending && (
            <div className="text-center col-span-1 md:col-span-2 lg:col-span-4 py-16">
              <h3 className="text-xl font-medium">Không tìm thấy kết quả</h3>
              <p className="text-muted-foreground mt-2">
                Vui lòng thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
