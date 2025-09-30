import { redis } from "@/lib/db";

type InputItem = {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  timeLimitMs: number;
  category: string;
  explain: string;
};

async function main() {
  const data: InputItem[] = [
    {"id":"1a7f1c50-9d20-4b23-91a0-82afac110001","text":"Tên khai sinh của Chủ tịch Hồ Chí Minh là gì?","options":["Nguyễn Tất Thành","Nguyễn Văn Cừ","Nguyễn Ái Quốc","Nguyễn Sinh Cung"],"correctIndex":3,"timeLimitMs":20000,"category":"General","explain":"Tên khai sinh của Bác là Nguyễn Sinh Cung."},
    {"id":"2b8d2f11-4a50-43aa-8a55-90e1ff220002","text":"Chủ tịch Hồ Chí Minh sinh năm nào?","options":["1889","1890","1895","1900"],"correctIndex":1,"timeLimitMs":20000,"category":"General","explain":"Bác Hồ sinh ngày 19/5/1890."},
    {"id":"3c9f4d22-1b43-4b83-9c10-23b7ee330003","text":"Quê hương của Bác Hồ ở đâu?","options":["Nghệ An","Hà Nội","Huế","Thanh Hóa"],"correctIndex":0,"timeLimitMs":20000,"category":"General","explain":"Bác Hồ sinh ra ở làng Kim Liên, Nam Đàn, Nghệ An."},
    {"id":"4d1e5f33-6b84-47ee-b2c5-41aa9c440004","text":"Năm 1911, Bác Hồ ra đi tìm đường cứu nước từ bến cảng nào?","options":["Bến Bạch Đằng","Bến Nhà Rồng","Bến Ninh Kiều","Cảng Hải Phòng"],"correctIndex":1,"timeLimitMs":20000,"category":"General","explain":"Ngày 5/6/1911, Bác ra đi tìm đường cứu nước từ Bến Nhà Rồng."},
    {"id":"5e2f6a44-9c95-44ef-a2d0-62ccad550005","text":"Bác Hồ từng lấy bút danh nào để hoạt động cách mạng?","options":["Trần Phú","Nguyễn Ái Quốc","Phan Bội Châu","Nguyễn Văn Linh"],"correctIndex":1,"timeLimitMs":20000,"category":"General","explain":"Nguyễn Ái Quốc là bút danh nổi tiếng của Bác Hồ."},
    {"id":"6f306b55-0da6-4e0e-9f10-73dde0660006","text":"Năm nào Đảng Cộng sản Việt Nam được thành lập dưới sự lãnh đạo của Bác Hồ?","options":["1925","1930","1941","1945"],"correctIndex":1,"timeLimitMs":20000,"category":"General","explain":"Đảng Cộng sản Việt Nam được thành lập ngày 3/2/1930."},
    {"id":"7a416c66-3b17-4c1e-81a0-84efb1770007","text":"Bác Hồ đọc Tuyên ngôn Độc lập tại Quảng trường Ba Đình vào ngày nào?","options":["2/9/1945","3/2/1930","19/8/1945","7/5/1954"],"correctIndex":0,"timeLimitMs":20000,"category":"General","explain":"Ngày 2/9/1945, Bác Hồ đọc Tuyên ngôn Độc lập khai sinh nước Việt Nam Dân chủ Cộng hòa."},
    {"id":"8b527d77-2c28-47f5-a3b0-95ff12880008","text":"Ngôi nhà sàn của Bác Hồ tại Phủ Chủ tịch được xây dựng vào năm nào?","options":["1954","1958","1960","1965"],"correctIndex":1,"timeLimitMs":20000,"category":"Fun","explain":"Ngôi nhà sàn của Bác Hồ được xây dựng vào năm 1958."},
    {"id":"9c638e88-4d39-41f1-b3c1-56aa23990009","text":"Bác Hồ viết tác phẩm 'Đường Kách mệnh' vào năm nào?","options":["1925","1927","1930","1941"],"correctIndex":1,"timeLimitMs":20000,"category":"General","explain":"Tác phẩm 'Đường Kách mệnh' được Bác viết năm 1927."},
    {"id":"0d749f99-5e4a-4012-b4d2-67bb34aa0010","text":"Trong Thư gửi học sinh ngày khai trường đầu tiên của nước Việt Nam Dân chủ Cộng hòa, Bác Hồ viết vào ngày nào?","options":["5/9/1945","2/9/1945","3/2/1946","19/8/1945"],"correctIndex":0,"timeLimitMs":20000,"category":"School","explain":"Bác Hồ gửi thư cho học sinh nhân ngày khai trường 5/9/1945."},
    {"id":"1e85b0aa-6f5b-4c23-b5e3-78cc45bb0011","text":"Bác Hồ mất vào năm nào?","options":["1968","1969","1970","1975"],"correctIndex":1,"timeLimitMs":20000,"category":"General","explain":"Bác Hồ mất ngày 2/9/1969."},
    {"id":"2f96c1bb-7d61-4d34-86f4-89dd56cc0012","text":"Tên gọi thân mật mà nhân dân thường gọi Chủ tịch Hồ Chí Minh là gì?","options":["Bác Hồ","Chủ tịch","Người thầy","Cụ Hồ"],"correctIndex":0,"timeLimitMs":20000,"category":"Fun","explain":"Người dân Việt Nam trìu mến gọi Người là Bác Hồ."},
    {"id":"3a07d2cc-8e72-4e45-97f5-90ee67dd0013","text":"Bác Hồ từng học ở ngôi trường nào tại Huế?","options":["Quốc Học Huế","Đại học Đông Dương","Trường Bưởi","Trường Sư phạm"],"correctIndex":0,"timeLimitMs":20000,"category":"School","explain":"Bác Hồ từng theo học tại trường Quốc Học Huế."},
    {"id":"4b18e3dd-9f83-4f56-98a6-a1ff78ee0014","text":"Tác phẩm 'Nhật ký trong tù' của Bác Hồ được viết trong hoàn cảnh nào?","options":["Trong tù ở Trung Quốc","Trong kháng chiến chống Mỹ","Trong kháng chiến chống Pháp","Trong tù ở Côn Đảo"],"correctIndex":0,"timeLimitMs":20000,"category":"General","explain":"Tác phẩm được viết khi Bác bị giam giữ ở nhà tù Trung Quốc (1942–1943)."},
    {"id":"5c29f4ee-af94-4f67-99b7-b2ff89ff0015","text":"Bác Hồ được UNESCO vinh danh là 'Anh hùng giải phóng dân tộc và danh nhân văn hóa kiệt xuất' vào năm nào?","options":["1987","1990","1995","2000"],"correctIndex":0,"timeLimitMs":20000,"category":"General","explain":"Năm 1987, UNESCO đã vinh danh Bác Hồ."}
  ];

  const transformed = data.map((q) => ({
    id: q.id,
    question: q.text,
    answers: q.options,
    correctIndex: q.correctIndex,
    timeLimitMs: q.timeLimitMs,
    category: q.category,
    explain: q.explain,
  }));

  await redis.set("br:questions_raw", data);
  await redis.set("br:questions", transformed);
  console.log(`Seeded ${data.length} battle questions.`);
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });


