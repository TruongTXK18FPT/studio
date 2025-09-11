import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { z } from 'zod'

const chatSchema = z.object({
  message: z.string().min(1, 'Tin nhắn không được trống')
})

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

// Mock responses về Bác Hồ (fallback)
const mockResponses = [
  'Chủ tịch Hồ Chí Minh sinh ngày 19/5/1890 tại làng Sen, xã Kim Liên, huyện Nam Đàn, tỉnh Nghệ An.',
  'Bác Hồ từng sống và làm việc ở nhiều nước như Pháp, Anh, Mỹ, Liên Xô, Trung Quốc... để tìm đường cứu nước.',
  'Tên thật của Bác Hồ là Nguyễn Sinh Cung, sau đổi thành Nguyễn Tất Thành, và cuối cùng là Hồ Chí Minh.',
  'Bác Hồ thành lập Đảng Cộng sản Việt Nam vào ngày 3/2/1930 tại Hồng Kông.',
  'Tuyên ngôn độc lập do Bác Hồ đọc ngày 2/9/1945 đã khai sinh nước Việt Nam Dân chủ Cộng hòa.',
  'Bác Hồ từ trần vào ngày 2/9/1969 tại Hà Nội, để lại di sản vô giá cho dân tộc Việt Nam.',
  'Tư tưởng Hồ Chí Minh về độc lập dân tộc gắn liền với chủ nghĩa xã hội.',
  'Bác Hồ luôn sống giản dị, gần gũi với nhân dân và coi nhân dân là gốc.'
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message } = chatSchema.parse(body)

    try {
      // Initialize Gemini model
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
      
      // System prompt về Hồ Chí Minh
      const systemPrompt = `Bạn là một AI trợ lý chuyên về Chủ tịch Hồ Chí Minh. Hãy trả lời các câu hỏi về:
      - Cuộc đời và sự nghiệp của Chủ tịch Hồ Chí Minh
      - Tư tưởng, đạo đức, phong cách của Người
      - Lịch sử cách mạng Việt Nam dưới sự lãnh đạo của Người
      - Những câu nói, bài viết nổi tiếng của Bác Hồ
      - Di sản và ảnh hưởng của Người đến ngày nay

      Hãy trả lời bằng tiếng Việt, súc tích, chính xác và tôn trọng. Nếu không biết thông tin chính xác, hãy thừa nhận và gợi ý nguồn tham khảo đáng tin cậy.`
      
      const fullPrompt = `${systemPrompt}\n\nCâu hỏi: ${message}`
      
      const result = await model.generateContent(fullPrompt)
      const response = result.response
      const text = response.text()
      
      return NextResponse.json({
        response: text,
        timestamp: new Date().toISOString(),
        source: 'gemini'
      })
    } catch (aiError) {
      console.error('Gemini API error:', aiError)
      
      // Fallback to mock response
      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)]
      
      return NextResponse.json({
        response: randomResponse,
        timestamp: new Date().toISOString(),
        source: 'fallback'
      })
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Có lỗi xảy ra, vui lòng thử lại' },
      { status: 500 }
    )
  }
}
