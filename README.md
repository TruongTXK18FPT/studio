# Hành Trình Bác Hồ - Authentication Module

Module xác thực hoàn chỉnh cho ứng dụng Next.js 14 với App Router.

Đây là một dự án Next.js được tạo cho "Hành Trình Bác Hồ", một trang web tư liệu về cuộc đời và sự nghiệp của Chủ tịch Hồ Chí Minh.

## Tính năng Authentication

- ✅ Đăng ký/Đăng nhập với email và mật khẩu
- ✅ JWT authentication với HTTP-Only cookies
- ✅ Mã hóa mật khẩu bằng bcrypt (salt rounds = 12)
- ✅ Middleware bảo vệ route /dashboard
- ✅ UI trang nghiêm phong cách Việt Nam (màu ivory, đỏ thẫm)
- ✅ Prisma ORM với PostgreSQL (Neon)
- ✅ Validation với Zod
- ✅ TypeScript support
- ✅ Responsive design với TailwindCSS

## Bắt đầu

Để chạy ứng dụng ở chế độ phát triển, hãy làm theo các bước sau:

1.  Cài đặt các gói phụ thuộc:
    ```bash
    npm install
    ```

2.  Cấu hình môi trường - Cập nhật file `.env`:
    ```env
    DATABASE_URL="postgresql://USER:PASSWORD@HOST/neondb?sslmode=require"
    JWT_SECRET="your_super_secret_jwt_key_32_characters_or_more"
    ```

3.  Chạy Prisma migration:
    ```bash
    npx prisma migrate dev --name init
    npx prisma generate
    ```

4.  Chạy máy chủ phát triển:
    ```bash
    npm run dev
    ```

5.  Mở [http://localhost:3000](http://localhost:3000) trong trình duyệt của bạn để xem kết quả.

## Các tính năng

- **Dòng thời gian**: Khám phá các sự kiện quan trọng trong cuộc đời Bác Hồ.
- **Thư viện**: Xem bộ sưu tập ảnh và tài liệu.
- **Thư & Văn bản**: Đọc các bức thư, bài thơ và văn bản gốc.
- **Cộng đồng**: Chia sẻ và thảo luận các bài viết liên quan.
- **🆕 Authentication**: Đăng ký, đăng nhập và quản lý tài khoản cá nhân.

## Authentication Usage

### Đăng ký tài khoản
1. Truy cập `/register`
2. Nhập email, mật khẩu (và tên tuỳ chọn)
3. Nhấn "Đăng ký"

### Đăng nhập
1. Truy cập `/login`  
2. Nhập email và mật khẩu
3. Nhấn "Đăng nhập"
4. Được chuyển hướng đến `/dashboard`

### Truy cập dashboard
- URL: `/dashboard`
- Yêu cầu đăng nhập
- Hiển thị thông tin user và các tính năng cá nhân

## API Endpoints

- `POST /api/auth/register` - Đăng ký tài khoản mới
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/logout` - Đăng xuất
- `GET /api/auth/me` - Lấy thông tin user hiện tại

## Database Schema (Prisma)

### User Model
- `id`: String (CUID)
- `email`: String (unique) 
- `name`: String (nullable)
- `passwordHash`: String
- `createdAt`, `updatedAt`: DateTime

### Post Model (Chuẩn bị cho tương lai)
- Đã setup sẵn để mở rộng tính năng community

## Bảo mật

- ✅ Mật khẩu hash với bcrypt (salt rounds = 12)
- ✅ JWT với HTTP-Only cookies
- ✅ Middleware route protection
- ✅ Input validation với Zod
- ✅ Secure cookie settings
- ✅ Error handling đầy đủ

---

© 2025 Hành Trình Bác Hồ. Made with ❤️ in Vietnam.
