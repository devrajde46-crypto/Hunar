# AI Vocational Skills Trainer

An intelligent, interactive learning platform designed to train vocational skills with an AI-assisted curriculum, practice sessions, and skill assessments.

## Tech Stack

- **Backend**:
  - Python 3.12
  - Django 6.1 & Django REST Framework (DRF)
  - JWT Authentication (`djangorestframework-simplejwt`)
  - API Documentation (`drf-spectacular`)
  - PostgreSQL (`psycopg2-binary`)
  - Celery & Redis
  - `django-cors-headers`
- **Frontend**:
  - Next.js 16 (App Router)
  - React 19
  - TypeScript
  - Tailwind CSS 4
  - Axios
- **Database**: PostgreSQL 16+
- **Platform**: Windows PowerShell

---

## Folder Structure

```
vocational-trainer/
├── .gitignore
├── README.md
├── backend/
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   ├── manage.py
│   ├── requirements.txt
│   ├── config/              # Django project settings, URLs, WSGI/ASGI
│   ├── accounts/            # User management, authentication, profiles
│   ├── courses/             # Course catalog and modules
│   ├── practice/            # Hands-on practice modules and scenarios
│   ├── assessments/         # Skill testing, evaluations, and grading
│   ├── analytics/           # Learner progress tracking and reporting
│   └── venv/                # Python virtual environment (gitignored)
└── frontend/
    ├── .env.local
    ├── .env.example
    ├── .gitignore
    ├── package.json
    ├── tsconfig.json
    ├── next.config.ts
    ├── app/                 # Next.js App Router (pages and layouts)
    ├── public/              # Static media assets
    └── node_modules/        # Frontend dependencies (gitignored)
```

---

## Getting Started (Windows PowerShell)

### Prerequisites
- Python 3.12+
- Node.js 20+ & npm
- PostgreSQL running locally with database `vtrainer`

---

### Backend Setup & Run

1. Open a PowerShell terminal and navigate to the backend directory:
   ```powershell
   cd C:\dev\vocational-trainer\backend
   ```

2. Create and activate the virtual environment:
   ```powershell
   python -m venv venv
   .\venv\Scripts\Activate.ps1
   ```

3. Install dependencies:
   ```powershell
   python -m pip install -r requirements.txt
   ```

4. Configure environment variables:
   Copy `.env.example` to `.env` and fill in your database credentials:
   ```powershell
   Copy-Item .env.example .env
   ```

5. Run system checks and database migrations:
   ```powershell
   python manage.py check
   python manage.py migrate
   ```

6. Start the backend development server:
   ```powershell
   python manage.py runserver 127.0.0.1:8000
   ```
   The backend API will be available at `http://127.0.0.1:8000/`.  
   Health check endpoint: `http://127.0.0.1:8000/api/health/`

---

### Frontend Setup & Run

1. Open a new PowerShell terminal and navigate to the frontend directory:
   ```powershell
   cd C:\dev\vocational-trainer\frontend
   ```

2. Install dependencies:
   ```powershell
   npm install
   ```

3. Configure environment variables:
   Copy `.env.example` to `.env.local`:
   ```powershell
   Copy-Item .env.example .env.local
   ```
   Ensure `NEXT_PUBLIC_API_URL=http://127.0.0.1:8000` is set.

4. Start the Next.js development server:
   ```powershell
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.
