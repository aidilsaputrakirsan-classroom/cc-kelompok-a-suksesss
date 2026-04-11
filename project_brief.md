
# PROJECT: SafeSpace - Cloud-Based Counseling Management System

## 🎯 PROJECT OVERVIEW
Build "SafeSpace" - a web application for school counseling (BK) management that prioritizes student privacy, accessibility, and digital documentation. The platform allows students to submit counseling requests anonymously (without login), choose their preferred counselor, and communicate securely. Counselors have dashboards to manage requests, track progress, and publish news.

## 🌟 CORE PRINCIPLES
1. **Privacy-First**: Student data is isolated - Counselor A can ONLY see students who chose them
2. **Low Barrier**: Students can submit forms WITHOUT login (guest access)
3. **Flexibility**: All dropdown options (classes, topics, times, places) are dynamic and managed by counselors
4. **Cloud-Native**: Scalable, real-time features, automated backups

## 👥 USER ROLES & PERMISSIONS

### 1. GUEST (No Login)
- Access landing page
- Read news articles
- Submit counseling form
- Track submission status (via unique code)

### 2. STUDENT (No Login Required - Guest Mode)
- Fill counseling request form
- Choose preferred counselor
- Select from dynamic dropdowns (class, topic, time, place)
- Receive confirmation popup
- Track status via unique tracking code
- Access WhatsApp direct link (if accepted)

### 3. COUNSELOR (Guru BK) - Login Required
**Access Level: Own Data Only**
- Dashboard with statistics
- View ONLY students who chose them (CRITICAL: data isolation)
- Accept/Reject counseling requests
- Access student WhatsApp number (after acceptance)
- Add session notes/progress
- Create & publish news (with author attribution)
- Manage dynamic dropdowns:
  - Classes (X-A, X-B, XI IPA, etc.)
  - Topics (Learning, Career, Family, etc.)
  - Time slots (Break 1, After School, etc.)
  - Places (BK Room 1, Online, etc.)
- Export data to Excel/CSV
- View chat history with own students

### 4. SUPER ADMIN - Login Required
**Access Level: Global**
- View all data across all counselors
- Manage counselor accounts (CRUD)
- System monitoring & audit logs
- School settings configuration
- Backup & restore

## 📊 DATABASE SCHEMA (Key Tables)

```prisma
// Users (Counselors & Admin)
User {
  id: String (PK)
  name: String
  email: String (unique)
  password: String (hashed)
  role: Enum ['COUNSELOR', 'ADMIN']
  phone: String
  photo: String
  specialization: String
  createdAt: DateTime
  updatedAt: DateTime
}

// Students (No auth - just data)
Student {
  id: String (PK)
  name: String
  class: String
  gender: Enum ['MALE', 'FEMALE']
  phone: String
  createdAt: DateTime
}

// Counseling Requests
Consultation {
  id: String (PK)
  trackingCode: String (unique, for guest tracking)
  studentId: String (FK)
  counselorId: String (FK) ← CRITICAL FOR ISOLATION
  method: Enum ['INDIVIDUAL', 'GROUP']
  topic: String
  date: DateTime
  time: String
  place: String
  status: Enum ['PENDING', 'ACCEPTED', 'REJECTED']
  notes: String (counselor session notes)
  acceptedAt: DateTime
  rejectedAt: DateTime
  completedAt: DateTime
  createdAt: DateTime
  updatedAt: DateTime
}

// News Articles
News {
  id: String (PK)
  title: String
  slug: String (unique)
  content: Text
  image: String
  authorId: String (FK to User)
  authorName: String (denormalized for display)
  published: Boolean
  publishedAt: DateTime
  createdAt: DateTime
  updatedAt: DateTime
}

// Dynamic Dropdown Options
SchoolClass {
  id: String (PK)
  name: String (e.g., "X-A", "XI IPA 1")
  active: Boolean
}

Topic {
  id: String (PK)
  name: String (e.g., "Learning", "Career", "Family")
  icon: String
  color: String
  active: Boolean
}

TimeSlot {
  id: String (PK)
  name: String (e.g., "Istirahat ke-1 (10:00-10:30)")
  startTime: String
  endTime: String
  active: Boolean
}

Place {
  id: String (PK)
  name: String (e.g., "Ruang BK 1", "Online")
  active: Boolean
}

// Chat Messages
Chat {
  id: String (PK)
  consultationId: String (FK)
  senderId: String (FK to User or Student)
  senderType: Enum ['COUNSELOR', 'STUDENT']
  message: Text
  read: Boolean
  readAt: DateTime
  createdAt: DateTime
}
```

## 🎨 UI/UX REQUIREMENTS

