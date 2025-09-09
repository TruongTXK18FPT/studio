import type { TimelineItem } from '@/lib/types';
import timelineData from '@/data/timeline.json';
import { TimelineClient } from '@/components/timeline/TimelineClient';

export default function Home() {
  const items: TimelineItem[] = timelineData as TimelineItem[];

  return (
    <section className="w-full">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-primary">Dòng Thời Gian Lịch Sử</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
          Khám phá những dấu mốc quan trọng trong cuộc đời và sự nghiệp cách mạng của Chủ tịch Hồ Chí Minh, từ những ngày đầu ra đi tìm đường cứu nước đến khi đất nước hoàn toàn độc lập.
        </p>
      </div>
      <TimelineClient initialItems={items} />
    </section>
  );
}
