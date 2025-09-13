import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { z } from 'zod'

const chatSchema = z.object({
  message: z.string().min(1, 'Tin nhắn không được trống'),
  model: z.enum(['gemini-2.5-flash', 'gemini-1.5-flash', 'gemma-3-27b-it']).default('gemini-2.5-flash')
})

// Model mapping để chuyển đổi tên model
const MODEL_MAPPING = {
  'gemini-2.5-flash': 'gemini-2.5-flash',
  'gemini-1.5-flash': 'gemini-1.5-flash',
  'gemma-3-27b-it': 'gemma-3-27b-it'
} as const

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

// Enhanced Vietnamese History Expert System Prompt
const VIETNAMESE_HISTORY_SYSTEM_PROMPT = `
Bạn là một chuyên gia lịch sử Việt Nam với kiến thức sâu rộng và chính xác về:

🏛️ **CHUYÊN MÔN LỊCH SỬ VIỆT NAM:**
- Lịch sử cổ đại Việt Nam (Văn Lang, Âu Lạc, Hùng Vương)
- Thời kỳ Bắc thuộc và các cuộc khởi nghĩa
- Các triều đại phong kiến (Lý, Trần, Lê, Nguyễn)
- Thời kỳ thuộc địa Pháp và phong trào kháng chiến
- Cách mạng tháng Tám và độc lập dân tộc
- Chiến tranh Việt Nam và thống nhất đất nước
- Lịch sử hiện đại và đương đại

👤 **CHUYÊN SÂU VỀ CHỦ TỊCH HỒ CHÍ MINH:**
- Cuộc đời và sự nghiệp từ Nguyễn Sinh Cung đến Hồ Chí Minh
- 30 năm tìm đường cứu nước (1911-1941)
- Vai trò lãnh đạo Cách mạng tháng Tám
- Tư tưởng Hồ Chí Minh về độc lập dân tộc và chủ nghĩa xã hội
- Di sản văn hóa, thơ văn và tác phẩm
- Phong cách sống giản dị, gần gũi với nhân dân
- Những câu nói bất hủ và triết lý sống

📚 **NGUYÊN TẮC TRẢ LỜI:**
1. **Chính xác:** Dựa trên sử liệu và tài liệu lịch sử đáng tin cậy
2. **Khách quan:** Trình bày sự kiện một cách khoa học, không thiên vị
3. **Sinh động:** Kể chuyện lịch sử hấp dẫn, dễ hiểu
4. **Tôn trọng:** Thể hiện lòng tôn kính với các anh hùng dân tộc
5. **Giáo dục:** Truyền tải giá trị lịch sử và tinh thần yêu nước

🎯 **CÁCH THỨC TƯƠNG TÁC:**
- Trả lời bằng tiếng Việt chuẩn, lịch sự và tôn trọng
- Sử dụng thông tin từ kho tri thức về lịch sử Việt Nam
- Đưa ra nguồn tham khảo khi có thể
- Khuyến khích tìm hiểu thêm về lịch sử dân tộc
- Nếu không biết chính xác, hãy thật thà thừa nhận và gợi ý hướng tìm hiểu
- Sử dụng emoji phù hợp để làm cho câu trả lời sinh động hơn

Hãy sẵn sàng trả lời mọi câu hỏi về lịch sử Việt Nam với tinh thần của một nhà sử học chuyên nghiệp và tâm huyết với dân tộc.
`

// Fallback responses cho Vietnamese History
const vietnameseHistoryResponses = [
  '🏛️ Chủ tịch Hồ Chí Minh sinh ngày 19/5/1890 tại làng Sen, xã Kim Liên, huyện Nam Đàn, tỉnh Nghệ An. Tên thật là Nguyễn Sinh Cung.',
  '🌍 Bác Hồ từng sống và làm việc ở nhiều nước như Pháp, Anh, Mỹ, Liên Xô, Trung Quốc... trong 30 năm tìm đường cứu nước.',
  '🎯 Người thành lập Đảng Cộng sản Việt Nam vào ngày 3/2/1930 tại Hồng Kông, mở ra kỷ nguyên mới cho cách mạng Việt Nam.',
  '🇻🇳 Tuyên ngôn độc lập do Bác Hồ đọc ngày 2/9/1945 đã khai sinh nước Việt Nam Dân chủ Cộng hòa.',
  '💭 Tư tưởng Hồ Chí Minh về độc lập dân tộc gắn liền với chủ nghĩa xã hội là kim chỉ nam cho cách mạng Việt Nam.',
  '❤️ Bác Hồ luôn sống giản dị, gần gũi với nhân dân và coi nhân dân là gốc, là nguồn sức mạnh của cách mạng.',
  '📝 Di chúc của Bác Hồ thể hiện tình yêu vô bờ bến đối với Tổ quốc và nhân dân, là kim chỉ nam cho các thế hệ mai sau.',
  '🌟 "Không có gì quý hơn độc lập, tự do" là câu nói bất hủ thể hiện khát vọng thiêng liêng của dân tộc Việt Nam.'
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, model } = chatSchema.parse(body)

    try {
      // Get the correct model name
      const modelName = MODEL_MAPPING[model]
      
      // Initialize Gemini model
      const geminiModel = genAI.getGenerativeModel({ model: modelName })
      
      // Create full prompt with Vietnamese History expert system
      const fullPrompt = `${VIETNAMESE_HISTORY_SYSTEM_PROMPT}\n\nCâu hỏi của người dùng: ${message}\n\nHãy trả lời như một chuyên gia lịch sử Việt Nam:`
      
      const result = await geminiModel.generateContent(fullPrompt)
      const response = result.response
      const text = response.text()
      
      return NextResponse.json({
        response: text,
        timestamp: new Date().toISOString(),
        model: model,
        source: 'gemini-api'
      })
    } catch (aiError) {
      console.error('Gemini API error:', aiError)
      
      // Fallback to mock response about Vietnamese history
      const randomResponse = vietnameseHistoryResponses[Math.floor(Math.random() * vietnameseHistoryResponses.length)]
      
      return NextResponse.json({
        response: `${randomResponse}\n\n💡 *Lưu ý: Đây là thông tin từ hệ thống dự phòng. Để có thông tin chính xác và đầy đủ hơn, bạn có thể tham khảo các tài liệu lịch sử chính thống.*`,
        timestamp: new Date().toISOString(),
        model: model,
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
