'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { X, Send, Bot, Cpu, Sparkles, Zap } from 'lucide-react'

interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
  model?: string
  source?: string
}

type AIModel = 'gemini-2.5-flash' | 'gemini-1.5-flash' | 'gemma-3-27b-it'

const AI_MODEL_INFO = {
  'gemini-2.5-flash': {
    name: 'Gemini 2.5 Flash',
    description: 'Nhanh nhất, phù hợp cho chat',
    icon: Zap,
    color: 'bg-blue-500'
  },
  'gemini-1.5-flash': {
    name: 'Gemini 1.5 Flash',
    description: 'Cân bằng tốc độ và chất lượng',
    icon: Sparkles,
    color: 'bg-green-500'
  },
  'gemma-3-27b-it': {
    name: 'Gemma 3 27B',
    description: 'Chuyên sâu, phân tích chi tiết',
    icon: Cpu,
    color: 'bg-purple-500'
  }
}

export function ChatBox() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedModel, setSelectedModel] = useState<AIModel>('gemini-2.5-flash')
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Xin chào! 🇻🇳 Tôi là chuyên gia AI về lịch sử Việt Nam, đặc biệt chuyên sâu về Chủ tịch Hồ Chí Minh.\n\n📚 Tôi có thể giúp bạn tìm hiểu về:\n• Cuộc đời và sự nghiệp của Bác Hồ\n• Lịch sử cách mạng Việt Nam\n• Tư tưởng và di sản của Người\n• Các sự kiện lịch sử quan trọng\n\n💡 Hãy chọn model AI phù hợp và đặt câu hỏi!',
      isUser: false,
      timestamp: new Date(),
      model: 'system'
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          message: inputMessage,
          model: selectedModel 
        })
      })

      const data = await response.json()

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response || 'Xin lỗi, tôi không thể trả lời câu hỏi này lúc này.',
        isUser: false,
        timestamp: new Date(),
        model: data.model || selectedModel,
        source: data.source || 'unknown'
      }

      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: '❌ Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau.',
        isUser: false,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const ModelIcon = AI_MODEL_INFO[selectedModel].icon

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <Card className="w-96 h-[600px] mb-4 shadow-2xl border-0 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
          <CardHeader className="pb-4 bg-gradient-to-r from-red-800 to-red-900 text-white relative">
            <div className="absolute inset-0 bg-[url('/patterns/lotus.svg')] opacity-10 bg-repeat bg-center"></div>
            <div className="relative flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 shadow-lg">
                  <Bot className="h-6 w-6 text-white drop-shadow-sm" strokeWidth={2} />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold tracking-wide">Chuyên gia AI Lịch sử</CardTitle>
                  <p className="text-white/90 text-xs">Hồ Chí Minh & Việt Nam</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 h-9 w-9 p-0 rounded-full border border-white/20 backdrop-blur-sm transition-all duration-200"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Model Selection */}
            <div className="relative mt-3">
              <Select value={selectedModel} onValueChange={(value: AIModel) => setSelectedModel(value)}>
                <SelectTrigger className="w-full bg-white/20 border-white/30 text-white backdrop-blur-sm">
                  <div className="flex items-center space-x-2">
                    <ModelIcon className="h-4 w-4" />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(AI_MODEL_INFO).map(([key, info]) => {
                    const Icon = info.icon
                    return (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${info.color}`}></div>
                          <Icon className="h-4 w-4" />
                          <div>
                            <div className="font-medium">{info.name}</div>
                            <div className="text-xs text-gray-500">{info.description}</div>
                          </div>
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          
          <CardContent className="p-0 flex flex-col h-[calc(100%-140px)] bg-gradient-to-b from-gray-50 to-white">
            <ScrollArea className="flex-1 p-5">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} group`}
                  >
                    {!message.isUser && (
                      <div className="w-9 h-9 bg-gradient-to-br from-red-800 to-red-900 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0 shadow-lg border border-red-700">
                        <Bot className="h-5 w-5 text-white drop-shadow-sm" strokeWidth={2} />
                      </div>
                    )}
                    <div
                      className={`max-w-[75%] transition-all duration-200 ${
                        message.isUser
                          ? 'bg-gradient-to-r from-red-800 to-red-900 text-white rounded-2xl rounded-br-lg shadow-lg'
                          : 'bg-white border border-gray-200 text-gray-800 rounded-2xl rounded-bl-lg shadow-md hover:shadow-lg'
                      }`}
                    >
                      <div className="p-4 text-sm leading-relaxed">
                        <div className="whitespace-pre-wrap">{message.text}</div>
                      </div>
                      
                      {/* Message footer with metadata */}
                      <div className={`px-4 pb-3 flex items-center justify-between text-xs ${
                        message.isUser ? 'text-white/80' : 'text-gray-500'
                      }`}>
                        <div className="flex items-center space-x-2">
                          <span>{message.timestamp.toLocaleTimeString('vi-VN', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}</span>
                          {message.model && message.model !== 'system' && (
                            <Badge variant="outline" className={`text-xs border-0 ${
                              message.isUser 
                                ? 'bg-white/20 text-white/90' 
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              {AI_MODEL_INFO[message.model as AIModel]?.name || message.model}
                            </Badge>
                          )}
                        </div>
                        {message.source === 'fallback' && (
                          <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
                            Dự phòng
                          </Badge>
                        )}
                      </div>
                    </div>
                    {message.isUser && (
                      <div className="w-9 h-9 bg-gradient-to-br from-gray-500 to-gray-600 rounded-full flex items-center justify-center ml-3 mt-1 flex-shrink-0 shadow-lg">
                        <span className="text-white text-sm font-semibold">U</span>
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start group">
                    <div className="w-9 h-9 bg-gradient-to-br from-red-800 to-red-900 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0 shadow-lg border border-red-700">
                      <Bot className="h-5 w-5 text-white drop-shadow-sm animate-pulse" strokeWidth={2} />
                    </div>
                    <div className="bg-white border border-gray-200 p-4 rounded-2xl rounded-bl-lg text-sm shadow-md">
                      <div className="flex items-center space-x-2">
                        <ModelIcon className="h-4 w-4 text-red-800 animate-spin" />
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-red-800 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-red-800 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-red-800 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-gray-600 text-xs">Đang phân tích...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            
            <div className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
              <div className="flex space-x-3">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Hỏi về lịch sử Việt Nam, cuộc đời Bác Hồ..."
                  className="flex-1 text-sm border-2 border-gray-200 focus:border-red-800 focus:ring-2 focus:ring-red-800/20 rounded-xl px-4 py-3 transition-all duration-200"
                  disabled={isLoading}
                />
                <Button
                  onClick={sendMessage}
                  disabled={isLoading || !inputMessage.trim()}
                  size="sm"
                  className="bg-gradient-to-r from-red-800 to-red-900 hover:from-red-900 hover:to-red-950 px-4 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl disabled:opacity-50"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="h-16 w-16 rounded-full bg-gradient-to-r from-red-800 to-red-900 hover:from-red-900 hover:to-red-950 shadow-2xl text-white border-4 border-white/30 transition-all duration-300 hover:scale-110 group relative"
      >
        <Bot className="h-7 w-7 text-white drop-shadow-lg group-hover:scale-110 transition-transform duration-200" strokeWidth={2} />
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
          <ModelIcon className="h-3 w-3 text-white" />
        </div>
      </Button>
    </div>
  )
}
