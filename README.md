# hrm-thanhphu

Hệ thống quản lý hồ sơ nhân sự (HRM) triển khai trên **Cloudflare Pages** & **Cloudflare D1**.

## Công nghệ sử dụng
- **Frontend**: React 18, Vite, Tailwind CSS, Font Roboto
- **Thiết kế**: Flat Design, bo góc 3px, bộ màu thương hiệu `#DF301C`, `#00B7CD`, `#FF9100`, `#FFF1D1`
- **Backend API**: Cloudflare Pages Functions + Hono.js
- **Database**: Cloudflare D1 (Serverless SQLite) + Drizzle ORM

## Khởi chạy Local
```bash
# Cài đặt dependencies
npm install

# Chạy giao diện dev
npm run dev

# Giả lập Cloudflare Pages Functions + D1 Local
npm run pages:dev
```

## Đồng bộ D1 Migrations
```bash
# Local
npm run drizzle:migrate

# Remote Cloudflare D1
npm run drizzle:migrate:remote
```
