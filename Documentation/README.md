# 📊 ระบบสืบค้นข้อมูลรายงาน - Report Search System

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-green.svg)
![PostgreSQL](https://img.shields.io/badge/postgresql-%3E%3D13-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

ระบบจัดเก็บ ค้นหา และจัดการรายงานภายในองค์กร พร้อมระบบควบคุมสิทธิ์การเข้าถึง (Role-Based Access Control)

## ✨ Features

### 🔐 Authentication & Security
- ✅ Login/Logout with Session Management
- ✅ Role-Based Access Control (RBAC)
- ✅ Two-Factor Authentication (2FA)
- ✅ Password Policy & Management
- ✅ Activity Logging & Audit Trail
- ✅ Brute Force Protection

### 👥 User Management
- ✅ User CRUD Operations
- ✅ Role & Permission Management
- ✅ Department Management
- ✅ User Groups
- ✅ Bulk Import (CSV/Excel)
- ✅ User Activity Tracking

### 📊 Report Management
- ✅ Upload Multiple Files (Drag & Drop)
- ✅ Advanced Search & Filters
- ✅ Category & Tag Management
- ✅ Version Control
- ✅ Access Control (Public/Restricted/Private)
- ✅ Favorites & Bookmarks
- ✅ Preview & Download
- ✅ Download Statistics

### 📈 Dashboard & Analytics
- ✅ Real-time Statistics
- ✅ Usage Reports
- ✅ Popular Reports
- ✅ Activity Feed
- ✅ Charts & Graphs
- ✅ Storage Management

### 🔔 Notifications
- ✅ In-app Notifications
- ✅ Email Notifications
- ✅ Customizable Alerts
- ✅ Notification History

### ⚙️ System Settings
- ✅ System Configuration
- ✅ Email Settings (SMTP)
- ✅ Backup & Restore
- ✅ Maintenance Mode
- ✅ Theme Customization

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18
- **UI Library:** Material-UI (MUI)
- **State Management:** Zustand
- **HTTP Client:** Axios
- **Form Handling:** React Hook Form
- **Charts:** Recharts
- **Build Tool:** Vite

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Database:** PostgreSQL 13+
- **ORM:** Sequelize
- **Authentication:** JWT
- **File Upload:** Multer
- **Validation:** Express Validator

### Security
- Helmet.js (Security Headers)
- CORS Protection
- Rate Limiting
- SQL Injection Prevention
- XSS Protection
- CSRF Protection

## 📋 System Requirements

### Minimum Requirements
- **OS:** Windows 10/11, Linux, macOS
- **Node.js:** 18.0.0 or higher
- **PostgreSQL:** 13 or higher
- **RAM:** 4GB
- **Storage:** 10GB free space
- **Browser:** Chrome, Firefox, Safari, Edge (latest versions)

### Recommended Requirements
- **RAM:** 8GB or more
- **Storage:** 50GB+ for production
- **SSD:** For better performance

## 🚀 Quick Start

### Method 1: Automated Installation (Windows)

1. **Clone the repository**
```bash
git clone <repository-url>
cd report-search-system
```

2. **Run the main menu**
```bash
scripts\menu.bat
```

3. **Follow the menu options:**
   - Option 1: Install Dependencies
   - Option 2: Setup Database
   - Option 3: Start Application

### Method 2: Manual Installation

#### Step 1: Install Dependencies

**Backend:**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
```

**Frontend:**
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your configuration
```

#### Step 2: Setup Database

```bash
# Create database
psql -U postgres
CREATE DATABASE report_search_db;
\q

# Run schema
psql -U postgres -d report_search_db -f database/schema.sql

# Seed initial data
psql -U postgres -d report_search_db -f database/seed.sql
```

#### Step 3: Start Application

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

## 🌐 Access URLs

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api
- **API Documentation:** http://localhost:5000/api-docs

## 🔐 Default Credentials

### Super Admin
- **Email:** admin@example.com
- **Password:** Admin@123

### Manager
- **Email:** manager@example.com
- **Password:** Admin@123

### User
- **Email:** user@example.com
- **Password:** Admin@123

> ⚠️ **IMPORTANT:** Change these passwords immediately after first login!

## 📁 Project Structure

```
report-search-system/
├── backend/                 # Node.js Backend
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Custom middleware
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Utility functions
│   │   └── app.js          # Express app
│   ├── uploads/            # Uploaded files
│   ├── logs/               # Application logs
│   ├── .env                # Environment variables
│   └── server.js           # Entry point
│
├── frontend/                # React Frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── context/        # Context providers
│   │   ├── hooks/          # Custom hooks
│   │   ├── utils/          # Utilities
│   │   └── App.jsx         # Main component
│   └── package.json
│
├── database/                # Database scripts
│   ├── schema.sql          # Database schema
│   └── seed.sql            # Initial data
│
├── scripts/                 # Utility scripts
│   ├── menu.bat            # Main menu
│   ├── install.bat         # Installation
│   ├── setup-db.bat        # Database setup
│   ├── start.bat           # Start servers
│   └── stop.bat            # Stop servers
│
├── docs/                    # Documentation
│   ├── API.md              # API documentation
│   ├── USER_MANUAL.md      # User manual
│   └── ADMIN_MANUAL.md     # Admin manual
│
└── README.md               # This file
```

## 📚 Available Scripts

### Windows Batch Scripts

```bash
scripts\menu.bat        # Interactive main menu
scripts\install.bat     # Install all dependencies
scripts\setup-db.bat    # Setup database
scripts\start.bat       # Start both servers
scripts\stop.bat        # Stop all servers
```

### Backend Commands

```bash
npm start              # Start production server
npm run dev            # Start development server
npm run migrate        # Run database migrations
npm run seed           # Seed database
npm test              # Run tests
```

### Frontend Commands

```bash
npm run dev           # Start development server
npm run build         # Build for production
npm run preview       # Preview production build
npm run lint          # Run linter
```

## 🔧 Configuration

### Backend Environment Variables (.env)

```env
# Application
NODE_ENV=development
PORT=5000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=report_search_db
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d

# Upload
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=52428800

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-password
```

### Frontend Environment Variables (.env)

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Report Search System
VITE_MAX_FILE_SIZE=52428800
```

## 📖 API Documentation

### Authentication Endpoints

```
POST   /api/auth/login          # Login
POST   /api/auth/logout         # Logout
POST   /api/auth/register       # Register (if enabled)
POST   /api/auth/forgot-password # Forgot password
POST   /api/auth/reset-password  # Reset password
GET    /api/auth/me             # Get current user
```

### User Endpoints

```
GET    /api/users               # List users
GET    /api/users/:id           # Get user
POST   /api/users               # Create user
PUT    /api/users/:id           # Update user
DELETE /api/users/:id           # Delete user
```

### Report Endpoints

```
GET    /api/reports             # List reports
GET    /api/reports/:id         # Get report
POST   /api/reports             # Upload report
PUT    /api/reports/:id         # Update report
DELETE /api/reports/:id         # Delete report
GET    /api/reports/:id/download # Download report
```

For complete API documentation, visit: http://localhost:5000/api-docs

## 🐛 Troubleshooting

### Database Connection Error

```bash
# Check if PostgreSQL is running
# Windows:
net start postgresql-x64-13

# Verify credentials in backend/.env
```

### Port Already in Use

```bash
# Find process using port
netstat -ano | findstr :5000

# Kill process
taskkill /PID <process_id> /F
```

### Upload Failed

```bash
# Check upload directory permissions
# Create directory if missing
mkdir backend\uploads
```

### npm install fails

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 🔒 Security Best Practices

1. **Change Default Passwords**
   - Change all default admin passwords immediately

2. **Update JWT Secret**
   - Generate a strong, unique JWT secret
   - Never commit secrets to version control

3. **Enable HTTPS**
   - Use SSL/TLS in production
   - Configure proper CORS settings

4. **Database Security**
   - Use strong database passwords
   - Limit database access
   - Regular backups

5. **File Upload Security**
   - Validate file types
   - Scan for malware
   - Limit file sizes

6. **Regular Updates**
   - Keep dependencies updated
   - Apply security patches

## 📊 Performance Optimization

### Frontend
- Code splitting
- Lazy loading
- Image optimization
- Bundle size optimization

### Backend
- Database indexing
- Query optimization
- Caching (Redis)
- Connection pooling

### Database
- Regular VACUUM
- Index maintenance
- Query performance monitoring

#### Frontend Pages
src/pages/ReportsPage.jsx - แสดงรายการรายงาน
src/pages/ReportDetailPage.jsx - รายละเอียดรายงาน
src/pages/ReportUploadPage.jsx - อัปโหลดรายงาน
src/pages/UsersPage.jsx - จัดการผู้ใช้
src/pages/CategoriesPage.jsx - จัดการหมวดหมู่
src/pages/SettingsPage.jsx - ตั้งค่า
src/pages/ProfilePage.jsx - โปรไฟล์
src/pages/NotFoundPage.jsx - หน้า 404

Frontend Services:

src/services/userService.js
src/services/categoryService.js
src/services/dashboardService.js

CSS:

src/index.css - Global styles

## 🔄 Backup & Restore

### Manual Backup

```bash
# Backup database
pg_dump -U postgres report_search_db > backup_$(date +%Y%m%d).sql

# Backup uploaded files
tar -czf uploads_$(date +%Y%m%d).tar.gz backend/uploads/
```

### Restore

```bash
# Restore database
psql -U postgres report_search_db < backup_20250126.sql

# Restore files
tar -xzf uploads_20250126.tar.gz -C backend/
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) first.

## 📧 Support

For support and questions:
- 📧 Email: support@example.com
- 📚 Documentation: [docs/](docs/)
- 🐛 Issues: GitHub Issues

## 🙏 Acknowledgments

- Material-UI for the beautiful UI components
- Express.js community
- PostgreSQL team
- All contributors

## 📅 Changelog

### Version 1.0.0 (2025-01-26)
- ✨ Initial release
- ✅ Complete authentication system
- ✅ User management
- ✅ Report management
- ✅ Dashboard & analytics
- ✅ Notification system
- ✅ System settings

---

Made with ❤️ by [Your Team Name]

**Version:** 1.0.0  
**Last Updated:** January 26, 2025
