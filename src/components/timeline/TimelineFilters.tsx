'use client';

import { useState } from 'react';
import { useDebounce } from 'use-debounce';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { DocType } from '@/lib/types';
import * as React from 'react';

type TimelineFiltersProps = {
  onKeywordsChange: (keywords: string) => void;
  onYearChange: (range: [number, number]) => void;
  onTypeChange: (type: string) => void;
  minYear: number;
  maxYear: number;
};

const docTypes: { value: DocType | 'all'; label: string }[] = [
  { value: 'all', label: 'Tất cả' },
  { value: 'event', label: 'Sự kiện' },
  { value: 'poem', label: 'Thơ' },
  { value: 'letter', label: 'Thư' },
  { value: 'speech', label: 'Bài phát biểu' },
  { value: 'photo', label: 'Ảnh' },
  { value: 'document', label: 'Tài liệu' },
];

export function TimelineFilters({
  onKeywordsChange,
  onYearChange,
  onTypeChange,
  minYear,
  maxYear,
}: TimelineFiltersProps) {
  const [keywords, setKeywords] = useState('');
  const [yearRange, setYearRange] = useState<[number, number]>([minYear, maxYear]);

  const [debouncedKeywords] = useDebounce(keywords, 500);
  React.useEffect(() => {
    onKeywordsChange(debouncedKeywords);
  }, [debouncedKeywords, onKeywordsChange]);

  const handleSliderCommit = (value: [number, number]) => {
    onYearChange(value);
  };

  return (
    <div className="bg-card/80 backdrop-blur-sm p-6 rounded-2xl shadow-md border w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
      <div className="relative md:col-span-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Tìm kiếm theo từ khóa..."
          className="pl-10"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          aria-label="Tìm kiếm dòng thời gian"
        />
      </div>
      <div className="md:col-span-1 flex flex-col gap-2">
         <div className="flex justify-between items-center px-1">
            <span className="text-sm font-medium text-muted-foreground">Năm:</span>
            <span className="text-sm font-bold text-primary">{yearRange[0]} - {yearRange[1]}</span>
         </div>
        <Slider
          defaultValue={[minYear, maxYear]}
          min={minYear}
          max={maxYear}
          step={1}
          value={yearRange}
          onValueChange={(value) => setYearRange(value as [number, number])}
          onValueCommit={handleSliderCommit}
          aria-label="Lọc theo khoảng năm"
        />
      </div>
      <div className="md:col-span-1">
        <Select onValueChange={onTypeChange} defaultValue="all">
          <SelectTrigger aria-label="Lọc theo loại tư liệu">
            <SelectValue placeholder="Chọn loại tư liệu" />
          </SelectTrigger>
          <SelectContent>
            {docTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
