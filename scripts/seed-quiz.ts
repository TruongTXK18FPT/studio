import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Bắt đầu seed dữ liệu quiz...');

  // Tạo user hệ thống nếu chưa có
  const systemUser = await prisma.user.upsert({
    where: { email: 'system@hanhtrinhbacho.vn' },
    update: {},
    create: {
      email: 'system@hanhtrinhbacho.vn',
      name: 'Hệ thống',
      passwordHash: 'system_user',
      role: 'ADMIN'
    }
  });

  console.log('✅ Đã tạo user hệ thống');

  // Tạo quiz mẫu về Tư tưởng Hồ Chí Minh
  const quiz1 = await prisma.quiz.create({
    data: {
      title: 'Tư tưởng Hồ Chí Minh - Cơ bản',
      description: 'Kiểm tra kiến thức cơ bản về tư tưởng Hồ Chí Minh',
      difficulty: 'medium',
      category: 'Tư tưởng',
      tags: ['Hồ Chí Minh', 'Tư tưởng', 'Cách mạng'],
      timeLimit: 30,
      isPublic: true,
      authorId: systemUser.id,
      questions: {
        create: [
          {
            question: 'Tư tưởng Hồ Chí Minh được hình thành trên cơ sở nào?',
            type: 'single',
            difficulty: 'medium',
            explanation: 'Tư tưởng Hồ Chí Minh được hình thành trên nền tảng chủ nghĩa Mác - Lênin, kế thừa truyền thống yêu nước, nhân nghĩa dân tộc và tinh hoa văn hóa nhân loại.',
            topic: 'Cơ sở hình thành',
            order: 0,
            choices: {
              create: [
                {
                  text: 'Chủ nghĩa Mác - Lênin, truyền thống dân tộc và tinh hoa văn hóa nhân loại',
                  isCorrect: true,
                  order: 0
                },
                {
                  text: 'Tư tưởng phương Đông',
                  isCorrect: false,
                  order: 1
                },
                {
                  text: 'Tư tưởng phương Tây',
                  isCorrect: false,
                  order: 2
                },
                {
                  text: 'Kinh nghiệm thực tiễn cách mạng',
                  isCorrect: false,
                  order: 3
                }
              ]
            }
          },
          {
            question: 'Theo Hồ Chí Minh, yếu tố quyết định thắng lợi của cách mạng giải phóng dân tộc là gì?',
            type: 'single',
            difficulty: 'medium',
            explanation: 'Người nhấn mạnh: Sự lãnh đạo của Đảng Cộng sản là nhân tố quyết định thắng lợi của cách mạng Việt Nam.',
            topic: 'Cách mạng giải phóng dân tộc',
            order: 1,
            choices: {
              create: [
                {
                  text: 'Sự lãnh đạo của Đảng Cộng sản',
                  isCorrect: true,
                  order: 0
                },
                {
                  text: 'Sức mạnh toàn dân tộc',
                  isCorrect: false,
                  order: 1
                },
                {
                  text: 'Đoàn kết quốc tế',
                  isCorrect: false,
                  order: 2
                },
                {
                  text: 'Công – nông liên minh',
                  isCorrect: false,
                  order: 3
                }
              ]
            }
          },
          {
            question: 'Theo Hồ Chí Minh, mục tiêu cao nhất của CNXH là gì?',
            type: 'single',
            difficulty: 'medium',
            explanation: 'CNXH theo Hồ Chí Minh nhằm nâng cao đời sống nhân dân về vật chất và tinh thần, hướng tới xã hội dân chủ, công bằng, văn minh.',
            topic: 'Chủ nghĩa xã hội',
            order: 2,
            choices: {
              create: [
                {
                  text: 'Dân giàu, nước mạnh, dân chủ, công bằng, văn minh',
                  isCorrect: true,
                  order: 0
                },
                {
                  text: 'Phát triển công nghiệp',
                  isCorrect: false,
                  order: 1
                },
                {
                  text: 'Xóa bỏ tư hữu',
                  isCorrect: false,
                  order: 2
                },
                {
                  text: 'Tập trung quyền lực',
                  isCorrect: false,
                  order: 3
                }
              ]
            }
          }
        ]
      }
    }
  });

  console.log('✅ Đã tạo quiz: Tư tưởng Hồ Chí Minh - Cơ bản');

  // Tạo quiz mẫu về Lịch sử Việt Nam
  const quiz2 = await prisma.quiz.create({
    data: {
      title: 'Lịch sử Việt Nam - Thời kỳ thuộc địa',
      description: 'Kiểm tra kiến thức về lịch sử Việt Nam trong thời kỳ thuộc địa Pháp',
      difficulty: 'hard',
      category: 'Lịch sử',
      tags: ['Lịch sử', 'Thuộc địa', 'Pháp'],
      timeLimit: 45,
      isPublic: true,
      authorId: systemUser.id,
      questions: {
        create: [
          {
            question: 'Thực dân Pháp xâm lược Việt Nam vào năm nào?',
            type: 'single',
            difficulty: 'easy',
            explanation: 'Thực dân Pháp bắt đầu xâm lược Việt Nam từ năm 1858 với việc đánh chiếm Đà Nẵng.',
            topic: 'Xâm lược',
            order: 0,
            choices: {
              create: [
                {
                  text: '1858',
                  isCorrect: true,
                  order: 0
                },
                {
                  text: '1862',
                  isCorrect: false,
                  order: 1
                },
                {
                  text: '1883',
                  isCorrect: false,
                  order: 2
                },
                {
                  text: '1884',
                  isCorrect: false,
                  order: 3
                }
              ]
            }
          },
          {
            question: 'Hiệp ước nào đánh dấu việc Pháp hoàn thành việc xâm lược Việt Nam?',
            type: 'single',
            difficulty: 'medium',
            explanation: 'Hiệp ước Patenôtre năm 1884 đánh dấu việc Pháp hoàn thành việc xâm lược và thiết lập chế độ bảo hộ ở Việt Nam.',
            topic: 'Hiệp ước',
            order: 1,
            choices: {
              create: [
                {
                  text: 'Hiệp ước Patenôtre (1884)',
                  isCorrect: true,
                  order: 0
                },
                {
                  text: 'Hiệp ước Nhâm Tuất (1862)',
                  isCorrect: false,
                  order: 1
                },
                {
                  text: 'Hiệp ước Giáp Tuất (1874)',
                  isCorrect: false,
                  order: 2
                },
                {
                  text: 'Hiệp ước Quý Mùi (1883)',
                  isCorrect: false,
                  order: 3
                }
              ]
            }
          }
        ]
      }
    }
  });

  console.log('✅ Đã tạo quiz: Lịch sử Việt Nam - Thời kỳ thuộc địa');

  // Tạo quiz mẫu về Văn hóa
  const quiz3 = await prisma.quiz.create({
    data: {
      title: 'Văn hóa Việt Nam - Truyền thống',
      description: 'Khám phá những nét đẹp văn hóa truyền thống của dân tộc Việt Nam',
      difficulty: 'easy',
      category: 'Văn hóa',
      tags: ['Văn hóa', 'Truyền thống', 'Dân tộc'],
      timeLimit: 20,
      isPublic: true,
      authorId: systemUser.id,
      questions: {
        create: [
          {
            question: 'Tết Nguyên Đán là lễ hội quan trọng nhất trong năm của người Việt Nam. Đúng hay sai?',
            type: 'true_false',
            difficulty: 'easy',
            explanation: 'Tết Nguyên Đán là lễ hội quan trọng nhất trong năm của người Việt Nam, đánh dấu sự khởi đầu của năm mới theo âm lịch.',
            topic: 'Lễ hội',
            order: 0,
            choices: {
              create: [
                {
                  text: 'Đúng',
                  isCorrect: true,
                  order: 0
                },
                {
                  text: 'Sai',
                  isCorrect: false,
                  order: 1
                }
              ]
            }
          },
          {
            question: 'Những loại hình nghệ thuật nào sau đây là truyền thống của Việt Nam?',
            type: 'multiple',
            difficulty: 'medium',
            explanation: 'Chèo, Tuồng, Cải lương và Quan họ đều là những loại hình nghệ thuật truyền thống của Việt Nam.',
            topic: 'Nghệ thuật',
            order: 1,
            choices: {
              create: [
                {
                  text: 'Chèo',
                  isCorrect: true,
                  order: 0
                },
                {
                  text: 'Tuồng',
                  isCorrect: true,
                  order: 1
                },
                {
                  text: 'Cải lương',
                  isCorrect: true,
                  order: 2
                },
                {
                  text: 'Quan họ',
                  isCorrect: true,
                  order: 3
                },
                {
                  text: 'Opera',
                  isCorrect: false,
                  order: 4
                },
                {
                  text: 'Ballet',
                  isCorrect: false,
                  order: 5
                }
              ]
            }
          }
        ]
      }
    }
  });

  console.log('✅ Đã tạo quiz: Văn hóa Việt Nam - Truyền thống');

  console.log('🎉 Hoàn thành seed dữ liệu quiz!');
  console.log(`📊 Đã tạo ${3} quiz với tổng cộng ${7} câu hỏi`);
}

main()
  .catch((e) => {
    console.error('❌ Lỗi khi seed dữ liệu:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
