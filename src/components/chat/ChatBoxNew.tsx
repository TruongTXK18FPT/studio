'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { X, Send, Bot } from 'lucide-react'

interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
}

export function ChatBox() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Xin chào! Tôi là AI trợ lý về Chủ tịch Hồ Chí Minh. Tôi có thể giúp bạn tìm hiểu về cuộc đời, sự nghiệp và tư tưởng của Người. Bạn muốn hỏi gì?',
      isUser: false,
      timestamp: new Date()
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
        body: JSON.stringify({ message: inputMessage })
      })

      const data = await response.json()

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response || 'Xin lỗi, tôi không thể trả lời câu hỏi này lúc này.',
        isUser: false,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau.',
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

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <Card className="w-80 h-[500px] mb-4 shadow-xl border-2 border-heritage/20 bg-ivory">
          <CardHeader className="pb-3 bg-gradient-to-r from-heritage to-heritage/90 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-lg font-semibold">AI Trợ lý Bác Hồ</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 h-8 w-8 p-0 rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="p-0 flex flex-col h-[calc(100%-80px)]">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    {!message.isUser && (
                      <div className="w-8 h-8 bg-heritage rounded-full flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                    )}
                    <div
                      className={`max-w-[70%] p-3 rounded-2xl text-sm leading-relaxed ${
                        message.isUser
                          ? 'bg-heritage text-white rounded-br-md'
                          : 'bg-white border border-gray-200 text-gray-800 rounded-bl-md shadow-sm'
                      }`}
                    >
                      {message.text}
                    </div>
                    {message.isUser && (
                      <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center ml-2 mt-1 flex-shrink-0">
                        <span className="text-white text-xs font-medium">U</span>
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="w-8 h-8 bg-heritage rounded-full flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-bl-md text-sm shadow-sm">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-heritage rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-heritage rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-heritage rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            
            <div className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
              <div className="flex space-x-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Hỏi về Bác Hồ..."
                  className="flex-1 text-sm border-heritage/30 focus:border-heritage focus:ring-heritage/20"
                  disabled={isLoading}
                />
                <Button
                  onClick={sendMessage}
                  disabled={isLoading || !inputMessage.trim()}
                  size="sm"
                  className="bg-heritage hover:bg-heritage/90 px-3 rounded-full"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="h-14 w-14 rounded-full bg-heritage hover:bg-heritage/90 shadow-lg text-white border-2 border-white/20 transition-all duration-200 hover:scale-105"
      >
        <Bot className="h-6 w-6" />
      </Button>
    </div>
  )
}