### Design System
- **Color Palette**: Purple/Violet primary (#7C3AED, #8B5CF6), Green success (#10B981), Red danger (#EF4444)
- **Typography**: Inter/Poppins font family
- **Components**: Rounded corners (lg/xl), soft shadows, gradient backgrounds
- **Tone**: Welcoming, safe, supportive (not bureaucratic)

### Key Pages & Components

#### PUBLIC PAGES

**1. Landing Page (/)**
- Hero section with "Selamat datang di SafeSpace"
- Value proposition (Aman, Privat, Fleksibel)
- Stats cards (Total Consultations, Pending, Accepted)
- CTA Buttons: "Mulai Konsultasi" + "Lihat Berita"
- WhatsApp quick chat button
- Clean, purple gradient design

**2. News Feed (/news)**
- Grid/list of published news
- Card with image, title, author, date
- Search & filter
- Click to detail page

**3. News Detail (/news/[slug])**
- Full article with image
- Author name (which counselor wrote it)
- Published date
- Back button

#### STUDENT FLOW (Guest)

**4. Choose Counselor (/pilih-guru)**
- Grid of counselor cards
- Photo, name, specialization
- "Pilih" button → redirects to form

**5. Counseling Form (/konsultasi/baru)**
Multi-step or single page form:
- **Data Diri Section:**
  - Nama Lengkap (text)
  - Kelas (dropdown - DYNAMIC from SchoolClass table)
  - Jenis Kelamin (radio: Laki-laki/Perempuan)
  - Nomor WhatsApp (text, +62 format validation)

- **Detail Konsultasi Section:**
  - Metode (radio: Pribadi/Kelompok)
  - Topik Masalah (dropdown - DYNAMIC from Topic table)
  - Tanggal (date picker calendar)
  - Waktu (dropdown - DYNAMIC from TimeSlot table)
  - Tempat (dropdown - DYNAMIC from Place table)

- **Actions:**
  - Submit button → Show success popup "Terima kasih, tunggu konfirmasi"
  - Kembali button → back to landing

**6. Tracking Page (/tracking/[code])**
- Show consultation status
- Status badge: Pending (yellow) / Accepted (green) / Rejected (red)
- Consultation details
- If Accepted: Show WhatsApp button to contact counselor
- If Rejected: Show message (optional reason)

#### COUNSELOR DASHBOARD (Protected)

**7. Login (/bk/login)**
- Email + password form
- Forgot password link
- Secure authentication

**8. Dashboard (/bk/dashboard)**
- **Stats Cards (4 cards):**
  - Total Konsultasi
  - Menunggu Persetujuan
  - Disetujui
  - Ditolak

- **Charts:**
  - Pie chart: Status distribution
  - Bar chart: Top topics this month
  - Line chart: Consultations over time

- **Recent Activity:**
  - Latest 5 pending requests with quick actions

**9. Consultation Management (/bk/konsultasi)**
- **Table View with:**
  - Columns: ID, Nama, Kelas, Gender, No. WA, Metode, Topik, Tanggal, Waktu, Status
  - Filter by: Status, Date range, Class, Topic
  - Search by name
  
- **Row Actions:**
  - If PENDING: "Terima" (green) + "Tolak" (red) buttons
    - Terima → Update status to ACCEPTED, show WhatsApp button
    - Tolak → Update status to REJECTED
  - If ACCEPTED: "WhatsApp" button (direct link to wa.me/number)
  - If REJECTED: View only

- **Bulk Actions:**
  - Export Excel button
  - Export CSV button

**10. Consultation Detail (/bk/konsultasi/[id])**
- Full student information
- Consultation details
- **Session Notes Section:**
  - Add/edit notes per session
  - Date/time of each session
  - Progress tracking
  - Upload attachments (optional)

**11. News Management (/bk/berita)**
- **List Page:**
  - Table of all news (published/draft)
  - Views counter
  - Edit/Delete buttons
  
- **Create/Edit Page:**
  - Judul Berita (text input)
  - Isi Berita (textarea or rich text editor)
  - Upload Gambar (file input, JPG/PNG/GIF, max 2MB)
  - Penulis (auto-filled from logged-in user)
  - Checkbox "Publikasikan berita"
  - Save button → Success popup

**12. Data Master Management (/bk/data-master)**
Four sub-sections:
- **Kelas:** CRUD for SchoolClass
- **Topik:** CRUD for Topic (with icon/color picker)
- **Waktu:** CRUD for TimeSlot
- **Tempat:** CRUD for Place
Each with simple table + add/edit modal

**13. Profile Settings (/bk/profil)**
- Edit name, phone, specialization
- Upload photo
- Change password

#### SUPER ADMIN (Protected)

**14. Admin Dashboard (/admin/dashboard)**
- Global statistics (all counselors combined)
- System health metrics
- User activity overview

**15. User Management (/admin/users)**
- Manage counselor accounts (CRUD)
- Reset passwords
- Activate/deactivate accounts
- Import students from Excel

**16. System Monitoring (/admin/monitoring)**
- Audit logs (who accessed what when)
- Data isolation verification
- Storage usage
- Backup/restore interface

## 🔐 SECURITY REQUIREMENTS

### Critical: Data Isolation
```typescript
// EVERY query for consultations MUST include:
// For Counselor:
const consultations = await db.consultation.findMany({
  where: {
    counselorId: currentUser.id, // ← AUTO-FILTERED
  }
})

// For Admin:
const consultations = await db.consultation.findMany({
  // No filter - see all
})

// Middleware/Guard to enforce this
```

### Additional Security
- Password hashing (bcrypt)
- JWT tokens for auth
- Rate limiting on API endpoints
- Input validation & sanitization
- XSS protection
- CSRF tokens
- HTTPS only
- Secure file upload (validate type/size)
- Phone number validation (+62 format)

## 🚀 API ENDPOINTS STRUCTURE

### Public Routes
```
GET  /api/news                    - List published news
GET  /api/news/[slug]             - News detail
GET  /api/counselors              - List active counselors
POST /api/consultations           - Submit new request (guest)
GET  /api/consultations/[code]    - Track status (guest)
```

### Counselor Routes (Protected)
```
GET  /api/bk/dashboard/stats      - Dashboard statistics
GET  /api/bk/consultations        - List (filtered by counselorId)
GET  /api/bk/consultations/[id]   - Detail
PATCH /api/bk/consultations/[id]/accept - Accept request
PATCH /api/bk/consultations/[id]/reject - Reject request
POST /api/bk/consultations/[id]/notes   - Add session notes

GET  /api/bk/news                 - List own news
POST /api/bk/news                 - Create news
PUT  /api/bk/news/[id]            - Update news
DELETE /api/bk/news/[id]          - Delete news

GET  /api/bk/data-master/classes  - CRUD for all dropdowns
POST /api/bk/data-master/classes
PUT  /api/bk/data-master/classes/[id]
DELETE /api/bk/data-master/classes/[id]

GET  /api/bk/profile
PUT  /api/bk/profile
```

### Admin Routes (Protected)
```
GET  /api/admin/dashboard
GET  /api/admin/users
POST /api/admin/users             - Create counselor
PUT  /api/admin/users/[id]
DELETE /api/admin/users/[id]
GET  /api/admin/audit-logs
POST /api/admin/backup
POST /api/admin/restore
```

## 📱 REAL-TIME FEATURES
- Live notifications for new submissions (counselor dashboard)
- Real-time chat between student and counselor
- Status updates (when counselor accepts/rejects)

## 📄 EXPORT FEATURES
- Export consultations to Excel (xlsx)
- Export to CSV
- Include filters in export
- Generate PDF reports (optional)

## 🔔 NOTIFICATIONS
- Email to student when request accepted/rejected
- In-app notifications for counselors (new request)
- WhatsApp integration (direct link, not API)

## 🎯 MVP PRIORITIES (Phase 1)

**Must Have:**
1. ✅ Landing page with stats
2. ✅ Guest form submission
3. ✅ Counselor dashboard with data isolation
4. ✅ Accept/Reject workflow
5. ✅ WhatsApp button
6. ✅ News CRUD (counselor)
7. ✅ News feed (public)
8. ✅ Dynamic dropdowns management
9. ✅ Export to Excel
10. ✅ Tracking page

**Phase 2:**
- Real-time chat
- Session notes
- Advanced analytics
- Email notifications
- Mobile app

## 📝 DEVELOPMENT INSTRUCTIONS

1. **Setup Phase:**
   - Initialize project with chosen stack
   - Setup database & run migrations
   - Configure authentication
   - Setup environment variables

2. **Core Features:**
   - Build public landing page
   - Implement guest form submission
   - Create counselor dashboard with isolation
   - Build accept/reject workflow

3. **Secondary Features:**
   - News system
   - Data master management
   - Export functionality

4. **Polish:**
   - Add charts/statistics
   - Implement tracking page
   - Add validations
   - Error handling
   - Loading states

5. **Testing:**
   - Test data isolation thoroughly
   - Test guest flow
   - Test counselor workflow
   - Security audit

## 🎨 UI REFERENCES
- Use purple/violet gradient theme
- Rounded cards with soft shadows
- Clean, modern, friendly design
- Reference: "Bundaku.ID" concept but branded as "SafeSpace"
- Mobile-responsive design

## ⚠️ CRITICAL REMINDERS
1. **Data Isolation is NON-NEGOTIABLE** - Counselors MUST only see their own students
2. **Guest access must work WITHOUT login** - No authentication required for students
3. **Dynamic dropdowns** - All options managed by counselors, not hardcoded
4. **WhatsApp integration** - Use wa.me links, not WhatsApp Business API (for simplicity)
5. **Privacy-first design** - Student data protected at all costs
6. **Simple UX** - Students should complete form in < 3 minutes

## 📦 DELIVERABLES
- Full source code
- Database schema & migrations
- Environment variables template (.env.example)
- README with setup instructions
- Deployment guide (Vercel/Railway/Heroku)
- API documentation

---

**START BY:**
1. Setting up the project structure
2. Creating the database schema
3. Implementing authentication for counselors
4. Building the landing page
5. Creating the guest submission form

Build this step by step, starting with the MVP features. After each major component, test thoroughly before moving to the next.
