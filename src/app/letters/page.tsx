import type { Metadata } from 'next';
import Link from 'next/link';
import lettersData from '@/data/letters.json';
import type { TimelineItem } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Thư & Văn bản',
  description: 'Tuyển tập các bức thư, bài thơ, bài phát biểu và văn bản gốc của Chủ tịch Hồ Chí Minh.',
};

export default function LettersPage() {
  const letters = lettersData as TimelineItem[];

  return (
    <section className="w-full">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-primary">Thư & Văn Bản Gốc</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
          Tuyển tập các bức thư, bài phát biểu, bài thơ và các văn kiện quan trọng do Chủ tịch Hồ Chí Minh chấp bút.
        </p>
      </div>
      
      {/* Add filters here in a client component if needed */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {letters.map((letter) => (
          <Link href={`/letters/${letter.id}`} key={letter.id} className="block hover:translate-y-[-2px] transition-transform duration-200">
            <Card className="h-full flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl font-headline mb-2">{letter.title}</CardTitle>
                  <Badge variant="secondary">{letter.year}</Badge>
                </div>
                <CardDescription>{letter.location}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground line-clamp-3">{letter.summary}</p>
              </CardContent>
              <CardFooter>
                 <Badge variant="outline">{letter.type}</Badge>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
