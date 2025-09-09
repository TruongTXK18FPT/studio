import type { Metadata } from 'next';
import galleryData from '@/data/gallery.json';
import type { MediaItem } from '@/lib/types';
import { GalleryGrid } from '@/components/gallery/GalleryGrid';

export const metadata: Metadata = {
  title: 'Thư viện ảnh',
  description: 'Bộ sưu tập hình ảnh, tư liệu quý giá về Chủ tịch Hồ Chí Minh và lịch sử Việt Nam.',
};

export default function GalleryPage() {
  const mediaItems = galleryData as MediaItem[];
  return (
    <section className="w-full">
       <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-primary">Thư Viện Ảnh & Tư Liệu</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
          Những khoảnh khắc và tài liệu lịch sử được lưu giữ, phản ánh chân thực về cuộc đời và sự nghiệp của Bác.
        </p>
      </div>
      <GalleryGrid items={mediaItems} />
    </section>
  );
}
