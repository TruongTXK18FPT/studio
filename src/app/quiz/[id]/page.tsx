'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Clock, CheckCircle, XCircle, Trophy, Star, ArrowLeft, RotateCcw } from 'lucide-react'
import Link from 'next/link'
import { QuizQuestion, QuizResult } from '@/lib/types'

interface QuizData {
  title: string
  description: string
  questions: QuizQuestion[]
  timeLimit?: number // in minutes
}

export default function QuizPage() {
  const params = useParams()
  const router = useRouter()
  const quizId = params.id as string

  const [quizData, setQuizData] = useState<QuizData | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string[]>>({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [result, setResult] = useState<QuizResult | null>(null)
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  // Load quiz data
  useEffect(() => {
    const loadQuizData = async () => {
      try {
        let data: QuizData | null = null
        
        // First, try to load from database
        try {
          const response = await fetch(`/api/quiz/${quizId}`)
          if (response.ok) {
            const dbQuiz = await response.json()
            
            // Transform database quiz to our format
            data = {
              title: dbQuiz.title,
              description: dbQuiz.description || '',
              questions: dbQuiz.questions.map((q: any) => ({
                id: q.id,
                question: q.question,
                choices: q.choices.map((c: any) => ({
                  id: c.id,
                  text: c.text,
                  isCorrect: c.isCorrect
                })),
                difficulty: q.difficulty,
                explanation: q.explanation,
                type: q.type,
                topic: q.topic
              })),
              timeLimit: dbQuiz.timeLimit
            }
          }
        } catch (dbError) {
          console.log('Not a database quiz, trying JSON files...')
        }
        
        // If not found in database, try JSON files
        if (!data) {
          if (quizId === 'bac-ho-co-ban' || quizId === 'bac-ho-nang-cao') {
          // Load from JSON file
          const response = await fetch('/quiz_bac_ho_vi.json')
          const jsonData = await response.json()
          
          // Transform the data format to match our expected structure
          const transformedQuestions = jsonData.items.map((item: any) => ({
            id: item.id,
            question: item.question,
            choices: item.choices.map((choice: any) => ({
              id: choice.id,
              text: choice.text,
              isCorrect: item.correct_answers.includes(choice.id)
            })),
            difficulty: item.grade_hint === 'THCS' ? 'easy' : item.grade_hint === 'THPT' ? 'medium' : 'hard',
            explanation: item.explanation,
            type: item.type,
            topic: item.topic
          }))
          
          const filteredQuestions = transformedQuestions.filter((q: QuizQuestion) => {
            if (quizId === 'bac-ho-co-ban') {
              return q.difficulty === 'easy' || q.difficulty === 'medium'
            } else {
              return q.difficulty === 'hard' || q.difficulty === 'expert'
            }
          }).slice(0, 20) // Limit to 20 questions
          
          data = {
            title: quizId === 'bac-ho-co-ban' ? 'Trắc nghiệm Bác Hồ - Cơ bản' : 'Trắc nghiệm Bác Hồ - Nâng cao',
            description: quizId === 'bac-ho-co-ban' 
              ? 'Kiểm tra kiến thức cơ bản về cuộc đời và sự nghiệp của Chủ tịch Hồ Chí Minh'
              : 'Thử thách với những câu hỏi nâng cao về tư tưởng và di sản của Bác Hồ',
            questions: filteredQuestions,
            timeLimit: 30
          }
        } else if (quizId === 'ho-chi-minh-ideology') {
          // Load Ho Chi Minh ideology quiz from JSON file
          const response = await fetch('/quiz_ho_chi_minh_ideology.json')
          const jsonData = await response.json()
          
          // Transform the data format to match our expected structure
          const transformedQuestions = jsonData.questions.map((item: any) => ({
            id: item.id,
            question: item.question,
            choices: item.choices.map((choice: any, index: number) => ({
              id: `choice_${index}`,
              text: choice.text,
              isCorrect: choice.isCorrect
            })),
            difficulty: item.difficulty || 'medium',
            explanation: item.explanation,
            type: 'multiple_choice',
            topic: 'Tư tưởng Hồ Chí Minh'
          }))
          
          data = {
            title: 'Tư tưởng Hồ Chí Minh',
            description: 'Kiểm tra kiến thức về Tư tưởng Hồ Chí Minh - Hệ thống tư tưởng toàn diện và sâu sắc của lãnh tụ dân tộc',
            questions: transformedQuestions,
            timeLimit: 45
          }
        } else if (quizId === 'ho-chi-minh-ideology-advanced') {
          // Load Ho Chi Minh ideology advanced quiz from JSON file
          const response = await fetch('/quiz_ho_chi_minh_ideology_advanced.json')
          const jsonData = await response.json()
          
          // Transform the data format to match our expected structure
          const transformedQuestions = jsonData.items.map((item: any) => ({
            id: item.id,
            question: item.question,
            choices: item.choices.map((choice: any) => ({
              id: choice.id,
              text: choice.text,
              isCorrect: choice.isCorrect
            })),
            difficulty: item.difficulty || 'hard',
            explanation: item.explanation,
            type: item.type || 'single',
            topic: item.topic
          }))
          
          data = {
            title: jsonData.metadata.title,
            description: jsonData.metadata.description,
            questions: transformedQuestions,
            timeLimit: 60
          }
        } else if (quizId === 'lich-su-viet-nam') {
          // Load Vietnamese history quiz from JSON file
          const response = await fetch('/quiz_vietnam_history.json')
          const jsonData = await response.json()
          
          // Transform the data format to match our expected structure
          const transformedQuestions = jsonData.items.map((item: any) => ({
            id: item.id,
            question: item.question,
            choices: item.choices.map((choice: any) => ({
              id: choice.id,
              text: choice.text,
              isCorrect: item.correct_answers.includes(choice.id)
            })),
            difficulty: item.grade_hint === 'THCS' ? 'easy' : item.grade_hint === 'THPT' ? 'medium' : 'hard',
            explanation: item.explanation,
            type: item.type,
            topic: item.topic
          }))
          
          data = {
            title: 'Lịch sử Việt Nam tổng hợp',
            description: 'Khám phá 40 sự kiện quan trọng trong lịch sử dân tộc Việt Nam từ cổ đại đến hiện đại',
            questions: transformedQuestions,
            timeLimit: 45
          }
        }
        }
        
        setQuizData(data)
        if (data?.timeLimit) {
          setTimeLeft(data.timeLimit * 60) // Convert to seconds
        }
      } catch (error) {
        console.error('Error loading quiz data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadQuizData()
  }, [quizId])

  // Timer countdown
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || isSubmitted) return

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev && prev <= 1) {
          handleSubmit() // Auto-submit when time runs out
          return 0
        }
        return prev ? prev - 1 : 0
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, isSubmitted])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleAnswerSelect = (questionIndex: number, choiceId: string) => {
    if (isSubmitted || !quizData) return
    const question = quizData.questions[questionIndex]
    const correctCount = question.choices.filter(c => c.isCorrect).length
    const isMultiple = correctCount > 1 || (question as any).type === 'multiple' || (question as any).type === 'multiple_choice'
    setSelectedAnswers(prev => {
      const current = prev[questionIndex] || []
      if (isMultiple) {
        const exists = current.includes(choiceId)
        const next = exists ? current.filter(id => id !== choiceId) : [...current, choiceId]
        return { ...prev, [questionIndex]: next }
      } else {
        return { ...prev, [questionIndex]: [choiceId] }
      }
    })
  }

  const handleSubmit = async () => {
    if (!quizData) return

    const correctAnswers = quizData.questions.reduce((acc, question, index) => {
      const selectedIds = (selectedAnswers[index] || []).slice().sort()
      const correctIds = question.choices.filter(c => c.isCorrect).map(c => c.id).sort()
      const isEqual = selectedIds.length === correctIds.length && selectedIds.every((id, i) => id === correctIds[i])
      if (isEqual) acc++
      return acc
    }, 0)

    const totalQuestions = quizData.questions.length
    const percentage = Math.round((correctAnswers / totalQuestions) * 100)
    
    let grade: 'excellent' | 'good' | 'average' | 'poor'
    if (percentage >= 90) grade = 'excellent'
    else if (percentage >= 70) grade = 'good'
    else if (percentage >= 50) grade = 'average'
    else grade = 'poor'

    const resultData: QuizResult = {
      quizId,
      score: percentage,
      correctAnswers,
      totalQuestions,
      grade,
      timeSpent: quizData.timeLimit ? (quizData.timeLimit * 60 - (timeLeft || 0)) : 0,
      completedAt: new Date()
    }

    // Try to submit to database if it's a database quiz
    try {
      const response = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quizId,
          answers: Object.entries(selectedAnswers).map(([questionIndex, choiceIds]) => ({
            questionId: quizData.questions[parseInt(questionIndex)].id,
            choiceIds
          })),
          timeSpent: resultData.timeSpent
        }),
      });

      if (response.ok) {
        const submitResult = await response.json();
        console.log('Quiz result submitted:', submitResult);
      }
    } catch (error) {
      console.log('Could not submit to database (probably a JSON quiz):', error);
    }

    setResult(resultData)
    setIsSubmitted(true)
  }

  const handleRestart = () => {
    setCurrentQuestion(0)
    setSelectedAnswers({})
    setIsSubmitted(false)
    setResult(null)
    if (quizData?.timeLimit) {
      setTimeLeft(quizData.timeLimit * 60)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải câu hỏi...</p>
        </div>
      </div>
    )
  }

  if (!quizData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy bài quiz</h2>
          <p className="text-gray-600 mb-6">Bài quiz này không tồn tại hoặc đã bị xóa.</p>
          <Button asChild>
            <Link href="/quiz">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại trang quiz
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  if (isSubmitted && result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-yellow-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="mb-8">
            <CardHeader className="text-center">
              <div className="w-20 h-20 mx-auto mb-4">
                {result.grade === 'excellent' ? (
                  <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                    <Trophy className="w-10 h-10 text-white" />
                  </div>
                ) : result.grade === 'good' ? (
                  <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                ) : result.grade === 'average' ? (
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                    <Star className="w-10 h-10 text-white" />
                  </div>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center">
                    <XCircle className="w-10 h-10 text-white" />
                  </div>
                )}
              </div>
              <CardTitle className="text-3xl font-bold mb-2">
                Kết quả: {result.score}%
              </CardTitle>
              <p className="text-gray-600">
                Bạn đã trả lời đúng {result.correctAnswers}/{result.totalQuestions} câu hỏi
              </p>
              <div className="mt-4">
                <Badge 
                  variant={result.grade === 'excellent' ? 'default' : result.grade === 'good' ? 'secondary' : 'outline'}
                  className="text-lg px-4 py-2"
                >
                  {result.grade === 'excellent' ? 'Xuất sắc' : 
                   result.grade === 'good' ? 'Tốt' : 
                   result.grade === 'average' ? 'Trung bình' : 'Cần cố gắng'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="text-center p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-lg">
                  <Clock className="w-8 h-8 text-red-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-gray-900 mb-1">Thời gian hoàn thành</h4>
                  <p className="text-gray-600">{formatTime(result.timeSpent)}</p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg">
                  <Trophy className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-gray-900 mb-1">Điểm số</h4>
                  <p className="text-gray-600">{result.score}/100</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={handleRestart} variant="outline" size="lg">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Làm lại
                </Button>
                <Button asChild size="lg">
                  <Link href="/quiz">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Quay lại trang quiz
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Review answers */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Xem lại đáp án</h3>
            {quizData.questions.map((question, index) => {
              const selectedIds = (selectedAnswers[index] || []).slice().sort()
              const correctIds = question.choices.filter(c => c.isCorrect).map(c => c.id).sort()
              const isCorrect = selectedIds.length === correctIds.length && selectedIds.every((id, i) => id === correctIds[i])

              return (
                <Card key={question.id} className={`border-l-4 ${isCorrect ? 'border-l-green-500' : 'border-l-red-500'}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      {isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                      Câu {index + 1}: {question.question}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      {question.choices.map((choice) => {
                        const isSelected = (selectedAnswers[index] || []).includes(choice.id)
                        const isCorrectAnswer = choice.isCorrect
                        
                        return (
                          <div
                            key={choice.id}
                            className={`p-3 rounded-lg border ${
                              isCorrectAnswer 
                                ? 'bg-green-50 border-green-200 text-green-800' 
                                : isSelected 
                                  ? 'bg-red-50 border-red-200 text-red-800' 
                                  : 'bg-gray-50 border-gray-200'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {isCorrectAnswer && <CheckCircle className="w-4 h-4 text-green-600" />}
                              {isSelected && !isCorrectAnswer && <XCircle className="w-4 h-4 text-red-600" />}
                              {choice.text}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                    {question.explanation && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h5 className="font-semibold text-blue-900 mb-2">Giải thích:</h5>
                        <p className="text-blue-800">{question.explanation}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-yellow-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Button variant="outline" asChild>
              <Link href="/quiz">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay lại
              </Link>
            </Button>
            {timeLeft !== null && (
              <div className="flex items-center gap-2 text-lg font-semibold">
                <Clock className="w-5 h-5 text-red-600" />
                <span className={timeLeft <= 300 ? 'text-red-600' : 'text-gray-700'}>
                  {formatTime(timeLeft)}
                </span>
              </div>
            )}
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{quizData.title}</h1>
          <p className="text-gray-600">{quizData.description}</p>
          
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Câu {currentQuestion + 1} / {quizData.questions.length}</span>
              <span>{Math.round(((currentQuestion + 1) / quizData.questions.length) * 100)}%</span>
            </div>
            <Progress value={((currentQuestion + 1) / quizData.questions.length) * 100} className="h-2" />
          </div>
        </div>

        {/* Question */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">
              {quizData.questions[currentQuestion]?.question}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {quizData.questions[currentQuestion]?.choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => handleAnswerSelect(currentQuestion, choice.id)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                    (selectedAnswers[currentQuestion] || []).includes(choice.id)
                      ? 'border-red-500 bg-red-50 text-red-900'
                      : 'border-gray-200 hover:border-red-300 hover:bg-red-25'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-sm border-2 ${
                      (selectedAnswers[currentQuestion] || []).includes(choice.id)
                        ? 'border-red-500 bg-red-500'
                        : 'border-gray-300'
                    }`}></div>
                    <span>{choice.text}</span>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
            disabled={currentQuestion === 0}
          >
            Câu trước
          </Button>

          <div className="flex gap-2">
            {currentQuestion === quizData.questions.length - 1 ? (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    className="bg-red-600 hover:bg-red-700"
                    disabled={Object.keys(selectedAnswers).length !== quizData.questions.length}
                  >
                    Nộp bài
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Xác nhận nộp bài</AlertDialogTitle>
                    <AlertDialogDescription>
                      Bạn có chắc chắn muốn nộp bài? Bạn sẽ không thể thay đổi đáp án sau khi nộp bài.
                      <br />
                      <br />
                      Số câu đã trả lời: {Object.keys(selectedAnswers).length}/{quizData.questions.length}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogAction onClick={handleSubmit}>
                      Nộp bài
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : (
              <Button
                onClick={() => setCurrentQuestion(prev => Math.min(quizData.questions.length - 1, prev + 1))}
                disabled={!(selectedAnswers[currentQuestion] && selectedAnswers[currentQuestion].length > 0)}
              >
                Câu tiếp theo
              </Button>
            )}
          </div>
        </div>

        {/* Question overview */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">Tổng quan câu hỏi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
              {quizData.questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestion(index)}
                  className={`aspect-square flex items-center justify-center text-sm font-medium rounded-lg border-2 transition-all ${
                    index === currentQuestion
                      ? 'border-red-500 bg-red-500 text-white'
                      : selectedAnswers[index]
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-300 bg-gray-50 text-gray-600 hover:border-red-300'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}