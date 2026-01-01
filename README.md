# Digital-Maintainance-Tracker-for-Apartments-Buildings-
# 🛠️ Digital Maintenance Tracker  
### Admin Module – Apartment / Building Management System

---

## 📌 Project Description
The **Digital Maintenance Tracker** is a full-stack web application developed to manage maintenance activities in apartments or buildings efficiently.  
This system digitizes the traditional maintenance request process by allowing structured tracking, technician assignment, and status monitoring.

This repository focuses **only on the Admin Module**, which acts as the control center of the system.

---

## 🎯 Objective
To design and implement a **professional Admin Dashboard** that enables administrators to:
- Monitor all maintenance requests
- Assign technicians to pending issues
- Track request status lifecycle
- View basic analytics
- Ensure smooth workflow management

---

## 👤 User Roles Overview
| Role | Description |
|----|------------|
| Resident | Raises maintenance requests and tracks status |
| Technician | Handles assigned maintenance jobs |
| **Admin** | Assigns technicians, manages requests, views analytics |

> 🔎 **Note:** Only the **Admin Module** is implemented in this project.

---

## ✅ Admin Module – Functional Scope

### 1️⃣ Dashboard Analytics
- Total maintenance requests
- New requests
- Assigned requests
- Visual summary cards for quick insights

### 2️⃣ Maintenance Request Management
- View all maintenance requests in a table
- Display request details:
  - ID
  - Category
  - Description
  - Assigned technician
  - Current status

### 3️⃣ Technician Assignment
- Admin selects technician from dropdown
- Assign button enabled only when technician is selected
- Confirmation popup before assignment
- Status updates automatically to **Assigned**

### 4️⃣ Status Tracking
Maintenance request lifecycle:
New → Assigned → Resolved
- Color-coded status chips for clarity

### 5️⃣ Secure Logout
- Clears local and session storage
- Redirects to home page

---

## 🎨 User Interface Highlights
- Angular Material UI
- Side navigation panel
- Responsive dashboard layout
- Professional cards, tables, and chips
- Clean typography and spacing

---

## 🧰 Technology Stack

### Frontend
- Angular 16+
- Angular Material
- TypeScript
- Standalone Components

### Backend
- Node.js
- Express.js
- TypeScript

### Database
- MySQL

---

## 🗄️ Database Design

### Users Table
| Column | Description |
|------|------------|
| id | Primary Key |
| name | User name |
| role | Resident / Technician / Admin |
| contact_info | Phone or email |
| created_at | Timestamp |

### Requests Table
| Column | Description |
|------|------------|
| id | Primary Key |
| resident_id | FK → Users |
| technician_id | FK → Users (nullable) |
| category | Plumbing / Electrical / Painting / Other |
| description | Problem description |
| media | Optional image/video |
| status | New / Assigned / Resolved |
| feedback_rating | Optional |
| created_at | Timestamp |

---

## 🌐 Backend API Endpoints (Admin)

| Method | Endpoint | Description |
|------|---------|------------|
| GET | `/admin/requests` | Fetch all maintenance requests |
| GET | `/admin/technicians` | Fetch technician list |
| PUT | `/admin/assign` | Assign technician |
| PUT | `/admin/status` | Update request status |

---

## 🔐 Validation & Error Handling
- Category and description are mandatory
- Technician assignment only allowed for new requests
- Status follows valid flow
- Backend validation with proper error messages
- UI handles errors gracefully

---

## 🧭 Routing (Admin)

| Route | Component |
|-----|----------|
| `/admin/dashboard` | AdminDashboardComponent |

---

## 🚀 How to Run the Project

### Backend Setup
```bash
cd backend
npm install
npm run dev

---

### frontend Setup
```bash
cd frontend/admin-frontend
npm install
ng serve

Open browser:
http://localhost:4200/admin/dashboard

---


##  📈 Optional Enhancements Implemented

1.Disable assign button until technician selected
2.Confirmation dialog before assignment
3.Status color coding
4.Clean admin navigation panel

🔮 Future Enhancements

Authentication & role-based guards
Resident module
Technician module
Feedback analytics
Charts and reports
Notification system