'use client';

import { useState } from 'react';
import type { MediaItem } from '@/lib/types';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { FileText, Maximize } from 'lucide-react';
import { Lightbox } from './Lightbox';
import { cn } from '@/lib/utils';

type GalleryGridProps = {
  items: MediaItem[];
};

export function GalleryGrid({ items }: GalleryGridProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((item, index) => (
          <Card
            key={index}
            className="group relative overflow-hidden cursor-pointer"
            onClick={() => openLightbox(index)}
          >
            <div className={cn("relative w-full", item.kind === 'document' ? 'aspect-square' : 'aspect-[4/3]')}>
              {item.kind === 'photo' ? (
                <Image
                  src={item.url}
                  alt={item.caption || 'Gallery Image'}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  data-ai-hint="historical photo"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-muted">
                  <FileText className="h-16 w-16 text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-4 flex flex-col justify-end">
              <p className="text-primary-foreground text-sm font-medium line-clamp-2">
                {item.caption}
              </p>
            </div>
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Maximize className="h-10 w-10 text-white" />
            </div>
          </Card>
        ))}
      </div>
      <Lightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        items={items}
        startIndex={selectedIndex}
      />
    </>
  );
}
