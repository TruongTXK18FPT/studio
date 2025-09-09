import type { Metadata } from 'next';
import { CommunityForm } from '@/components/community/CommunityForm';

export const metadata: Metadata = {
  title: 'Chia sẻ bài viết',
  description: 'Đóng góp bài viết, tư liệu hoặc câu chuyện của bạn cho cộng đồng.',
};

export default function SubmitPage() {
  return (
    <section className="max-w-3xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-primary">Đóng Góp Bài Viết</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Bài viết của bạn sẽ được xem xét và duyệt trước khi hiển thị. Cảm ơn sự đóng góp của bạn!
        </p>
      </div>
      <CommunityForm />
    </section>
  );
}
