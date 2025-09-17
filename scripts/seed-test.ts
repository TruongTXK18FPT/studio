import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // Create test user
  const hashedPassword = await bcrypt.hash('test123', 12)
  
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'Người dùng test',
      passwordHash: hashedPassword,
      role: 'USER'
    }
  })

  // Create some test posts
  await prisma.post.createMany({
    data: [
      {
        title: 'Bài viết về Bác Hồ',
        content: 'Nội dung về cuộc đời và sự nghiệp của Chủ tịch Hồ Chí Minh...',
        status: 'approved',
        authorId: user.id,
        tags: ['Bác Hồ', 'Lịch sử'],
        metadata: {}
      },
      {
        title: 'Tư tưởng Hồ Chí Minh về giáo dục',
        content: 'Những quan điểm sâu sắc của Bác về việc giáo dục thế hệ trẻ...',
        status: 'pending',
        authorId: user.id,
        tags: ['Giáo dục', 'Tư tưởng'],
        metadata: {}
      },
      {
        title: 'Di chúc của Bác Hồ',
        content: 'Phân tích nội dung và ý nghĩa của di chúc Chủ tịch Hồ Chí Minh...',
        status: 'approved',
        authorId: user.id,
        tags: ['Di chúc', 'Ý nghĩa'],
        metadata: {}
      }
    ]
  })

  console.log('Test data created successfully!')
}

main()
  .then(() => {
    console.log('Seeding completed!')
  })
  .catch((e) => {
    console.error('Error seeding data:', e)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })