'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Send, 
  PenTool, 
  User, 
  Tag, 
  Link, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  Upload,
  Image as ImageIcon
} from 'lucide-react';

const formSchema = z.object({
  title: z.string()
    .min(10, { message: 'Tiêu đề phải có ít nhất 10 ký tự.' })
    .max(150, {message: 'Tiêu đề không quá 150 ký tự.'}),
  content: z.string()
    .min(50, { message: 'Nội dung phải có ít nhất 50 ký tự.' })
    .max(5000, { message: 'Nội dung không quá 5000 ký tự.' }),
  author: z.string().optional(),
  sourceLink: z.string()
    .url({ message: 'Vui lòng nhập một URL hợp lệ.' })
    .optional()
    .or(z.literal('')),
  tags: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function CommunityForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      content: '',
      author: '',
      sourceLink: '',
      tags: '',
    },
  });

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/community/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: values.title,
          content: values.content,
          tags: values.tags?.split(',').map(tag => tag.trim()).filter(Boolean) || [],
          author: values.author,
          sourceLink: values.sourceLink,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitSuccess(true);
        toast({
          title: 'Gửi bài viết thành công!',
          description: 'Bài viết của bạn đã được lưu vào hệ thống và đang chờ kiểm duyệt. Cảm ơn bạn đã đóng góp!',
        });
        form.reset();
        
        // Reset success state after 5 seconds
        setTimeout(() => setSubmitSuccess(false), 5000);
      } else {
        throw new Error(data.error || 'Không thể gửi bài viết');
      }
      
    } catch (error) {
      console.error('Submit error:', error);
      toast({
        title: 'Đã có lỗi xảy ra',
        description: error instanceof Error ? error.message : 'Không thể gửi bài viết. Vui lòng thử lại.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const watchedContent = form.watch('content');
  const contentLength = watchedContent?.length || 0;
  const contentProgress = Math.min((contentLength / 5000) * 100, 100);

  if (submitSuccess) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Cảm ơn bạn đã đóng góp!</h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          Bài viết của bạn đã được gửi thành công và đang trong quá trình xem xét. 
          Chúng tôi sẽ thông báo kết quả sớm nhất có thể.
        </p>
        <Button 
          onClick={() => setSubmitSuccess(false)}
          className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
        >
          Đóng góp thêm bài viết khác
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Progress Indicator */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
            <PenTool className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Biểu mẫu đóng góp</h3>
            <p className="text-sm text-gray-600">Vui lòng điền đầy đủ thông tin</p>
          </div>
        </div>
        <Badge variant="outline" className="border-red-200 text-red-700">
          {Object.keys(form.formState.errors).length === 0 ? 'Hợp lệ' : 'Cần kiểm tra'}
        </Badge>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Title Field */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-red-600" />
                  <span>Tiêu đề bài viết *</span>
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Ví dụ: Kỷ niệm về chuyến thăm của Bác tại tỉnh Nghệ An năm 1957..." 
                    className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                    {...field} 
                  />
                </FormControl>
                <div className="flex justify-between text-xs text-gray-500">
                  <FormMessage />
                  <span>{field.value?.length || 0}/150</span>
                </div>
              </FormItem>
            )}
          />

          {/* Content Field */}
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center space-x-2">
                  <PenTool className="w-4 h-4 text-red-600" />
                  <span>Nội dung bài viết *</span>
                </FormLabel>
                <FormControl>
                  <div className="space-y-2">
                    <Textarea 
                      placeholder="Chia sẻ câu chuyện, tư liệu hoặc kiến thức của bạn về Chủ tịch Hồ Chí Minh. Hãy viết một cách chân thực, có cảm xúc và đầy đủ thông tin..."
                      rows={12}
                      className="border-gray-300 focus:border-red-500 focus:ring-red-500 resize-none"
                      {...field} 
                    />
                    {/* Content Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Tiến độ nội dung</span>
                        <span>{contentLength}/5000 ký tự</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-gradient-to-r from-red-500 to-red-600 h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${contentProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Author Field */}
          <FormField
            control={form.control}
            name="author"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-red-600" />
                  <span>Tên tác giả</span>
                  <Badge variant="secondary" className="text-xs">Tùy chọn</Badge>
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Tên của bạn sẽ được hiển thị cùng bài viết (nếu để trống sẽ hiển thị 'Ẩn danh')"
                    className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Tags Field */}
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center space-x-2">
                  <Tag className="w-4 h-4 text-red-600" />
                  <span>Thẻ phân loại</span>
                  <Badge variant="secondary" className="text-xs">Tùy chọn</Badge>
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Ví dụ: kỷ niệm, tư liệu, giản dị, cách mạng"
                    className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                    {...field} 
                  />
                </FormControl>
                <p className="text-xs text-gray-500">Phân cách các thẻ bằng dấu phẩy. Thẻ giúp phân loại và tìm kiếm bài viết dễ dàng hơn.</p>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Source Link Field */}
          <FormField
            control={form.control}
            name="sourceLink"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center space-x-2">
                  <Link className="w-4 h-4 text-red-600" />
                  <span>Nguồn tham khảo</span>
                  <Badge variant="secondary" className="text-xs">Tùy chọn</Badge>
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="https://example.com/source-document"
                    className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                    {...field} 
                  />
                </FormControl>
                <p className="text-xs text-gray-500">URL đến tài liệu gốc, sách báo, hoặc nguồn tham khảo đáng tin cậy.</p>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Image Upload Placeholder */}
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50">
            <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">Tải lên hình ảnh</h4>
            <p className="text-sm text-gray-600 mb-4">
              Hình ảnh minh họa sẽ làm bài viết của bạn sinh động và hấp dẫn hơn
            </p>
            <Button 
              type="button" 
              variant="outline" 
              className="border-red-300 text-red-700 hover:bg-red-50"
              disabled
            >
              <Upload className="w-4 h-4 mr-2" />
              Chọn hình ảnh (Sắp có)
            </Button>
            <p className="text-xs text-gray-500 mt-2">
              Hỗ trợ JPG, PNG, GIF. Kích thước tối đa 5MB
            </p>
          </div>

          {/* Terms Notice */}
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Cam kết của bạn:</strong> Bằng việc gửi bài viết, bạn xác nhận rằng nội dung là do bạn tự viết hoặc có quyền sử dụng, 
              không vi phạm bản quyền và tuân thủ các quy định của trang web. Bài viết sẽ được kiểm duyệt trước khi đăng tải.
            </AlertDescription>
          </Alert>

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <Button 
              type="submit" 
              size="lg" 
              disabled={isSubmitting}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transform transition hover:scale-105 disabled:transform-none disabled:opacity-50 min-w-[200px]"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  Đang gửi...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-5 w-5" />
                  Gửi bài viết
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
