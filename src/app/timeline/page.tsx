'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, MapPin, FileText, Quote, Eye, ExternalLink, Heart, Share2, Clock } from 'lucide-react';
import { TimelineFilters } from '@/components/timeline/TimelineFilters';
import timelineData from '@/data/timeline.json';
import type { TimelineItem } from '@/lib/types';

export default function TimelinePage() {
  const allTimelineItems = timelineData as TimelineItem[];
  const [filteredItems, setFilteredItems] = useState<TimelineItem[]>(allTimelineItems);
  const [visibleItems, setVisibleItems] = useState<Set<string>>(new Set());
  const [selectedItem, setSelectedItem] = useState<TimelineItem | null>(null);
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());

  // Intersection Observer for animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleItems(prev => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.2, rootMargin: '50px' }
    );

    const timelineCards = document.querySelectorAll('[data-timeline-card]');
    timelineCards.forEach(card => observer.observe(card));

    return () => observer.disconnect();
  }, [filteredItems]);

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

  const handleLike = (itemId: string) => {
    setLikedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const handleShare = async (item: TimelineItem) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: item.summary,
          url: window.location.href + '#' + item.id,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${item.title} - ${window.location.href}#${item.id}`);
    }
  };

  return (
    <section className="w-full min-h-screen bg-gradient-to-br from-red-50/30 via-amber-50/30 to-yellow-50/30">
      {/* Header with parallax effect */}
      <div className="bg-gradient-to-r from-red-800 to-red-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/patterns/lotus.svg')] opacity-10 bg-repeat bg-center animate-pulse"></div>
        <div className="relative container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="animate-fade-in-up">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-red-100 bg-clip-text text-transparent">
                Dòng Thời Gian Lịch Sử
              </h1>
              <p className="text-xl md:text-2xl text-white/90 leading-relaxed max-w-3xl mx-auto">
                Hành trình vĩ đại của một con người phi thường - từ Nguyễn Sinh Cung đến Chủ tịch Hồ Chí Minh, 
                vị lãnh tụ kính yêu của dân tộc Việt Nam
              </p>
            </div>
            
            {/* Stats */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="text-2xl font-bold">{allTimelineItems.length}</div>
                <div className="text-sm text-white/80">Sự kiện lịch sử</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="text-2xl font-bold">79</div>
                <div className="text-sm text-white/80">Năm cuộc đời</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="text-2xl font-bold">30</div>
                <div className="text-sm text-white/80">Năm tìm đường cứu nước</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <TimelineFilters 
            items={allTimelineItems} 
            onFilteredItemsChange={setFilteredItems}
          />
        </div>
      </div>

      {/* Timeline Content */}
      <div className="container mx-auto px-4 pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="relative">
            {/* Animated timeline line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-red-800 via-red-700 to-red-900 transform md:-translate-x-px">
              <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-red-600 to-transparent animate-pulse"></div>
            </div>
            
            {/* Timeline items */}
            <div className="space-y-12">
              {filteredItems.map((item, index) => {
                const isVisible = visibleItems.has(item.id);
                const isEven = index % 2 === 0;
                
                return (
                  <div 
                    key={item.id} 
                    id={item.id}
                    data-timeline-card
                    className={`relative flex items-center transition-all duration-1000 ${isEven ? 'md:flex-row-reverse' : ''} ${
                      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}
                    style={{ transitionDelay: `${index * 0.1}s` }}
                  >
                    {/* Animated timeline dot */}
                    <div className={`absolute left-8 md:left-1/2 w-6 h-6 bg-gradient-to-br from-red-600 to-red-800 rounded-full transform -translate-x-3 md:-translate-x-3 z-10 border-4 border-white shadow-lg transition-all duration-500 ${
                      isVisible ? 'scale-100' : 'scale-0'
                    }`}>
                      <div className="absolute inset-0 bg-red-600 rounded-full animate-ping opacity-20"></div>
                    </div>
                    
                    {/* Year indicator */}
                    <div className={`absolute left-16 md:left-1/2 top-0 transform ${isEven ? 'md:-translate-x-20' : 'md:translate-x-8'} ${
                      isVisible ? 'opacity-100' : 'opacity-0'
                    } transition-all duration-700`}>
                      <Badge className="bg-gradient-to-r from-amber-400 to-amber-600 text-amber-900 font-bold text-lg px-3 py-1 shadow-lg">
                        {item.year}
                      </Badge>
                    </div>
                    
                    {/* Content card */}
                    <div className={`w-full md:w-1/2 ml-16 md:ml-0 mt-8 ${isEven ? 'md:pr-12' : 'md:pl-12'}`}>
                      <Card className={`shadow-xl border-0 bg-white/95 backdrop-blur-sm transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] group ${
                        isVisible ? 'translate-x-0' : isEven ? 'translate-x-10' : '-translate-x-10'
                      }`}>
                        <CardHeader className="pb-4">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="outline" className="bg-red-50 border-red-200 text-red-800 flex items-center space-x-1">
                              {getTypeIcon(item.type)}
                              <span>{getTypeLabel(item.type)}</span>
                            </Badge>
                            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleLike(item.id)}
                                className={`hover:bg-red-50 ${likedItems.has(item.id) ? 'text-red-600' : 'text-gray-400'}`}
                              >
                                <Heart className={`h-4 w-4 ${likedItems.has(item.id) ? 'fill-current' : ''}`} />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleShare(item)}
                                className="hover:bg-blue-50 text-gray-400 hover:text-blue-600"
                              >
                                <Share2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <CardTitle className="text-xl md:text-2xl font-bold text-gray-900 leading-tight group-hover:text-red-800 transition-colors">
                            {item.title}
                          </CardTitle>
                          
                          <CardDescription className="flex flex-wrap items-center gap-4 text-gray-600">
                            {item.date && (
                              <span className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span>{formatDate(item.date)}</span>
                              </span>
                            )}
                            {item.location && (
                              <span className="flex items-center space-x-1">
                                <MapPin className="h-4 w-4" />
                                <span className="line-clamp-1">{item.location}</span>
                              </span>
                            )}
                            <span className="flex items-center space-x-1 text-red-600">
                              <Clock className="h-4 w-4" />
                              <span>{item.year}</span>
                            </span>
                          </CardDescription>
                        </CardHeader>
                        
                        <CardContent className="pt-0">
                          <p className="text-gray-700 leading-relaxed mb-4 line-clamp-3">
                            {item.summary}
                          </p>
                          
                          {/* Media preview */}
                          {item.media && item.media.length > 0 && (
                            <div className="mb-4">
                              <div className="aspect-[16/9] rounded-lg overflow-hidden bg-gray-100 border border-gray-200 group-hover:border-red-200 transition-colors">
                                <img
                                  src={item.media[0].url}
                                  alt={item.media[0].caption || item.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                              </div>
                              {item.media[0].caption && (
                                <p className="text-xs text-gray-600 mt-2 italic">
                                  {item.media[0].caption}
                                </p>
                              )}
                            </div>
                          )}
                          
                          {/* Tags */}
                          {item.tags && item.tags.length > 0 && (
                            <>
                              <Separator className="mb-3" />
                              <div className="flex flex-wrap gap-2 mb-4">
                                {item.tags.slice(0, 3).map((tag, tagIndex) => (
                                  <Badge key={`${item.id}-tag-${tagIndex}`} variant="outline" className="text-xs bg-gray-50 border-gray-200 text-gray-700 hover:bg-red-50 hover:border-red-200 transition-colors">
                                    #{tag}
                                  </Badge>
                                ))}
                                {item.tags.length > 3 && (
                                  <Badge variant="outline" className="text-xs bg-gray-50 border-gray-200 text-gray-700">
                                    +{item.tags.length - 3} thêm
                                  </Badge>
                                )}
                              </div>
                            </>
                          )}

                          {/* Action buttons */}
                          <div className="flex items-center justify-between">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => setSelectedItem(item)}
                                  className="border-red-200 text-red-700 hover:bg-red-50"
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  Xem chi tiết
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle className="text-2xl font-bold text-red-800">
                                    {selectedItem?.title}
                                  </DialogTitle>
                                </DialogHeader>
                                {selectedItem && (
                                  <div className="space-y-6">
                                    <div className="flex flex-wrap items-center gap-4 text-gray-600">
                                      {selectedItem.date && (
                                        <div className="flex items-center space-x-1">
                                          <Calendar className="h-4 w-4" />
                                          <span>{formatDate(selectedItem.date)}</span>
                                        </div>
                                      )}
                                      {selectedItem.location && (
                                        <div className="flex items-center space-x-1">
                                          <MapPin className="h-4 w-4" />
                                          <span>{selectedItem.location}</span>
                                        </div>
                                      )}
                                    </div>
                                    
                                    <p className="text-gray-700 leading-relaxed text-lg">
                                      {selectedItem.summary}
                                    </p>
                                    
                                    {(selectedItem as any).content && (
                                      <div className="bg-gradient-to-r from-red-50 to-amber-50 p-6 rounded-lg border-l-4 border-red-800">
                                        <h4 className="font-semibold text-red-800 mb-3">Nội dung chi tiết:</h4>
                                        <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                                          {(selectedItem as any).content}
                                        </p>
                                      </div>
                                    )}
                                    
                                    {selectedItem.media && selectedItem.media.length > 0 && (
                                      <div className="space-y-4">
                                        <h4 className="font-semibold text-gray-900">Hình ảnh & Tài liệu:</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                          {selectedItem.media.map((media, mediaIndex) => (
                                            <div key={`${selectedItem.id}-media-${mediaIndex}`} className="group">
                                              <div className="aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                                                <img
                                                  src={media.url}
                                                  alt={media.caption || selectedItem.title}
                                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                              </div>
                                              {media.caption && (
                                                <p className="text-sm text-gray-600 mt-2 italic">
                                                  {media.caption}
                                                </p>
                                              )}
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                    
                                    {selectedItem.sources && selectedItem.sources.length > 0 && (
                                      <div className="space-y-3">
                                        <h4 className="font-semibold text-gray-900">Nguồn tham khảo:</h4>
                                        <div className="space-y-2">
                                          {selectedItem.sources.map((source, index) => (
                                            <a
                                              key={index}
                                              href={source.url}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="flex items-center space-x-2 text-red-800 hover:text-red-900 transition-colors duration-200 group"
                                            >
                                              <ExternalLink className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                              <span className="hover:underline">{source.label}</span>
                                            </a>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>

                            <div className="text-xs text-gray-500">
                              {likedItems.has(item.id) && (
                                <span className="flex items-center space-x-1 text-red-600">
                                  <Heart className="h-3 w-3 fill-current" />
                                  <span>Đã thích</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* No results message */}
            {filteredItems.length === 0 && (
              <div className="text-center py-16 animate-fade-in">
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
      
      {/* Footer quote with animation */}
      <div className="bg-gradient-to-r from-red-800 to-red-900 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/patterns/lotus.svg')] opacity-5 bg-repeat bg-center"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="animate-fade-in-up">
              <Quote className="h-12 w-12 text-white/50 mx-auto mb-6" />
              <blockquote className="text-2xl md:text-3xl font-light italic leading-relaxed mb-4">
                "Không có gì quý hơn độc lập, tự do!"
              </blockquote>
              <cite className="text-white/80 text-lg">— Chủ tịch Hồ Chí Minh —</cite>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out;
        }
        
        .animate-fade-in {
          animation: fade-in-up 0.8s ease-out;
        }
        
        .line-clamp-1 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
        }
        
        .line-clamp-3 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
        }
      `}</style>
    </section>
  );
}