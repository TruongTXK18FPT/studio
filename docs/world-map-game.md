# 🗺️ Hành Trình Theo Chân Bác Hồ

Trò chơi bản đồ thế giới tương tác trong Next.js 14+ cho phép người chơi khám phá 30 quốc gia mà Chủ tịch Hồ Chí Minh từng đi qua trong hành trình tìm đường cứu nước.

## ✨ Tính năng

- 🌍 **Bản đồ thế giới tương tác**: Hiển thị bản đồ SVG với 30 quốc gia
- 🎯 **Quiz trắc nghiệm**: Mỗi quốc gia có câu hỏi lịch sử liên quan
- 🎨 **Hiệu ứng màu sắc**: Quốc gia sáng màu xanh (#00FF88) khi trả lời đúng
- 📊 **Theo dõi tiến độ**: Progress bar và điểm số real-time
- 🏆 **Victory screen**: Màn hình chiến thắng khi hoàn thành 30 quốc gia
- 📱 **Responsive design**: Hoạt động tốt trên mọi thiết bị
- ✨ **Animations**: Fade-in, hover effects, và transitions mượt mà

## 🚀 Cách sử dụng

### 1. Truy cập game
Mở trình duyệt và truy cập:
```
http://localhost:9002/world-map
```

### 2. Chơi game
1. **Click vào quốc gia** trên bản đồ để bắt đầu câu hỏi
2. **Đọc câu hỏi** về lịch sử của Bác Hồ tại quốc gia đó
3. **Chọn đáp án** từ 4 lựa chọn
4. **Nhận kết quả**:
   - ✅ Đúng: Quốc gia sáng màu xanh, điểm +1
   - ❌ Sai: Hiển thị đáp án đúng, không thay đổi màu
5. **Tiếp tục** click các quốc gia khác
6. **Hoàn thành**: Khi trả lời đủ 30 quốc gia → Victory screen

### 3. Chơi lại
Click nút **"Chơi lại"** để làm mới và bắt đầu lại từ đầu.

## 📁 Cấu trúc dự án

```
/app
 └── /world-map
      └── page.tsx           # Component chính của game

/public
 ├── /data
 │    └── countries.json     # Dữ liệu 30 quốc gia với câu hỏi
 └── world-map.svg            # File bản đồ thế giới SVG

/src/app
 └── globals.css              # Styles toàn cục + animations
```

## 🎯 Dữ liệu quốc gia

File `public/data/countries.json` chứa 30 quốc gia với cấu trúc:

```json
{
  "id": 1,
  "name": "Vietnam",
  "flag": "🇻🇳",
  "year": "1890-1911, 1941-1969",
  "question": "Bác Hồ ra đi tìm đường cứu nước từ bến nào?",
  "options": ["Bến Nhà Rồng", "Bến Bạch Đằng", "Bến Cửa Lò", "Bến Ninh Kiều"],
  "correctAnswer": "Bến Nhà Rồng"
}
```

### Các quốc gia được bao gồm:

1. 🇻🇳 Vietnam
2. 🇫🇷 France
3. 🇬🇧 United Kingdom
4. 🇺🇸 United States
5. 🇩🇿 Algeria
6. 🇹🇳 Tunisia
7. 🇧🇪 Belgium
8. 🇮🇹 Italy
9. 🇩🇪 Germany
10. 🇷🇺 Russia
11. 🇨🇳 China
12. 🇹🇭 Thailand
13. 🇮🇳 India
14. 🇸🇬 Singapore
15. 🇭🇰 Hong Kong
16. 🇲🇲 Burma (Myanmar)
17. 🇲🇾 Malaysia
18. 🇮🇩 Indonesia
19. 🇵🇭 Philippines
20. 🇱🇦 Laos
21. 🇰🇭 Cambodia
22. 🇨🇭 Switzerland
23. 🇦🇹 Austria
24. 🇵🇱 Poland
25. 🇲🇦 Morocco
26. 🇪🇸 Spain
27. 🇳🇱 Netherlands
28. 🇩🇰 Denmark
29. 🇸🇪 Sweden
30. 🇳🇴 Norway

## 🎨 Design & Styling

### Màu sắc chủ đạo
- **Gradient chính**: Red-Orange (`from-red-600 to-orange-600`)
- **Background**: Red-Yellow-Orange gradient
- **Quốc gia chưa trả lời**: `#d0d0d0` (xám nhạt)
- **Quốc gia hover**: `#ffcc00` (vàng)
- **Quốc gia hoàn thành**: `#00FF88` (xanh lá sáng)

### Font
- **Primary**: Poppins (Google Fonts)
- **Weights**: 400, 600, 700

### Animations
```css
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}
```

## 🛠️ Technical Stack

- **Framework**: Next.js 15.3.3
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **SVG**: Interactive world map

## 🔧 Customization

### Thêm quốc gia mới

1. Mở `public/data/countries.json`
2. Thêm object mới với format:
```json
{
  "id": 31,
  "name": "NewCountry",
  "flag": "🏴",
  "year": "1920",
  "question": "Câu hỏi mới?",
  "options": ["Đáp án 1", "Đáp án 2", "Đáp án 3", "Đáp án 4"],
  "correctAnswer": "Đáp án đúng"
}
```

3. Đảm bảo `name` khớp với `id` trong SVG map

### Thay đổi màu sắc

Sửa trong file `src/app/world-map/page.tsx`:
```typescript
// Màu quốc gia hoàn thành
element.style.fill = "#00FF88"; // Thay bằng màu mới

// Màu hover
element.style.fill = "#ffcc00"; // Thay bằng màu mới
```

### Thêm sound effects

```typescript
// Trong handleAnswer function
if (correct) {
  const audio = new Audio('/sounds/correct.mp3');
  audio.play();
}
```

## 📱 Responsive Design

Game tự động điều chỉnh cho các màn hình:
- 📱 Mobile: < 768px
- 💻 Tablet: 768px - 1024px
- 🖥️ Desktop: > 1024px

## 🎮 Features Roadmap

### Hiện tại ✅
- [x] Interactive world map
- [x] 30 countries with questions
- [x] Color-coded completion
- [x] Progress tracking
- [x] Victory screen

### Tương lai 🚀
- [ ] Sound effects (correct/wrong answers)
- [ ] Leaderboard system
- [ ] Multiplayer mode
- [ ] Time challenge mode
- [ ] Historical facts popup
- [ ] Export progress as certificate

## 🤝 Contributing

Mọi đóng góp đều được chào đón! Hãy:
1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

Project này được phát triển cho mục đích giáo dục, tôn vinh di sản của Chủ tịch Hồ Chí Minh.

## 👏 Acknowledgments

- Dữ liệu lịch sử từ các nguồn tài liệu uy tín về cuộc đời Bác Hồ
- World map SVG từ các nguồn mở
- UI components từ shadcn/ui
- Icons từ Lucide React

---

**Chúc bạn có trải nghiệm thú vị khi khám phá hành trình vĩ đại của Chủ tịch Hồ Chí Minh! 🇻🇳**
