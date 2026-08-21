# AmiSphere – Alumni Management Portal

A full-stack web-based Alumni Management Portal designed to centralize alumni records, reduce manual administrative work, and enable alumni to independently maintain their professional information.

AmiSphere provides separate **Admin and Alumni portals** with role-based access, secure authentication, centralized profile management, alumni directory, dashboard analytics, and bulk data management.

---

## 📌 Overview

Educational institutions often maintain alumni information using spreadsheets, separate databases, or manually updated records. As alumni change their jobs, organizations, skills, locations, and contact information, keeping these records updated becomes increasingly difficult.

**AmiSphere** addresses this problem by providing a centralized platform where administrators can efficiently manage alumni records while alumni can securely maintain their own professional profiles.

The system follows a **client-server architecture** with a React frontend, Node.js/Express backend, Prisma ORM, and PostgreSQL database.

---

## 🎯 Problem Statement

Traditional alumni management approaches face several challenges:

* Alumni information is scattered across multiple files and platforms.
* Manual data maintenance is time-consuming.
* Alumni records become outdated as professional information changes.
* Searching and filtering large alumni datasets is inefficient.
* Administrators cannot continuously track every alumnus.
* Alumni often have no dedicated platform to update their own information.

AmiSphere addresses these challenges through **centralized data management combined with alumni self-service**.

---

## 💡 Key Objectives

* Centralize alumni information in a structured database.
* Reduce dependency on spreadsheets and manual record maintenance.
* Allow alumni to independently update their professional profiles.
* Provide administrators with efficient record management tools.
* Implement secure authentication and role-based access control.
* Improve alumni discoverability and networking.
* Provide a scalable foundation for future alumni engagement features.

---

## ✨ Key Features

### 👨‍💼 Admin Portal

* Admin authentication
* Admin dashboard
* Alumni statistics and analytics
* Add new alumni records
* Edit existing alumni records
* Delete alumni records
* Search and filter alumni
* Alumni directory
* Bulk alumni upload using CSV/XLSX
* View detailed alumni profiles
* Manage centralized alumni information

### 🎓 Alumni Portal

* Alumni registration
* Secure alumni login
* Personalized alumni dashboard
* Profile completion tracking
* View personal profile
* Edit personal information
* Update academic information
* Update employment details
* Add technical skills
* Add LinkedIn/professional links
* Higher studies information
* Government examination information
* Alumni directory/network

### 🔐 Authentication & Authorization

* JWT-based authentication
* Password hashing using bcrypt
* Role-based access control
* Protected routes
* Separate Admin and Alumni permissions
* Secure API access

---

## 🏗️ System Architecture

```text
                    ┌──────────────────────┐
                    │      End Users       │
                    │ Admin / Alumni       │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   React Frontend     │
                    │ Tailwind CSS + Vite  │
                    └──────────┬───────────┘
                               │
                         REST API / Axios
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Node.js + Express.js │
                    │ Authentication/API   │
                    └──────────┬───────────┘
                               │
                          Prisma ORM
                               │
                               ▼
                    ┌──────────────────────┐
                    │     PostgreSQL       │
                    │      Supabase        │
                    └──────────────────────┘
```

---

## 🛠️ Technology Stack

### Frontend

* React.js
* JavaScript (ES6+)
* HTML5
* CSS3
* Tailwind CSS
* React Router DOM
* Axios
* React Context API
* Vite

### Backend

* Node.js
* Express.js
* REST APIs
* JWT Authentication
* bcrypt.js
* CORS
* dotenv

### Database

* PostgreSQL
* Prisma ORM
* Supabase

### Development & Deployment

* Git
* GitHub
* Render
* Netlify / Vercel

---

## 🔄 Application Workflow

### Admin Workflow

```text
Admin Login
     ↓
JWT Authentication
     ↓
Admin Dashboard
     ↓
Manage Alumni
     ↓
Add / Edit / Delete / Search
     ↓
Database
```

### Alumni Workflow

```text
Alumni Registration
        ↓
Alumni Login
        ↓
JWT Authentication
        ↓
Alumni Dashboard
        ↓
View / Edit Profile
        ↓
Professional Information
        ↓
Centralized Database
```

---

## 🔐 Authentication Flow

