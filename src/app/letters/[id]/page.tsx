import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Calendar, MapPin, FileText, ExternalLink } from 'lucide-react';
import lettersData from '@/data/letters.json';
import type { TimelineItem } from '@/lib/types';

const letters = lettersData as TimelineItem[];

export async function generateStaticParams() {
  return letters.map((letter) => ({
    id: letter.id,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const letter = letters.find((p) => p.id === id);
  if (!letter) {
    return { title: 'Không tìm thấy' };
  }
  return {
    title: letter.title,
    description: letter.summary,
  };
}

export default async function LetterDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const letter = letters.find((p) => p.id === id);

  if (!letter) {
    notFound();
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      'letter': 'Thư',
      'speech': 'Bài phát biểu',
      'poem': 'Thơ',
      'document': 'Văn kiện'
    };
    return typeMap[type] || type;
  };

  return (
    <article className="min-h-screen bg-gradient-to-br from-red-50/30 via-amber-50/30 to-yellow-50/30">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-800 to-red-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/patterns/lotus.svg')] opacity-10 bg-repeat bg-center"></div>
        <div className="relative container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <Button
              asChild
              variant="ghost"
              className="text-white hover:bg-white/20 mb-6 transition-all duration-200"
            >
              <Link href="/letters" className="inline-flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Quay lại danh sách</span>
              </Link>
            </Button>
            
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  {getTypeLabel(letter.type)}
                </Badge>
                <Badge variant="outline" className="bg-white/10 text-white border-white/30">
                  {letter.year}
                </Badge>
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                {letter.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-white/90">
                {letter.date && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(letter.date)}</span>
                  </div>
                )}
                {letter.location && (
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>{letter.location}</span>
                  </div>
                )}
              </div>
              
              {letter.summary && (
                <p className="text-lg md:text-xl text-white/95 leading-relaxed max-w-3xl">
                  {letter.summary}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2">
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8 md:p-12">
                  <div className="flex items-center space-x-2 mb-6">
                    <FileText className="h-5 w-5 text-red-800" />
                    <h2 className="text-xl font-semibold text-gray-900">Nội dung đầy đủ</h2>
                  </div>
                  
                  <Separator className="mb-8" />
                  
                  <div className="prose prose-lg max-w-none">
                    <div className="text-gray-800 leading-relaxed whitespace-pre-line text-base md:text-lg">
                      {letter.content}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Media */}
              {letter.media && letter.media.length > 0 && (
                <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Hình ảnh & Tài liệu</h3>
                    <div className="space-y-4">
                      {letter.media.map((item, index) => (
                        <div key={index} className="group">
                          <div className="aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                            <img
                              src={item.url}
                              alt={item.caption || letter.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          {item.caption && (
                            <p className="text-sm text-gray-600 mt-2 italic">
                              {item.caption}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Tags */}
              {letter.tags && letter.tags.length > 0 && (
                <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Chủ đề</h3>
                    <div className="flex flex-wrap gap-2">
                      {letter.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="bg-red-50 border-red-200 text-red-800">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Sources */}
              {letter.sources && letter.sources.length > 0 && (
                <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Nguồn tham khảo</h3>
                    <div className="space-y-3">
                      {letter.sources.map((source, index) => (
                        <a
                          key={index}
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 text-red-800 hover:text-red-900 transition-colors duration-200 group"
                        >
                          <ExternalLink className="h-4 w-4 group-hover:scale-110 transition-transform" />
                          <span className="text-sm hover:underline">{source.label}</span>
                        </a>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Related */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Khám phá thêm</h3>
                  <div className="space-y-3">
                    <Button asChild variant="outline" className="w-full justify-start border-red-200 text-red-800 hover:bg-red-50">
                      <Link href="/timeline">
                        <Calendar className="h-4 w-4 mr-2" />
                        Dòng thời gian
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full justify-start border-red-200 text-red-800 hover:bg-red-50">
                      <Link href="/gallery">
                        <FileText className="h-4 w-4 mr-2" />
                        Thư viện ảnh
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
