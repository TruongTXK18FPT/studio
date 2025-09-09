import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Download } from 'lucide-react';
import type { TimelineItem } from '@/lib/types';
import type { ReactNode } from 'react';

type TimelineDetailDialogProps = {
  item: TimelineItem;
  children: ReactNode;
};

export function TimelineDetailDialog({ item, children }: TimelineDetailDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-3xl font-headline text-primary">{item.title}</DialogTitle>
          <div className="text-muted-foreground text-sm pt-2">
            {item.date} {item.location && ` - ${item.location}`}
          </div>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto pr-4 -mr-4 grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
          <div className="prose prose-lg max-w-none">
            <p>{item.summary}</p>

            {item.sources && item.sources.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold font-headline">Nguồn tham khảo</h3>
                    <ul className="list-disc list-inside space-y-1 mt-2">
                        {item.sources.map((source, index) =>(
                            <li key={index}>
                                <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center text-base">
                                    {source.label}
                                    <ExternalLink className="ml-1.5 h-4 w-4" />
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
             <div className="mt-6 flex flex-wrap gap-2">
                <Badge variant="outline">{item.type}</Badge>
                {item.tags?.map((tag) => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
            </div>
          </div>
          <div>
            {item.media && item.media.length > 0 && (
              <Carousel className="w-full">
                <CarouselContent>
                  {item.media.map((media, index) => (
                    <CarouselItem key={index}>
                      <div className="p-1">
                        <div className="relative aspect-video">
                          <Image
                            src={media.url}
                            alt={media.caption || item.title}
                            fill
                            className="object-cover rounded-lg"
                            data-ai-hint="history photo"
                          />
                        </div>
                        {media.caption && <p className="text-center text-sm text-muted-foreground mt-2 italic">{media.caption}</p>}
                        {media.kind === 'document' && media.url.endsWith('.pdf') && (
                            <div className="text-center mt-2">
                                <Button asChild variant="outline" size="sm">
                                <a href={media.url} download>
                                    <Download className="mr-2 h-4 w-4" />
                                    Tải về
                                </a>
                                </Button>
                            </div>
                        )}
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {item.media.length > 1 && (
                    <>
                        <CarouselPrevious className="left-2" />
                        <CarouselNext className="right-2" />
                    </>
                )}
              </Carousel>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
