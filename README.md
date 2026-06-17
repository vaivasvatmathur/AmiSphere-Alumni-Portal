# AmiSphere

AmiSphere is a complete internal admin portal for the Department of Information Technology, ASET, Amity University, Noida to maintain alumni records. Alumni do not log in, sign up, chat, or access the system. The portal is intentionally focused on department administration: CRUD records, filtering, search, bulk upload, and export.

## Folder Structure

```text
Alumni/
  backend/
    src/
      config/
      controllers/
      middleware/
      models/
      routes/
      services/
      utils/
    uploads/
    .env.example
    package.json
  frontend/
    src/
      api/
      components/
      context/
      layouts/
      pages/
      routes/
    .env.example
    package.json
    tailwind.config.js
    vite.config.js
  examples/
    alumni-upload-template.csv
  README.md
```

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, React Router DOM, Axios
- Backend: Node.js, Express.js
- Database: MongoDB Atlas with Mongoose
- Auth: Single admin login with JWT
- Uploads: CSV and XLSX via Multer and `xlsx`

## Local Setup

1. Install dependencies:

```bash
npm run install:all
```

2. Configure backend:

```bash
cp backend/.env.example backend/.env
```

Set:

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/alumni_portal
JWT_SECRET=replace_with_a_long_random_secret
ADMIN_EMAIL=admin@department.edu
ADMIN_PASSWORD=ChangeThisStrongPassword123
CLIENT_URL=http://localhost:5173
```

3. Configure frontend:

```bash
cp frontend/.env.example frontend/.env
```

Set:

```env
VITE_API_URL=http://localhost:5000/api
```

4. Start both apps in separate terminals:

```bash
npm run dev:backend
npm run dev:frontend
```

Frontend runs on `http://localhost:5173`. Backend runs on `http://localhost:5000`.

## API Overview

All alumni routes require a bearer JWT from `POST /api/auth/login`.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/api/auth/login` | Admin login |
| GET | `/api/auth/me` | Current admin profile |
| GET | `/api/alumni` | Paginated search and filter |
| POST | `/api/alumni` | Create alumni |
| GET | `/api/alumni/:id` | Alumni details |
| PUT | `/api/alumni/:id` | Update alumni |
| DELETE | `/api/alumni/:id` | Delete alumni |
| GET | `/api/alumni/filters` | Distinct filter options |
| GET | `/api/alumni/stats` | Dashboard stats |
| POST | `/api/upload/alumni` | Bulk upload CSV/XLSX |

Search supports name, enrollment number, company, skills, and email. Filters support batch, course, skills, profession/job role, company, and current position.

## Alumni Schema

```js
{
  photo: String,
  fullName: String,
  enrollmentNumber: String,
  batch: String,
  course: "B.Tech IT" | "B.Tech CSBS" | "B.Tech CSSS",
  phone: String,
  email: String,
  company: String,
  position: String,
  skills: [String],
  linkedinUrl: String,
  timestamps: true
}
```

The schema includes validation and indexes for search/filter fields.

## CSV/XLSX Upload Format

Use `examples/alumni-upload-template.csv` as the recommended format.

Required fields:

- `fullName`
- `enrollmentNumber`
- `batch`
- `course`
- `email`

Optional fields:

- `photo`
- `phone`
- `company`
- `position`
- `skills`
- `linkedinUrl`

Skills can be comma-separated or semicolon-separated. Invalid rows are skipped safely and returned with row-level reasons.

## Deployment

### Backend on Render

1. Create a new Web Service.
2. Set root directory to `backend`.
3. Build command:

```bash
npm install
```

4. Start command:

```bash
npm start
```

5. Add environment variables from `backend/.env.example`.
6. Set `CLIENT_URL` to your Vercel frontend URL.

### Frontend on Vercel

1. Import the repository.
2. Set root directory to `frontend`.
3. Build command:

```bash
npm run build
```

4. Output directory:

```bash
dist
```

5. Add:

```env
VITE_API_URL=https://your-render-service.onrender.com/api
```

## Notes

- This is an internal admin dashboard only.
- There is no alumni login, signup, social feed, chat, messaging, notifications, or AI functionality.
- For production, use a long random `JWT_SECRET` and a strong `ADMIN_PASSWORD`. The backend also accepts a bcrypt hash as `ADMIN_PASSWORD`.
