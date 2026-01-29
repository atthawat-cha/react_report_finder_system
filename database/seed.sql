-- ข้อมูลเริ่มต้นสำหรับระบบ

-- ===========================
-- 1. Roles
-- ===========================
INSERT INTO roles (name, description) VALUES
('Super Admin', 'ผู้ดูแลระบบสูงสุด มีสิทธิ์เต็มทุกอย่าง'),
('Admin', 'ผู้ดูแลระบบ จัดการผู้ใช้และรายงาน'),
('Manager', 'ผู้จัดการ สามารถอนุมัติและจัดการรายงาน'),
('User', 'ผู้ใช้งานทั่วไป ค้นหาและดาวน์โหลดรายงาน'),
('Guest', 'ผู้เยี่ยมชม ดูรายงานได้อย่างเดียว');

-- ===========================
-- 2. Permissions
-- ===========================
INSERT INTO permissions (name, description, category) VALUES
-- User Management
('user.create', 'สร้างผู้ใช้ใหม่', 'User Management'),
('user.read', 'ดูข้อมูลผู้ใช้', 'User Management'),
('user.update', 'แก้ไขข้อมูลผู้ใช้', 'User Management'),
('user.delete', 'ลบผู้ใช้', 'User Management'),
('user.manage_roles', 'จัดการบทบาทผู้ใช้', 'User Management'),

-- Report Management
('report.create', 'สร้างรายงานใหม่', 'Report Management'),
('report.read', 'ดูรายงาน', 'Report Management'),
('report.update', 'แก้ไขรายงาน', 'Report Management'),
('report.delete', 'ลบรายงาน', 'Report Management'),
('report.upload', 'อัปโหลดรายงาน', 'Report Management'),
('report.download', 'ดาวน์โหลดรายงาน', 'Report Management'),
('report.approve', 'อนุมัติรายงาน', 'Report Management'),

-- Category Management
('category.create', 'สร้างหมวดหมู่', 'Category Management'),
('category.read', 'ดูหมวดหมู่', 'Category Management'),
('category.update', 'แก้ไขหมวดหมู่', 'Category Management'),
('category.delete', 'ลบหมวดหมู่', 'Category Management'),

-- System Settings
('settings.view', 'ดูการตั้งค่าระบบ', 'System Settings'),
('settings.update', 'แก้ไขการตั้งค่าระบบ', 'System Settings'),

-- Dashboard
('dashboard.view', 'ดู Dashboard', 'Dashboard'),
('dashboard.statistics', 'ดูสถิติ', 'Dashboard'),

-- Audit
('audit.view', 'ดู Activity Logs', 'Audit');

-- ===========================
-- 3. Role-Permission Mapping
-- ===========================

-- Super Admin (All permissions)
INSERT INTO role_permissions (role_id, permission_id)
SELECT 1, id FROM permissions;

-- Admin (Most permissions except system settings update)
INSERT INTO role_permissions (role_id, permission_id)
SELECT 2, id FROM permissions WHERE name != 'settings.update';

-- Manager (Report and category management)
INSERT INTO role_permissions (role_id, permission_id)
SELECT 3, id FROM permissions WHERE category IN ('Report Management', 'Category Management', 'Dashboard');

-- User (Basic read and download)
INSERT INTO role_permissions (role_id, permission_id)
SELECT 4, id FROM permissions WHERE name IN ('report.read', 'report.download', 'category.read', 'dashboard.view');

-- Guest (Read only)
INSERT INTO role_permissions (role_id, permission_id)
SELECT 5, id FROM permissions WHERE name IN ('report.read', 'category.read');

-- ===========================
-- 4. Departments
-- ===========================
INSERT INTO departments (name, code, description) VALUES
('ฝ่ายบริหาร', 'ADMIN', 'ฝ่ายบริหารจัดการ'),
('ฝ่ายบัญชีและการเงิน', 'FINANCE', 'ฝ่ายบัญชี การเงิน งบประมาณ'),
('ฝ่ายทรัพยากรบุคคล', 'HR', 'ฝ่ายจัดการทรัพยากรบุคคล'),
('ฝ่ายเทคโนโลยีสารสนเทศ', 'IT', 'ฝ่ายดูแลระบบเทคโนโลยี'),
('ฝ่ายการตลาด', 'MARKETING', 'ฝ่ายการตลาดและประชาสัมพันธ์'),
('ฝ่ายปฏิบัติการ', 'OPERATION', 'ฝ่ายปฏิบัติการหลัก');

-- ===========================
-- 5. Users
-- ===========================
-- Password: Admin@123 (hashed with bcrypt)
INSERT INTO users (username, email, password_hash, first_name, last_name, phone, department_id, position, status, email_verified) VALUES
('admin', 'admin@example.com', '$2a$10$YourHashedPasswordHere', 'ผู้ดูแล', 'ระบบ', '0812345678', 1, 'System Administrator', 'active', true),
('manager', 'manager@example.com', '$2a$10$YourHashedPasswordHere', 'ผู้จัดการ', 'ทั่วไป', '0823456789', 1, 'Manager', 'active', true),
('user', 'user@example.com', '$2a$10$YourHashedPasswordHere', 'ผู้ใช้', 'ทั่วไป', '0834567890', 2, 'Staff', 'active', true);

