import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import lettersData from '@/data/letters.json';
import type { TimelineItem } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Download } from 'lucide-react';

const letters = lettersData as TimelineItem[];

export async function generateStaticParams() {
  return letters.map((letter) => ({
    id: letter.id,
  }));
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const letter = letters.find((p) => p.id === params.id);
  if (!letter) {
    return { title: 'Không tìm thấy' };
  }
  return {
    title: letter.title,
    description: letter.summary,
  };
}

export default function LetterDetailPage({ params }: { params: { id: string } }) {
  const letter = letters.find((p) => p.id === params.id);

  if (!letter) {
    notFound();
  }

  const scanMedia = letter.media?.find(m => m.kind === 'document' || m.kind === 'photo');

  return (
    <article className="max-w-4xl mx-auto">
      <header className="text-center mb-12">
        <p className="text-primary font-semibold">{letter.date} - {letter.location}</p>
        <h1 className="text-3xl md:text-5xl font-bold font-headline mt-2">{letter.title}</h1>
        <div className="mt-4 flex gap-2 justify-center">
            {letter.tags?.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
        </div>
      </header>

      <div className="prose prose-lg max-w-none mx-auto text-foreground">
        <blockquote className="border-l-4 border-primary bg-accent/50 p-4 rounded-r-lg">
            <p className="text-lg italic">{letter.summary}</p>
        </blockquote>
      </div>

      {scanMedia && (
        <div className="mt-12 bg-gray-100 dark:bg-gray-800 p-4 rounded-2xl">
          <h2 className="text-2xl font-headline mb-4 text-center">Bản gốc hoặc hình ảnh liên quan</h2>
          <div className="relative aspect-[3/4] max-w-2xl mx-auto">
            <Image
              src={scanMedia.url}
              alt={scanMedia.caption || `Bản scan của ${letter.title}`}
              fill
              className="object-contain rounded-lg shadow-md"
              data-ai-hint="document scan"
            />
          </div>
          <div className="text-center mt-4">
            {scanMedia.caption && <p className="text-muted-foreground italic">{scanMedia.caption}</p>}
            {scanMedia.url.endsWith('.pdf') && (
                 <Button asChild variant="outline" className="mt-4">
                 <a href={scanMedia.url} download>
                   <Download className="mr-2" />
                   Tải bản PDF
                 </a>
               </Button>
            )}
          </div>
        </div>
      )}

      {letter.sources && letter.sources.length > 0 && (
        <div className="mt-12 border-t pt-8">
            <h3 className="text-xl font-headline mb-4">Nguồn tham khảo</h3>
            <ul className="list-disc list-inside space-y-2">
                {letter.sources.map((source, index) =>(
                    <li key={index}>
                        <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center">
                            {source.label}
                            <ExternalLink className="ml-1.5 h-4 w-4" />
                        </a>
                    </li>
                ))}
            </ul>
        </div>
      )}

    </article>
  );
}
