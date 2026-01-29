# ระบบสืบค้นข้อมูลรายงาน - Report Search System

## 📁 โครงสร้างโปรเจ็ค

```
report-search-system/
├── backend/                    # Node.js Backend
│   ├── src/
│   │   ├── config/            # การตั้งค่า
│   │   │   ├── database.js
│   │   │   ├── auth.js
│   │   │   └── upload.js
│   │   ├── controllers/       # Controllers
│   │   │   ├── authController.js
│   │   │   ├── userController.js
│   │   │   ├── reportController.js
│   │   │   └── dashboardController.js
│   │   ├── middleware/        # Middleware
│   │   │   ├── auth.js
│   │   │   ├── rbac.js
│   │   │   └── upload.js
│   │   ├── models/           # Database Models
│   │   │   ├── User.js
│   │   │   ├── Role.js
│   │   │   ├── Report.js
│   │   │   └── Category.js
│   │   ├── routes/           # API Routes
│   │   │   ├── auth.js
│   │   │   ├── users.js
│   │   │   ├── reports.js
│   │   │   └── dashboard.js
│   │   ├── utils/            # Utilities
│   │   │   ├── logger.js
│   │   │   └── validator.js
│   │   └── app.js            # Main Application
│   ├── uploads/              # Uploaded Files
│   ├── .env                  # Environment Variables
│   ├── package.json
│   └── server.js             # Entry Point
│
├── frontend/                  # React Frontend
│   ├── public/
│   │   ├── index.html
│   │   └── favicon.ico
│   ├── src/
│   │   ├── components/       # React Components
│   │   │   ├── auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Register.jsx
│   │   │   ├── dashboard/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   └── Statistics.jsx
│   │   │   ├── reports/
│   │   │   │   ├── ReportList.jsx
│   │   │   │   ├── ReportUpload.jsx
│   │   │   │   └── ReportPreview.jsx
│   │   │   ├── users/
│   │   │   │   ├── UserList.jsx
│   │   │   │   └── UserForm.jsx
│   │   │   └── layout/
│   │   │       ├── Header.jsx
│   │   │       ├── Sidebar.jsx
│   │   │       └── Footer.jsx
│   │   ├── pages/            # Pages
│   │   │   ├── LoginPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── ReportsPage.jsx
│   │   │   └── UsersPage.jsx
│   │   ├── services/         # API Services
│   │   │   ├── authService.js
│   │   │   ├── reportService.js
│   │   │   └── userService.js
│   │   ├── context/          # React Context
│   │   │   └── AuthContext.jsx
│   │   ├── utils/            # Utilities
│   │   │   └── constants.js
│   │   ├── App.jsx           # Main App
│   │   └── index.jsx         # Entry Point
│   ├── package.json
│   └── vite.config.js
│
├── database/                  # Database Scripts
│   ├── schema.sql            # Database Schema
│   ├── seed.sql              # Initial Data
│   └── migrations/           # Database Migrations
│
├── scripts/                   # Installation Scripts
│   ├── install.bat           # Windows Installation
│   ├── start.bat             # Start Application
│   ├── stop.bat              # Stop Application
│   └── setup-db.bat          # Database Setup
│
├── docs/                      # Documentation
│   ├── API.md                # API Documentation
│   ├── USER_MANUAL.md        # User Manual
│   └── ADMIN_MANUAL.md       # Admin Manual
│
├── README.md                  # Project README
└── docker-compose.yml         # Docker Configuration (Optional)
```

## 🚀 การติดตั้งและรัน

### ข้อกำหนดระบบ
- Node.js 18+ 
- PostgreSQL 13+
- Git
- 4GB RAM ขึ้นไป
- 10GB พื้นที่ว่าง

### วิธีติดตั้ง

#### 1. ติดตั้งอัตโนมัติ (Windows)
```bash
# โคลนโปรเจ็ค
git clone 
cd report-search-system

# รัน script ติดตั้ง
scripts\install.bat
```

#### 2. ติดตั้งด้วยตนเอง

##### ติดตั้ง Backend
```bash
cd backend
npm install
cp .env.example .env
# แก้ไขไฟล์ .env ตามต้องการ
npm run migrate
npm run seed
```

##### ติดตั้ง Frontend
```bash
cd frontend
npm install
cp .env.example .env
# แก้ไขไฟล์ .env ตามต้องการ
```

##### ติดตั้ง Database
```bash
# เข้าสู่ PostgreSQL
psql -U postgres

# สร้าง Database
CREATE DATABASE report_search_db;

# Import Schema
psql -U postgres -d report_search_db -f database/schema.sql

# Import Initial Data
psql -U postgres -d report_search_db -f database/seed.sql
```

### การรันระบบ

#### รันทั้งระบบพร้อมกัน
```bash
scripts\start.bat
```

#### รันแยกส่วน

##### Backend
```bash
cd backend
npm run dev
# หรือ
npm start
```

##### Frontend
```bash
cd frontend
npm run dev
```

### การหยุดระบบ
```bash
scripts\stop.bat
```

## 📝 ข้อมูลเข้าสู่ระบบเริ่มต้น

### Super Admin
- **Email:** admin@example.com
- **Password:** Admin@123

### Admin
- **Email:** user@example.com
- **Password:** User@123

## 🔧 การตั้งค่า Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=report_search_db
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=52428800
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Report Search System
```

## 📚 คำสั่งที่สำคัญ

### Backend Commands
```bash
npm run dev          # รันในโหมด Development
npm start            # รันในโหมด Production
npm run migrate      # รัน Database Migrations
npm run seed         # สร้างข้อมูลเริ่มต้น
npm test            # รัน Tests
```

### Frontend Commands
```bash
npm run dev         # รัน Development Server
npm run build       # Build สำหรับ Production
npm run preview     # Preview Production Build
npm run lint        # ตรวจสอบ Code Quality
```

## 🌐 URLs

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api
- **API Documentation:** http://localhost:5000/api-docs

## 📦 การ Deploy

### Production Build

#### Frontend
```bash
cd frontend
npm run build
# ไฟล์จะอยู่ใน dist/
```

#### Backend
```bash
cd backend
npm install --production
NODE_ENV=production npm start
```

## 🔒 Security Checklist

- [ ] เปลี่ยนรหัสผ่าน Admin เริ่มต้น
- [ ] เปลี่ยน JWT_SECRET
- [ ] ตั้งค่า CORS อย่างถูกต้อง
- [ ] เปิดใช้ HTTPS
- [ ] ตั้งค่า Rate Limiting
- [ ] เปิดใช้ Helmet.js
- [ ] ตรวจสอบ SQL Injection Protection
- [ ] ตั้งค่า CSP Headers

## 🐛 การแก้ไขปัญหาทั่วไป

### ปัญหา: Database Connection Failed
```bash
# ตรวจสอบว่า PostgreSQL ทำงานอยู่
# Windows:
net start postgresql-x64-13

# ตรวจสอบการตั้งค่าใน .env
```

### ปัญหา: Port Already in Use
```bash
# หา Process ที่ใช้ Port
netstat -ano | findstr :5000

# Kill Process
taskkill /PID  /F
```

### ปัญหา: Upload Failed
```bash
# ตรวจสอบสิทธิ์ Folder uploads/
# สร้าง Folder ถ้ายังไม่มี
mkdir backend\uploads
```

## 📞 การขอความช่วยเหลือ

- **Email:** support@example.com
- **Documentation:** /docs
- **Issue Tracker:** GitHub Issues

## 📄 License

MIT License - ดูรายละเอียดใน LICENSE file