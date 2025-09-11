'use client';

import { useState, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Calendar, Filter } from 'lucide-react';
import type { TimelineItem } from '@/lib/types';
import * as React from 'react';

interface TimelineFiltersProps {
  items: TimelineItem[];
  onFilteredItemsChange: (filteredItems: TimelineItem[]) => void;
}

export function TimelineFilters({ items, onFilteredItemsChange }: TimelineFiltersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [yearRange, setYearRange] = useState([1890, 1969]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const availableTypes = useMemo(() => {
    const types = Array.from(new Set(items.map(item => item.type)));
    return types.map(type => ({
      value: type,
      label: {
        'event': 'Sự kiện',
        'speech': 'Bài phát biểu',
        'poem': 'Thơ',
        'document': 'Văn kiện',
        'letter': 'Thư',
        'photo': 'Ảnh'
      }[type] || type
    }));
  }, [items]);

  const filteredItems = useMemo(() => {
    let filtered = items;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by year range
    filtered = filtered.filter(item => {
      return item.year >= yearRange[0] && item.year <= yearRange[1];
    });

    // Filter by types
    if (selectedTypes.length > 0) {
      filtered = filtered.filter(item => selectedTypes.includes(item.type));
    }

    return filtered;
  }, [items, searchTerm, yearRange, selectedTypes]);

  // Notify parent component when filtered items change
  React.useEffect(() => {
    onFilteredItemsChange(filteredItems);
  }, [filteredItems, onFilteredItemsChange]);

  const toggleType = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  return (
    <Card className="mb-8 shadow-xl border-0 bg-white/95 backdrop-blur-sm overflow-hidden">
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Search */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
              <Search className="h-4 w-4" />
              <span>Tìm kiếm</span>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Tìm kiếm theo tiêu đề, nội dung, địa điểm, thẻ..."
                className="pl-10 border-2 border-gray-200 focus:border-red-800 focus:ring-2 focus:ring-red-800/20 rounded-xl h-12"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Year Range Slider */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                <Calendar className="h-4 w-4" />
                <span>Khoảng thời gian</span>
              </div>
              <Badge variant="outline" className="bg-red-50 border-red-200 text-red-800 font-semibold">
                {yearRange[0]} - {yearRange[1]}
              </Badge>
            </div>
            <div className="px-3 py-2">
              <Slider
                value={yearRange}
                onValueChange={setYearRange}
                min={1890}
                max={1969}
                step={1}
                className="w-full [&_[role=slider]]:bg-red-800 [&_[role=slider]]:border-red-900"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-3 px-1">
                <div className="text-center">
                  <div className="font-medium">1890</div>
                  <div className="text-gray-400">Sinh</div>
                </div>
                <div className="text-center">
                  <div className="font-medium">1920</div>
                  <div className="text-gray-400">Tìm đường</div>
                </div>
                <div className="text-center">
                  <div className="font-medium">1945</div>
                  <div className="text-gray-400">Độc lập</div>
                </div>
                <div className="text-center">
                  <div className="font-medium">1969</div>
                  <div className="text-gray-400">Về với đời</div>
                </div>
              </div>
            </div>
          </div>

          {/* Type Filters */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
              <Filter className="h-4 w-4" />
              <span>Loại nội dung</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {availableTypes.map(type => (
                <Badge
                  key={type.value}
                  variant={selectedTypes.includes(type.value) ? "default" : "outline"}
                  className={`cursor-pointer transition-all duration-200 hover:scale-105 px-4 py-2 ${
                    selectedTypes.includes(type.value)
                      ? 'bg-red-800 hover:bg-red-900 text-white shadow-lg'
                      : 'bg-white hover:bg-red-50 border-red-200 text-red-800 hover:border-red-300'
                  }`}
                  onClick={() => toggleType(type.value)}
                >
                  {type.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Results Summary */}
          <div className="pt-3 border-t border-gray-200 bg-gradient-to-r from-red-50 to-amber-50 -mx-6 px-6 py-3 rounded-b-lg">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-700">
                Hiển thị <span className="font-bold text-red-800">{filteredItems.length}</span> trong tổng số{' '}
                <span className="font-semibold">{items.length}</span> sự kiện
              </p>
              {(searchTerm || selectedTypes.length > 0 || yearRange[0] !== 1890 || yearRange[1] !== 1969) && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setYearRange([1890, 1969]);
                    setSelectedTypes([]);
                  }}
                  className="text-xs text-red-800 hover:text-red-900 font-medium hover:underline"
                >
                  Xóa bộ lọc
                </button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
