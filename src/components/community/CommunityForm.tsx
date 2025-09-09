'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Send } from 'lucide-react';

const formSchema = z.object({
  title: z.string().min(10, { message: 'Tiêu đề phải có ít nhất 10 ký tự.' }).max(150, {message: 'Tiêu đề không quá 150 ký tự.'}),
  content: z.string().min(50, { message: 'Nội dung phải có ít nhất 50 ký tự.' }),
  author: z.string().optional(),
  sourceLink: z.string().url({ message: 'Vui lòng nhập một URL hợp lệ.' }).optional().or(z.literal('')),
  tags: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function CommunityForm() {
  const { toast } = useToast();
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

  function onSubmit(values: FormValues) {
    try {
      const newPost = {
        id: `post-${Date.now()}`,
        ...values,
        tags: values.tags?.split(',').map(tag => tag.trim()).filter(Boolean),
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      // Mock save to localStorage
      const existingPosts = JSON.parse(localStorage.getItem('community_posts') || '[]');
      localStorage.setItem('community_posts', JSON.stringify([...existingPosts, newPost]));

      toast({
        title: 'Gửi bài viết thành công!',
        description: 'Bài viết của bạn đã được gửi và đang chờ kiểm duyệt. Cảm ơn bạn đã đóng góp!',
      });
      form.reset();
    } catch (error) {
       toast({
        title: 'Đã có lỗi xảy ra',
        description: 'Không thể gửi bài viết. Vui lòng thử lại.',
        variant: 'destructive',
      });
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tiêu đề bài viết</FormLabel>
                  <FormControl>
                    <Input placeholder="Ví dụ: Kỷ niệm về chuyến thăm của Bác tại..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nội dung</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Chia sẻ câu chuyện hoặc tư liệu của bạn ở đây..." rows={10} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên tác giả (Tùy chọn)</FormLabel>
                  <FormControl>
                    <Input placeholder="Tên của bạn sẽ được hiển thị cùng bài viết" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thẻ (Phân cách bằng dấu phẩy)</FormLabel>
                  <FormControl>
                    <Input placeholder="Ví dụ: kỷ niệm, tư liệu, giản dị" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="sourceLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link nguồn (Tùy chọn)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/source" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Optional image upload can be added here */}

            <Button type="submit" size="lg" disabled={form.formState.isSubmitting}>
              <Send className="mr-2 h-5 w-5" />
              Gửi bài viết
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
