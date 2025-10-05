# 🎮 Hướng dẫn chơi "Hành trình theo chân Bác Hồ"

## 🚀 Bắt đầu

### Bước 1: Truy cập game
Mở trình duyệt và truy cập:
```
http://localhost:9002/world-map
```

### Bước 2: Quan sát bản đồ
Khi trang load, bạn sẽ thấy:

```
🗺️ BẢN ĐỒ THẾ GIỚI
┌─────────────────────────────────────────┐
│  💡 Hint: Click vào quốc gia màu vàng   │
│                                         │
│     🟡🟡🟡  ← 30 quốc gia highlight     │
│   🟡  🟡🟡🟡  màu vàng gold            │
│  🟡🟡  🟡🟡🟡                          │
│   🟡🟡🟡  🟡                           │
│                                         │
│                         📊 [15/30]      │
└─────────────────────────────────────────┘

📜 LEGEND:
⬜ Quốc gia khác  🟡 Bác đã đi qua  🟧 Đang chọn  🟢 Đã hoàn thành
```

## 🎯 Cách chơi

### Phương pháp 1: Click trên bản đồ
1. **Tìm quốc gia màu vàng** (có border cam)
2. **Click vào quốc gia** đó
3. **Popup xuất hiện** với câu hỏi

### Phương pháp 2: Click trong danh sách
Dưới bản đồ có grid 30 quốc gia:

```
┌─────────┬─────────┬─────────┬─────────┬─────────┐
│ 🇻🇳      │ 🇫🇷      │ 🇬🇧      │ 🇺🇸      │ 🇩🇿      │
│ Vietnam │ France  │ UK      │ USA     │ Algeria │
│ 1890-   │ 1911-   │ 1911-   │ 1912-   │ 1913    │
│ 1969    │ 1923    │ 1912    │ 1913    │         │
│ 🟡      │ 🟡      │ 🟡      │ 🟡      │ 🟡      │
└─────────┴─────────┴─────────┴─────────┴─────────┘
```

Click vào bất kỳ card nào → Popup câu hỏi xuất hiện

## 📝 Trả lời câu hỏi

### Giao diện Popup:

```
╔═══════════════════════════════════════════╗
║  🇻🇳 Vietnam (1890-1911, 1941-1969)       ║
╠═══════════════════════════════════════════╣
║                                           ║
║  Bác Hồ ra đi tìm đường cứu nước          ║
║  từ bến nào?                              ║
║                                           ║
║  ┌─────────────────────────────────────┐ ║
║  │ 🔵 Bến Nhà Rồng                     │ ║
║  └─────────────────────────────────────┘ ║
║  ┌─────────────────────────────────────┐ ║
║  │ 🔵 Bến Bạch Đằng                    │ ║
║  └─────────────────────────────────────┘ ║
║  ┌─────────────────────────────────────┐ ║
║  │ 🔵 Bến Cửa Lò                       │ ║
║  └─────────────────────────────────────┘ ║
║  ┌─────────────────────────────────────┐ ║
║  │ 🔵 Bến Ninh Kiều                    │ ║
║  └─────────────────────────────────────┘ ║
╚═══════════════════════════════════════════╝
```

### Kết quả:

#### ✅ Trả lời ĐÚNG:
```
╔═══════════════════════════════════════════╗
║  ✅ Chính xác! Tuyệt vời! 🎉              ║
╚═══════════════════════════════════════════╝
```
- Quốc gia trên bản đồ chuyển sang màu XANH LÁ 🟢
- Điểm số tăng +1
- Progress bar tăng
- Card trong grid có dấu ✅

#### ❌ Trả lời SAI:
```
╔═══════════════════════════════════════════╗
║  ❌ Chưa đúng. Hãy thử lại nhé!           ║
║                                           ║
║  Đáp án đúng: Bến Nhà Rồng               ║
╚═══════════════════════════════════════════╝
```
- Quốc gia vẫn giữ màu VÀNG 🟡
- Điểm không tăng
- Có thể click lại để thử lần nữa

## 📊 Theo dõi tiến độ

