import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Clock, Trophy, BookOpen, Star, ArrowRight, Users, Target } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Quiz Lịch sử - Kiến thức về Chủ tịch Hồ Chí Minh',
  description: 'Thử thách kiến thức của bạn về cuộc đời, sự nghiệp và tư tưởng của Chủ tịch Hồ Chí Minh qua các câu hỏi trắc nghiệm thú vị.',
};

const quizSets = [
  {
    id: 'bac-ho-co-ban',
    title: 'Kiến thức cơ bản về Bác Hồ',
    description: 'Những câu hỏi về cuộc đời, sự nghiệp và tư tưởng cơ bản của Chủ tịch Hồ Chí Minh.',
    questions: 20,
    difficulty: 'bình thường',
    estimatedTime: 15,
    color: 'bg-green-500',
    topics: ['Tiểu sử', 'Sự kiện lịch sử', 'Văn bản quan trọng']
  },
  {
    id: 'ho-chi-minh-ideology',
    title: 'Tư tưởng Hồ Chí Minh',
    description: 'Hệ thống tư tưởng toàn diện và sâu sắc của lãnh tụ dân tộc về các vấn đề cơ bản của cách mạng.',
    questions: 29,
    difficulty: 'nâng cao',
    estimatedTime: 45,
    color: 'bg-red-600',
    topics: ['Chủ nghĩa Mác-Lênin', 'Độc lập dân tộc', 'Chủ nghĩa xã hội', 'Tư tưởng chính trị']
  },
  {
    id: 'lich-su-viet-nam',
    title: 'Lịch sử Việt Nam qua các thời kỳ',
    description: 'Kiến thức tổng quan về lịch sử dân tộc Việt Nam từ cổ đại đến hiện đại.',
    questions: 40,
    difficulty: 'THPT',
    estimatedTime: 25,
    color: 'bg-blue-500',
    topics: ['Thời kỳ phong kiến', 'Thời kỳ thuộc địa', 'Thời kỳ đổi mới']
  }
];

const achievements = [
  { icon: Star, title: 'Học giả lịch sử', description: 'Hoàn thành tất cả bộ quiz với điểm cao' },
  { icon: Target, title: 'Chuyên gia Bác Hồ', description: 'Đạt 90% điểm trong quiz về Bác Hồ' },
  { icon: Trophy, title: 'Bậc thầy tri thức', description: 'Hoàn thành 50 câu hỏi liên tiếp đúng' },
];

export default function QuizHomePage() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-red-50/30 via-orange-50/30 to-yellow-50/30">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-800 to-red-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/patterns/lotus.svg')] opacity-10 bg-repeat bg-center"></div>
        <div className="relative container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Quiz Lịch sử
            </h1>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed max-w-3xl mx-auto mb-8">
              Thử thách kiến thức của bạn về Chủ tịch Hồ Chí Minh và lịch sử dân tộc Việt Nam
              qua những câu hỏi trắc nghiệm thú vị và bổ ích
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="text-2xl font-bold">89</div>
                <div className="text-sm text-white/80">Câu hỏi</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="text-2xl font-bold">3</div>
                <div className="text-sm text-white/80">Bộ quiz</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="text-2xl font-bold">10</div>
                <div className="text-sm text-white/80">Chủ đề</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quiz Sets */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Chọn bộ quiz phù hợp
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {quizSets.map((quiz) => (
              <Card key={quiz.id} className="hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-0 overflow-hidden">
                <div className={`h-2 ${quiz.color}`}></div>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="bg-gray-100">
                      {quiz.difficulty}
                    </Badge>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      {quiz.estimatedTime} phút
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold">{quiz.title}</CardTitle>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {quiz.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center text-gray-600">
                        <BookOpen className="w-4 h-4 mr-1" />
                        {quiz.questions} câu hỏi
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700">Chủ đề:</p>
                      <div className="flex flex-wrap gap-1">
                        {quiz.topics.map((topic) => (
                          <Badge key={topic} variant="secondary" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <Button asChild className="w-full">
                      <Link href={`/quiz/${quiz.id}`}>
                        Bắt đầu quiz <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Features Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-3 h-6 w-6 text-red-600" />
                  Dành cho mọi độ tuổi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Từ học sinh THCS đến người lớn, mọi ai đều có thể tham gia và học hỏi 
                  kiến thức lịch sử một cách thú vị và bổ ích.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="mr-3 h-6 w-6 text-red-600" />
                  Theo dõi tiến độ
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Xem kết quả chi tiết, theo dõi điểm số và cải thiện kiến thức 
                  qua từng lần làm bài.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Achievements Preview */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-center mb-8 text-gray-900">
              Thành tích có thể đạt được
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {achievements.map((achievement) => {
                const Icon = achievement.icon;
                return (
                  <div key={achievement.title} className="text-center p-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">{achievement.title}</h4>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-red-800 to-red-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Sẵn sàng thử thách kiến thức?
            </h2>
            <p className="text-white/80 mb-8 text-lg">
              Hãy bắt đầu với bộ quiz cơ bản và khám phá những điều thú vị về lịch sử dân tộc
            </p>
            <Button asChild size="lg" className="bg-white text-red-800 hover:bg-red-50">
              <Link href="/quiz/bac-ho-co-ban">
                Bắt đầu ngay
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}