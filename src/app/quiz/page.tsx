"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Clock, 
  Trophy, 
  BookOpen, 
  Star, 
  ArrowRight, 
  Users, 
  Target, 
  Plus, 
  Settings,
  Loader2
} from 'lucide-react';

interface Quiz {
  id: string;
  title: string;
  description?: string;
  difficulty: string;
  category?: string;
  tags: string[];
  timeLimit?: number;
  isPublic: boolean;
  createdAt: string;
  author: {
    id: string;
    name?: string;
    email: string;
  };
  questions: Array<{
    id: string;
    question: string;
    type: string;
    difficulty: string;
  }>;
  _count: {
    results: number;
  };
}

const staticQuizSets = [
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
    id: 'ho-chi-minh-ideology-advanced',
    title: 'Tư tưởng Hồ Chí Minh - Nâng Cao',
    description: '50 câu trắc nghiệm nâng cao về Tư tưởng Hồ Chí Minh, dành cho sinh viên học phần đại học.',
    questions: 50,
    difficulty: 'chuyên sâu',
    estimatedTime: 60,
    color: 'bg-purple-600',
    topics: ['Cơ sở hình thành', 'Cách mạng giải phóng dân tộc', 'CNXH và con đường đi lên CNXH', 'Đảng, cán bộ, đạo đức', 'Nhà nước, dân chủ, đại đoàn kết', 'Văn hóa, con người']
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
  const [databaseQuizzes, setDatabaseQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDatabaseQuizzes = async () => {
      try {
        const response = await fetch('/api/quiz?limit=6');
        if (response.ok) {
          const data = await response.json();
          setDatabaseQuizzes(data.quizzes);
        }
      } catch (error) {
        console.error('Error loading database quizzes:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDatabaseQuizzes();
  }, []);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-orange-100 text-orange-800';
      case 'expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Dễ';
      case 'medium': return 'Trung bình';
      case 'hard': return 'Khó';
      case 'expert': return 'Chuyên gia';
      default: return difficulty;
    }
  };

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
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button asChild size="lg" className="bg-white text-red-800 hover:bg-white/90 px-8 py-3">
                <Link href="/quiz/create">
                  <Plus className="w-5 h-5 mr-2" />
                  Tạo Quiz Mới
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white hover:text-red-800 px-8 py-3">
                <Link href="/quiz/manage">
                  <Settings className="w-5 h-5 mr-2" />
                  Quản Lý Quiz
                </Link>
              </Button>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="text-2xl font-bold">{staticQuizSets.length + databaseQuizzes.length}</div>
                <div className="text-sm text-white/80">Bộ quiz</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="text-2xl font-bold">
                  {staticQuizSets.reduce((sum, quiz) => sum + quiz.questions, 0) + 
                   databaseQuizzes.reduce((sum, quiz) => sum + quiz.questions.length, 0)}
                </div>
                <div className="text-sm text-white/80">Câu hỏi</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="text-2xl font-bold">10+</div>
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
          
          {/* Database Quizzes */}
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
            </div>
          ) : databaseQuizzes.length > 0 && (
            <>
              <h3 className="text-xl font-semibold mb-6 text-gray-800">Quiz từ cộng đồng</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {databaseQuizzes.map((quiz) => (
                  <Card key={quiz.id} className="hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-0 overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge className={getDifficultyColor(quiz.difficulty)}>
                          {getDifficultyLabel(quiz.difficulty)}
                        </Badge>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="w-4 h-4 mr-1" />
                          {quiz.timeLimit || 'Không giới hạn'} phút
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
                            {quiz.questions.length} câu hỏi
                          </span>
                          <span className="flex items-center text-gray-600">
                            <Users className="w-4 h-4 mr-1" />
                            {quiz._count.results} lượt làm
                          </span>
                        </div>
                        
                        {quiz.tags && quiz.tags.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-700">Chủ đề:</p>
                            <div className="flex flex-wrap gap-1">
                              {quiz.tags.slice(0, 3).map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {quiz.tags.length > 3 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{quiz.tags.length - 3}
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                        
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
            </>
          )}

          {/* Static Quiz Sets */}
          <h3 className="text-xl font-semibold mb-6 text-gray-800">Quiz chính thức</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {staticQuizSets.map((quiz) => (
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

          {/* Achievements */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-8 mb-12">
            <h3 className="text-2xl font-bold text-center mb-8 text-gray-900">
              Thành tích có thể đạt được
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {achievements.map((achievement, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <achievement.icon className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold mb-2">{achievement.title}</h4>
                  <p className="text-gray-600 text-sm">{achievement.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center bg-gradient-to-r from-red-100 to-orange-100 rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-4 text-gray-900">
              Sẵn sàng thử thách bản thân?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Hãy bắt đầu với một trong những bộ quiz phía trên và khám phá kiến thức 
              về lịch sử, văn hóa và tư tưởng của dân tộc Việt Nam.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700">
                <Link href="/quiz/bac-ho-co-ban">
                  <Target className="w-5 h-5 mr-2" />
                  Bắt đầu ngay
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/quiz/create">
                  <Plus className="w-5 h-5 mr-2" />
                  Tạo quiz riêng
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}