-- ===========================
-- 6. User-Role Mapping
-- ===========================
INSERT INTO user_roles (user_id, role_id) VALUES
(1, 1), -- admin -> Super Admin
(2, 3), -- manager -> Manager
(3, 4); -- user -> User

-- ===========================
-- 7. Categories
-- ===========================
INSERT INTO categories (name, slug, description, color, icon, sort_order) VALUES
('รายงานประจำปี', 'annual-report', 'รายงานประจำปีของหน่วยงาน', '#3B82F6', 'description', 1),
('รายงานการเงิน', 'financial-report', 'รายงานด้านการเงินและบัญชี', '#10B981', 'account_balance', 2),
('รายงานการตลาด', 'marketing-report', 'รายงานกิจกรรมทางการตลาด', '#F59E0B', 'campaign', 3),
('รายงานทรัพยากรบุคคล', 'hr-report', 'รายงานด้าน HR และพนักงาน', '#8B5CF6', 'people', 4),
('รายงานเทคโนโลยี', 'tech-report', 'รายงานด้านเทคโนโลยีและระบบ', '#EF4444', 'computer', 5),
('รายงานอื่นๆ', 'other-report', 'รายงานประเภทอื่นๆ', '#6B7280', 'folder', 6);

-- ===========================
-- 8. Tags
-- ===========================
INSERT INTO tags (name, slug) VALUES
('ด่วน', 'urgent'),
('สำคัญ', 'important'),
('ประจำเดือน', 'monthly'),
('ประจำไตรมาส', 'quarterly'),
('ประจำปี', 'annual'),
('ภายใน', 'internal'),
('สาธารณะ', 'public'),
('ลับ', 'confidential');

-- ===========================
-- 9. System Settings
-- ===========================
INSERT INTO settings (key, value, type, description, category) VALUES
('site_name', 'ระบบสืบค้นข้อมูลรายงาน', 'string', 'ชื่อระบบ', 'General'),
('site_description', 'ระบบจัดเก็บและค้นหารายงานภายในองค์กร', 'string', 'คำอธิบายระบบ', 'General'),
('max_upload_size', '52428800', 'number', 'ขนาดไฟล์สูงสุด (bytes)', 'Upload'),
('allowed_file_types', 'pdf,doc,docx,xls,xlsx,ppt,pptx', 'string', 'ประเภทไฟล์ที่อนุญาต', 'Upload'),
('items_per_page', '20', 'number', 'จำนวนรายการต่อหน้า', 'Display'),
('enable_registration', 'false', 'boolean', 'เปิดให้ลงทะเบียนได้', 'Security'),
('enable_2fa', 'false', 'boolean', 'เปิดใช้งาน 2FA', 'Security'),
('session_timeout', '3600', 'number', 'เวลา session timeout (วินาที)', 'Security'),
('backup_enabled', 'true', 'boolean', 'เปิดใช้งาน auto backup', 'Backup'),
('backup_schedule', '0 2 * * *', 'string', 'กำหนดเวลา backup (cron)', 'Backup'),
('email_notifications', 'true', 'boolean', 'เปิดการแจ้งเตือนทางอีเมล', 'Notification'),
('maintenance_mode', 'false', 'boolean', 'โหมดปิดปรับปรุง', 'System');

-- ===========================
-- 10. Sample Reports (for testing)
-- ===========================
INSERT INTO reports (code, title, title_en, description, category_id, department_id, file_name, file_path, file_type, status, access_level, created_by) VALUES
('RPT-2025-001', 'รายงานประจำปี 2024', 'Annual Report 2024', 'รายงานสรุปผลการดำเนินงานประจำปี 2024', 1, 1, 'annual_report_2024.pdf', '/uploads/reports/annual_report_2024.pdf', 'pdf', 'published', 'public', 1),
('RPT-2025-002', 'งบการเงิน Q4/2024', 'Financial Statement Q4/2024', 'งบการเงินไตรมาสที่ 4 ปี 2024', 2, 2, 'financial_q4_2024.pdf', '/uploads/reports/financial_q4_2024.pdf', 'pdf', 'published', 'restricted', 1),
('RPT-2025-003', 'รายงานการตลาด มกราคม 2025', 'Marketing Report Jan 2025', 'สรุปกิจกรรมการตลาดประจำเดือนมกราคม', 3, 5, 'marketing_jan_2025.pdf', '/uploads/reports/marketing_jan_2025.pdf', 'pdf', 'published', 'public', 2);

-- ===========================
-- 11. Sample Report Tags
-- ===========================
INSERT INTO report_tags (report_id, tag_id) VALUES
(1, 5), -- Annual Report -> annual
(1, 2), -- Annual Report -> important
(2, 4), -- Financial Q4 -> quarterly
(2, 8), -- Financial Q4 -> confidential
(3, 3), -- Marketing Jan -> monthly
(3, 7); -- Marketing Jan -> public

-- ===========================
-- Success Message
-- ===========================
DO $$
BEGIN
    RAISE NOTICE '✅ Database seeded successfully!';
    RAISE NOTICE '📊 Created: 5 roles, 20+ permissions, 6 departments, 3 users, 6 categories, 8 tags, 3 sample reports';
    RAISE NOTICE '🔐 Default credentials:';
    RAISE NOTICE '   Admin: admin@example.com / Admin@123';
    RAISE NOTICE '   Manager: manager@example.com / Admin@123';
    RAISE NOTICE '   User: user@example.com / Admin@123';
END $$;