### Trên header card:
```
┌──────────────────────────────────────┐
│ 🏆 Tiến độ hành trình                │
│                                      │
│ ▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░  50%          │
│                                      │
│ Điểm số: 15              15/30      │
└──────────────────────────────────────┘
```

### Trên bản đồ (top-right):
```
┌─────────┐
│  15/30  │
│ Quốc gia│
│ đã hoàn │
│  thành  │
└─────────┘
```

## 🏆 Hoàn thành game

Khi đạt **30/30 quốc gia**, màn hình Victory xuất hiện:

```
╔═══════════════════════════════════════════╗
║                                           ║
║           🏆                              ║
║                                           ║
║     CHÚC MỪNG! 🎊                         ║
║                                           ║
║  Bạn đã hoàn thành hành trình             ║
║  theo chân Bác Hồ!                        ║
║                                           ║
║  ┌─────────────────────────────────┐     ║
║  │           30/30                 │     ║
║  │     câu trả lời đúng            │     ║
║  └─────────────────────────────────┘     ║
║                                           ║
║  ┌─────────────────────────────────┐     ║
║  │     ✨ Chơi lại                 │     ║
║  └─────────────────────────────────┘     ║
╚═══════════════════════════════════════════╝
```

## 🎨 Hiểu màu sắc

### Trên bản đồ:
- **⬜ Xám nhạt (#e0e0e0)**: Quốc gia Bác chưa đi qua
- **🟡 Vàng gold (#ffd700)**: Quốc gia Bác đã đi qua, chưa trả lời
  - Border cam (#ff6b00) width 2px
- **🟧 Vàng sáng (#ffcc00)**: Đang hover/chọn
  - Border tăng lên 3px
- **🟢 Xanh lá (#00FF88)**: Đã trả lời đúng
  - Không click được nữa

### Trong grid:
- **🟡 Nền vàng nhạt**: Chưa hoàn thành, có thể click
- **🟢 Nền xanh nhạt**: Đã hoàn thành, có dấu ✅

## ⌨️ Keyboard Shortcuts (Coming soon)
- `Space`: Mở quốc gia tiếp theo
- `Esc`: Đóng popup
- `Enter`: Confirm đáp án
- `1-4`: Chọn option 1-4

## 📱 Mobile Tips

### Trên điện thoại:
1. **Zoom in**: Pinch-to-zoom để xem rõ quốc gia nhỏ
2. **Scroll**: Grid list dễ scroll hơn map
3. **Tap**: Tap nhẹ vào card trong grid
4. **Portrait mode**: Tốt nhất là dùng chế độ dọc

### Trên tablet:
- Landscape mode cho view toàn cảnh
- Vừa nhìn map vừa nhìn grid
- Touch-friendly button size

## 🎓 Tips để đạt điểm cao

1. **Đọc kỹ đề**: Mỗi câu hỏi có manh mối
2. **Nhớ năm tháng**: Timeline rất quan trọng
3. **Logic lịch sử**: Suy luận theo thứ tự hành trình
4. **Học từ sai lầm**: Đáp án đúng luôn được hiển thị
5. **Kiên trì**: Click lại để thử nếu sai

## 🔄 Chơi lại

Muốn reset và chơi từ đầu:
1. Click nút **"Chơi lại"** ở Victory screen
2. Hoặc refresh trang (F5)
3. Tất cả progress sẽ được reset

## 📚 Học thêm

Sau khi hoàn thành, bạn có thể:
- Xem lại timeline chi tiết: `/timeline`
- Đọc thư và văn bản: `/letters`
- Khám phá thư viện: `/gallery`
- Thử quiz khác: `/quiz`

---

## 🎯 Mục tiêu học tập

Qua trò chơi này, bạn sẽ:
- ✅ Biết 30 quốc gia Bác Hồ từng đi qua
- ✅ Hiểu mục đích từng chuyến đi
- ✅ Nhớ các mốc thời gian quan trọng
- ✅ Trân trọng hành trình tìm đường cứu nước

---

**Chúc bạn có trải nghiệm thú vị! 🇻🇳**

*"Đường đi khó khăn, nhưng ý chí quyết tâm sẽ chiến thắng!"*