1. User enters email and password.
2. Frontend sends credentials to the backend through Axios.
3. Express.js receives the authentication request.
4. Backend verifies the user credentials.
5. Password is validated using bcrypt.
6. A JWT is generated after successful authentication.
7. JWT and user information are returned to the frontend.
8. Protected routes use the authentication state and user role.
9. The JWT is attached to subsequent API requests.
10. Backend validates the token before allowing protected operations.

---

## 🗄️ Database

AmiSphere uses **PostgreSQL** as its relational database, hosted through **Supabase**.

The database stores structured information related to:

* User accounts
* Authentication
* Alumni profiles
* Academic information
* Employment details
* Skills
* Professional links
* Profile information

**Prisma ORM** is used as the database access layer between the Node.js backend and PostgreSQL.

---

## 📂 Project Structure

```text
AmiSphere/
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── constants/
│   │   ├── context/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── config/
│   ├── middleware/
│   ├── routes/
│   ├── controllers/
│   ├── prisma/
│   ├── app.js
│   ├── server.js
│   └── package.json
│
└── README.md
```
---

## 🔑 Environment Variables

### Frontend

| Variable       | Description          |
| -------------- | -------------------- |
| `VITE_API_URL` | Backend API base URL |

### Backend

| Variable       | Description                           |
| -------------- | ------------------------------------- |
| `PORT`         | Port on which the backend runs        |
| `DATABASE_URL` | PostgreSQL/Supabase connection string |
| `JWT_SECRET`   | Secret used to sign JWT tokens        |
| `CLIENT_URL`   | Allowed frontend origin(s)            |
| `NODE_ENV`     | Application environment               |

**Never commit `.env` files or database credentials to GitHub.**

---

# 📡 API Overview

The backend exposes REST APIs for authentication, alumni management, and data uploads.

### Authentication

```text
POST /api/auth/login
GET  /api/auth/me
```

### Alumni Management

```text
GET    /api/alumni
GET    /api/alumni/:id
POST   /api/alumni
PUT    /api/alumni/:id
DELETE /api/alumni/:id
GET    /api/alumni/stats
```

### Upload

```text
POST /api/upload
```

> API endpoints may vary depending on the current backend implementation.

---

# ☁️ Deployment

AmiSphere follows a separated deployment architecture:

```text
React Frontend
      │
      │
      ▼
Netlify / Vercel
      │
      │ REST API
      ▼
Node.js + Express Backend
      │
      ▼
Render
      │
      ▼
Prisma
      │
      ▼
PostgreSQL
      │
      ▼
Supabase
```

### Frontend

The React application can be deployed using:

* Netlify
* Vercel

### Backend

The Node.js/Express API is deployed using:

* Render

### Database

The PostgreSQL database is hosted using:

* Supabase

---

# 📊 Benefits

AmiSphere provides several improvements over traditional spreadsheet-based alumni management:

* **Centralized Data** – Alumni information is maintained in one structured system.
* **Reduced Manual Work** – Administrators can manage records through a dedicated dashboard.
* **Self-Service Updates** – Alumni can independently maintain their professional information.
* **Improved Accessibility** – Authorized users can access information through a web interface.
* **Better Data Organization** – Structured relational storage improves consistency and retrieval.
* **Role-Based Security** – Admin and Alumni users have separate permissions.
* **Scalable Architecture** – The application can be extended with additional alumni engagement features.

---

# 🔮 Future Enhancements

Potential future improvements include:

* Alumni-to-alumni messaging
* Mentorship programs
* Job and internship opportunities
* Alumni event management
* Email and notification system
* Advanced analytics and reporting
* Alumni achievements and recognition
* LinkedIn integration
* Mobile application
* AI-powered alumni networking and recommendations
* University-wide deployment

---

# 🎯 Project Impact

AmiSphere transforms traditional alumni record management into a centralized digital platform by combining **administrative control with alumni self-service**.

Instead of relying entirely on administrators to maintain alumni information, graduates can directly update their professional profiles while administrators retain control over institutional records.

This reduces manual maintenance, improves data freshness, and creates a stronger foundation for long-term alumni engagement.

---

# 👨‍💻 Author

**Vaivasvat Mathur**

B.Tech Information Technology (2024-2028)
Amity University, Noida

---

## 📄 License

This project is developed for academic and educational purposes.
