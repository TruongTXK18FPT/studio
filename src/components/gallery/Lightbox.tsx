'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, X, Download } from 'lucide-react';
import type { MediaItem } from '@/lib/types';
import { cn } from '@/lib/utils';

type LightboxProps = {
  isOpen: boolean;
  onClose: () => void;
  items: MediaItem[];
  startIndex?: number;
};

export function Lightbox({ isOpen, onClose, items, startIndex = 0 }: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(startIndex);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(startIndex);
    }
  }, [isOpen, startIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [items.length]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? items.length - 1 : prevIndex - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === items.length - 1 ? 0 : prevIndex + 1));
  };

  const currentItem = items[currentIndex];

  if (!currentItem) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-background/80 backdrop-blur-lg border-0 p-2 w-screen h-screen max-w-none max-h-none rounded-none flex flex-col">
        <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
           {currentItem.url.endsWith('.pdf') || currentItem.kind === 'document' && (
                <Button asChild variant="secondary">
                    <a href={currentItem.url} download aria-label="Tải xuống tài liệu">
                        <Download className="h-5 w-5" />
                    </a>
                </Button>
            )}
          <Button variant="secondary" size="icon" onClick={onClose} aria-label="Đóng">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="relative flex-1 flex items-center justify-center">
            {items.length > 1 && (
                <>
                    <Button variant="secondary" size="icon" onClick={goToPrevious} className="absolute left-4 top-1/2 -translate-y-1/2 z-50" aria-label="Ảnh trước">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <Button variant="secondary" size="icon" onClick={goToNext} className="absolute right-4 top-1/2 -translate-y-1/2 z-50" aria-label="Ảnh kế tiếp">
                        <ArrowRight className="h-5 w-5" />
                    </Button>
                </>
            )}
            
            <div className="relative w-full h-full max-w-6xl max-h-[85vh]">
                <Image
                    src={currentItem.url}
                    alt={currentItem.caption || `Media ${currentIndex + 1}`}
                    fill
                    className="object-contain"
                    data-ai-hint="document photo"
                />
            </div>
        </div>
        
        <div className="text-center p-4 text-primary-foreground bg-black/50 rounded-b-lg">
          <p className="font-medium">{currentItem.caption}</p>
          <p className="text-sm text-muted-foreground/80">{currentIndex + 1} / {items.length}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
