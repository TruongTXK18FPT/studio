"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Plus, 
  Trash2, 
  Save, 
  Eye, 
  EyeOff, 
  BookOpen, 
  Target,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Choice {
  id: string;
  text: string;
  isCorrect: boolean;
  order: number;
}

interface Question {
  id: string;
  question: string;
  type: 'single' | 'multiple' | 'true_false';
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  explanation?: string;
  topic?: string;
  order: number;
  choices: Choice[];
}

interface QuizFormData {
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  category: string;
  tags: string[];
  timeLimit?: number;
  isPublic: boolean;
  questions: Question[];
}

export default function QuizForm() {
  const [formData, setFormData] = useState<QuizFormData>({
    title: '',
    description: '',
    difficulty: 'medium',
    category: '',
    tags: [],
    timeLimit: undefined,
    isPublic: true,
    questions: []
  });

  const [newTag, setNewTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Thêm câu hỏi mới
  const addQuestion = () => {
    const newQuestion: Question = {
      id: `q_${Date.now()}`,
      question: '',
      type: 'single',
      difficulty: 'medium',
      explanation: '',
      topic: '',
      order: formData.questions.length,
      choices: [
        { id: `c_${Date.now()}_1`, text: '', isCorrect: false, order: 0 },
        { id: `c_${Date.now()}_2`, text: '', isCorrect: false, order: 1 }
      ]
    };

    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
  };

  // Xóa câu hỏi
  const removeQuestion = (questionId: string) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId)
    }));
  };

  // Cập nhật câu hỏi
  const updateQuestion = (questionId: string, field: keyof Question, value: any) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === questionId ? { ...q, [field]: value } : q
      )
    }));
  };

  // Thêm lựa chọn
  const addChoice = (questionId: string) => {
    const question = formData.questions.find(q => q.id === questionId);
    if (!question) return;

    const newChoice: Choice = {
      id: `c_${Date.now()}`,
      text: '',
      isCorrect: false,
      order: question.choices.length
    };

    updateQuestion(questionId, 'choices', [...question.choices, newChoice]);
  };

  // Xóa lựa chọn
  const removeChoice = (questionId: string, choiceId: string) => {
    const question = formData.questions.find(q => q.id === questionId);
    if (!question || question.choices.length <= 2) return;

    updateQuestion(questionId, 'choices', 
      question.choices.filter(c => c.id !== choiceId)
    );
  };

  // Cập nhật lựa chọn
  const updateChoice = (questionId: string, choiceId: string, field: keyof Choice, value: any) => {
    const question = formData.questions.find(q => q.id === questionId);
    if (!question) return;

    const updatedChoices = question.choices.map(c => 
      c.id === choiceId ? { ...c, [field]: value } : c
    );

    updateQuestion(questionId, 'choices', updatedChoices);
  };

  // Thêm tag
  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  // Xóa tag
  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Tiêu đề không được để trống';
    }

    if (formData.questions.length === 0) {
      newErrors.questions = 'Phải có ít nhất 1 câu hỏi';
    }

    formData.questions.forEach((question, index) => {
      if (!question.question.trim()) {
        newErrors[`question_${index}`] = 'Câu hỏi không được để trống';
      }

      const correctChoices = question.choices.filter(c => c.isCorrect);
      if (correctChoices.length === 0) {
        newErrors[`question_${index}_correct`] = 'Phải có ít nhất 1 đáp án đúng';
      }

      if (question.type === 'single' && correctChoices.length > 1) {
        newErrors[`question_${index}_single`] = 'Câu hỏi đơn chỉ được có 1 đáp án đúng';
      }

      question.choices.forEach((choice, choiceIndex) => {
        if (!choice.text.trim()) {
          newErrors[`question_${index}_choice_${choiceIndex}`] = 'Lựa chọn không được để trống';
        }
      });
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit form
  const handleSubmit = async () => {
    if (!validateForm()) {
      toast({
        title: "Lỗi validation",
        description: "Vui lòng kiểm tra lại thông tin",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "Thành công",
          description: "Quiz đã được tạo thành công!",
        });
        
        // Reset form
        setFormData({
          title: '',
          description: '',
          difficulty: 'medium',
          category: '',
          tags: [],
          timeLimit: undefined,
          isPublic: true,
          questions: []
        });
        setErrors({});
      } else {
        const error = await response.json();
        toast({
          title: "Lỗi",
          description: error.error || "Không thể tạo quiz",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi tạo quiz",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-xl mb-4">
          <BookOpen className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Tạo Quiz Mới
        </h1>
        <p className="text-gray-600">
          Tạo bộ câu hỏi trắc nghiệm để chia sẻ kiến thức với cộng đồng
        </p>
      </div>

      {/* Basic Info */}
      <Card className="border-2 border-blue-200 bg-white/95 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Target className="w-5 h-5 text-blue-600" />
            Thông Tin Cơ Bản
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Tiêu đề Quiz *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Nhập tiêu đề quiz..."
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Danh mục</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                placeholder="Ví dụ: Tư tưởng Hồ Chí Minh, Lịch sử Việt Nam..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Mô tả ngắn gọn về nội dung quiz..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="difficulty">Độ khó</Label>
              <Select
                value={formData.difficulty}
                onValueChange={(value: any) => setFormData(prev => ({ ...prev, difficulty: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Dễ</SelectItem>
                  <SelectItem value="medium">Trung bình</SelectItem>
                  <SelectItem value="hard">Khó</SelectItem>
                  <SelectItem value="expert">Chuyên gia</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeLimit">Thời gian (phút)</Label>
              <Input
                id="timeLimit"
                type="number"
                min="1"
                max="180"
                value={formData.timeLimit || ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  timeLimit: e.target.value ? parseInt(e.target.value) : undefined 
                }))}
                placeholder="Không giới hạn"
              />
            </div>

            <div className="space-y-2">
              <Label>Trạng thái</Label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isPublic"
                  checked={formData.isPublic}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPublic: !!checked }))}
                />
                <Label htmlFor="isPublic" className="flex items-center gap-2">
                  {formData.isPublic ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  Công khai
                </Label>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Thẻ tag</Label>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Nhập tag..."
                onKeyPress={(e) => e.key === 'Enter' && addTag()}
              />
              <Button type="button" onClick={addTag} variant="outline">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 hover:text-red-500"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Questions */}
      <Card className="border-2 border-green-200 bg-white/95 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-xl">
              <BookOpen className="w-5 h-5 text-green-600" />
              Câu Hỏi ({formData.questions.length})
            </CardTitle>
            <Button onClick={addQuestion} className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Thêm Câu Hỏi
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {errors.questions && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errors.questions}</AlertDescription>
            </Alert>
          )}

          {formData.questions.map((question, questionIndex) => (
            <Card key={question.id} className="border border-gray-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Câu hỏi {questionIndex + 1}</CardTitle>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeQuestion(question.id)}
                    disabled={formData.questions.length <= 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Question Text */}
                <div className="space-y-2">
                  <Label>Câu hỏi *</Label>
                  <Textarea
                    value={question.question}
                    onChange={(e) => updateQuestion(question.id, 'question', e.target.value)}
                    placeholder="Nhập câu hỏi..."
                    className={errors[`question_${questionIndex}`] ? 'border-red-500' : ''}
                  />
                  {errors[`question_${questionIndex}`] && (
                    <p className="text-sm text-red-500">{errors[`question_${questionIndex}`]}</p>
                  )}
                </div>

                {/* Question Settings */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Loại câu hỏi</Label>
                    <Select
                      value={question.type}
                      onValueChange={(value: any) => updateQuestion(question.id, 'type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">Chọn 1 đáp án</SelectItem>
                        <SelectItem value="multiple">Chọn nhiều đáp án</SelectItem>
                        <SelectItem value="true_false">Đúng/Sai</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Độ khó</Label>
                    <Select
                      value={question.difficulty}
                      onValueChange={(value: any) => updateQuestion(question.id, 'difficulty', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Dễ</SelectItem>
                        <SelectItem value="medium">Trung bình</SelectItem>
                        <SelectItem value="hard">Khó</SelectItem>
                        <SelectItem value="expert">Chuyên gia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Chủ đề</Label>
                    <Input
                      value={question.topic || ''}
                      onChange={(e) => updateQuestion(question.id, 'topic', e.target.value)}
                      placeholder="Chủ đề câu hỏi..."
                    />
                  </div>
                </div>

                {/* Explanation */}
                <div className="space-y-2">
                  <Label>Giải thích</Label>
                  <Textarea
                    value={question.explanation || ''}
                    onChange={(e) => updateQuestion(question.id, 'explanation', e.target.value)}
                    placeholder="Giải thích đáp án đúng..."
                    rows={2}
                  />
                </div>

                {/* Choices */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Lựa chọn</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addChoice(question.id)}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Thêm lựa chọn
                    </Button>
                  </div>

                  {question.choices.map((choice, choiceIndex) => (
                    <div key={choice.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <Checkbox
                        checked={choice.isCorrect}
                        onCheckedChange={(checked) => updateChoice(question.id, choice.id, 'isCorrect', checked)}
                      />
                      <Input
                        value={choice.text}
                        onChange={(e) => updateChoice(question.id, choice.id, 'text', e.target.value)}
                        placeholder={`Lựa chọn ${choiceIndex + 1}...`}
                        className={errors[`question_${questionIndex}_choice_${choiceIndex}`] ? 'border-red-500' : ''}
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeChoice(question.id, choice.id)}
                        disabled={question.choices.length <= 2}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}

                  {errors[`question_${questionIndex}_correct`] && (
                    <p className="text-sm text-red-500">{errors[`question_${questionIndex}_correct`]}</p>
                  )}
                  {errors[`question_${questionIndex}_single`] && (
                    <p className="text-sm text-red-500">{errors[`question_${questionIndex}_single`]}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-center">
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-3"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Đang tạo...
            </>
          ) : (
            <>
              <Save className="w-5 h-5 mr-2" />
              Tạo Quiz
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
