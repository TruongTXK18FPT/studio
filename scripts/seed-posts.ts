import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding posts data...')

  // Tìm hoặc tạo user mẫu
  let sampleUser = await prisma.user.findUnique({
    where: { email: 'user@example.com' }
  })

  if (!sampleUser) {
    sampleUser = await prisma.user.create({
      data: {
        email: 'user@example.com',
        name: 'Người dùng mẫu',
        passwordHash: 'hashed_password_here',
        role: 'USER'
      }
    })
    console.log('✅ Created sample user:', sampleUser.email)
  }

  // Tạo một số bài viết mẫu
  const samplePosts = [
    {
      title: 'Hành trình tìm đường cứu nước của Bác Hồ',
      content: 'Ngày 5/6/1911, từ bến Nhà Rồng, người thanh niên Nguyễn Tất Thành đã ra đi tìm đường cứu nước. Đây là bước ngoặt quan trọng trong lịch sử cách mạng Việt Nam...',
      status: 'approved',
      tags: ['lịch sử', 'Bác Hồ', 'cách mạng'],
      authorId: sampleUser.id
    },
    {
      title: 'Những năm tháng Bác Hồ ở Pháp',
      content: 'Từ 1911-1923, Bác Hồ đã sống và hoạt động tại Pháp. Đây là giai đoạn quan trọng trong việc hình thành tư tưởng cách mạng của Người...',
      status: 'approved',
      tags: ['Bác Hồ', 'Pháp', 'tư tưởng'],
      authorId: sampleUser.id
    },
    {
      title: 'Bác Hồ và phong trào công nhân quốc tế',
      content: 'Trong quá trình hoạt động cách mạng, Bác Hồ đã tích cực tham gia và ủng hộ phong trào công nhân quốc tế...',
      status: 'pending',
      tags: ['công nhân', 'quốc tế', 'đoàn kết'],
      authorId: sampleUser.id
    },
    {
      title: 'Tư tưởng Hồ Chí Minh về độc lập dân tộc',
      content: 'Tư tưởng về độc lập dân tộc là một trong những nội dung cốt lõi trong hệ thống tư tưởng Hồ Chí Minh...',
      status: 'approved',
      tags: ['tư tưởng', 'độc lập', 'dân tộc'],
      authorId: sampleUser.id
    },
    {
      title: 'Bác Hồ với thanh niên Việt Nam',
      content: 'Bác Hồ luôn quan tâm và tin tưởng vào thế hệ trẻ. Người đã dành nhiều thời gian để giáo dục và rèn luyện thanh niên...',
      status: 'approved',
      tags: ['thanh niên', 'giáo dục', 'tương lai'],
      authorId: sampleUser.id
    }
  ]

  // Xóa các bài viết cũ của user này (nếu có)
  await prisma.post.deleteMany({
    where: { authorId: sampleUser.id }
  })

  // Tạo các bài viết mới
  for (const postData of samplePosts) {
    const post = await prisma.post.create({
      data: postData
    })
    console.log(`✅ Created post: ${post.title}`)
  }

  console.log('🎉 Posts seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding posts:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
