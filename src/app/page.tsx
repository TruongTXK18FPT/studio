'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Calendar, MapPin, FileText, Quote } from 'lucide-react';
import { TimelineFilters } from '@/components/timeline/TimelineFilters';
import timelineData from '@/data/timeline.json';
import type { TimelineItem } from '@/lib/types';

export default function TimelinePage() {
  const allTimelineItems = timelineData as TimelineItem[];
  const [filteredItems, setFilteredItems] = useState<TimelineItem[]>(allTimelineItems);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'speech':
        return <Quote className="h-4 w-4" />;
      case 'poem':
        return <FileText className="h-4 w-4" />;
      case 'document':
        return <FileText className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      'event': 'Sự kiện',
      'speech': 'Bài phát biểu',
      'poem': 'Thơ',
      'document': 'Văn kiện'
    };
    return typeMap[type] || type;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <section className="w-full min-h-screen bg-gradient-to-br from-red-50/30 via-amber-50/30 to-yellow-50/30">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-800 to-red-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/patterns/lotus.svg')] opacity-10 bg-repeat bg-center"></div>
        <div className="relative container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Dòng Thời Gian Lịch Sử
            </h1>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed max-w-3xl mx-auto">
              Hành trình vĩ đại của một con người phi thường - từ Nguyễn Sinh Cung đến Chủ tịch Hồ Chí Minh, 
              vị lãnh tụ kính yêu của dân tộc Việt Nam
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="container mx-auto px-4 py-8">
        <TimelineFilters 
          items={allTimelineItems} 
          onFilteredItemsChange={setFilteredItems}
        />
      </div>

      {/* Timeline Content */}
      <div className="container mx-auto px-4 pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-red-800 via-red-700 to-red-900 transform md:-translate-x-px"></div>
            
            {/* Timeline items */}
            <div className="space-y-12">
              {filteredItems.map((item, index) => (
                <div key={item.id} className={`relative flex items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                  {/* Timeline dot */}
                  <div className="absolute left-8 md:left-1/2 w-4 h-4 bg-red-800 rounded-full transform -translate-x-2 md:-translate-x-2 z-10 border-4 border-white shadow-lg"></div>
                  
                  {/* Content card */}
                  <div className={`w-full md:w-1/2 ml-16 md:ml-0 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                    <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline" className="bg-red-50 border-red-200 text-red-800 flex items-center space-x-1">
                            {getTypeIcon(item.type)}
                            <span>{getTypeLabel(item.type)}</span>
                          </Badge>
                          <Badge variant="secondary" className="bg-amber-100 text-amber-800 font-semibold">
                            {item.year}
                          </Badge>
                        </div>
                        
                        <CardTitle className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">
                          {item.title}
                        </CardTitle>
                        
                        <CardDescription className="flex flex-wrap items-center gap-4 text-gray-600">
                          {item.date && (
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>{formatDate(item.date)}</span>
                            </div>
                          )}
                          {item.location && (
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-4 w-4" />
                              <span>{item.location}</span>
                            </div>
                          )}
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent className="pt-0">
                        <p className="text-gray-700 leading-relaxed mb-4">
                          {item.summary}
                        </p>
                        
                        {(item as any).content && (
                          <div className="bg-gradient-to-r from-red-50 to-amber-50 p-4 rounded-lg border-l-4 border-red-800 mb-4">
                            <p className="text-sm text-gray-800 leading-relaxed line-clamp-4">
                              {(item as any).content}
                            </p>
                          </div>
                        )}
                        
                        {/* Media */}
                        {item.media && item.media.length > 0 && (
                          <div className="mb-4">
                            <div className="grid grid-cols-1 gap-4">
                              {item.media.map((media, mediaIndex) => (
                                <div key={`${item.id}-media-${mediaIndex}`} className="group">
                                  <div className="aspect-[16/10] rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                                    <img
                                      src={media.url}
                                      alt={media.caption || item.title}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                  </div>
                                  {media.caption && (
                                    <p className="text-xs text-gray-600 mt-2 italic">
                                      {media.caption}
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Tags */}
                        {item.tags && item.tags.length > 0 && (
                          <>
                            <Separator className="mb-3" />
                            <div className="flex flex-wrap gap-2">
                              {item.tags.map((tag, tagIndex) => (
                                <Badge key={`${item.id}-tag-${tagIndex}`} variant="outline" className="text-xs bg-gray-50 border-gray-200 text-gray-700">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>

            {/* No results message */}
            {filteredItems.length === 0 && (
              <div className="text-center py-16">
                <div className="max-w-md mx-auto">
                  <Quote className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy kết quả</h3>
                  <p className="text-gray-600">
                    Hãy thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm của bạn.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Footer quote */}
      <div className="bg-gradient-to-r from-red-800 to-red-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Quote className="h-12 w-12 text-white/50 mx-auto mb-6" />
            <blockquote className="text-2xl md:text-3xl font-light italic leading-relaxed mb-4">
              "Không có gì quý hơn độc lập, tự do!"
            </blockquote>
            <cite className="text-white/80 text-lg">— Chủ tịch Hồ Chí Minh —</cite>
          </div>
        </div>
      </div>
    </section>
  );
}
