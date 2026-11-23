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

---

## Phase 2: Core Backend

Phase 2 establishes the core Django backend foundation, including custom institutional user models, JWT authentication with token rotation and blacklisting, RBAC permissions, course content management APIs, automated test suites, and idempotent demo data seeding.

### 1. Django Applications Overview

- **`accounts`**: Custom user identity management (`User`), multi-tenant institution scoping (`Institution`), JWT authentication endpoints, and learner biometric consent records (`ConsentRecord`). Built-in roles: `LEARNER`, `TRAINER`, and `INSTITUTION_ADMIN`.
- **`courses`**: Vocational curriculum hierarchy including Trades (`Trade`), Modules (`Module`), standardized Procedures (`Procedure`), and granular procedure steps (`ProcedureStep`).
- **`practice`**: Practice submission management (`PracticeSubmission`), tracking uploaded video artifacts, processing states (`uploaded`, `processing`, `scored`, `reviewed`), and overall AI verdicts (`pass`, `needs_review`, `fail`).
- **`assessments`**: Granular per-step AI evaluation scores (`StepScore`) and instructor human-in-the-loop review overrides (`TrainerReview`).
- **`analytics`**: Reserved for Phase 4+ aggregation, telemetry, and learner competency tracking.

### 2. Authentication & Security Architecture

- **Token Lifetime**: 15-minute short-lived access tokens and 7-day refresh tokens via `djangorestframework-simplejwt`.
- **Token Rotation & Blacklisting**: Refresh token rotation is enforced (`ROTATE_REFRESH_TOKENS=True`). Upon rotation or explicit logout via `/api/v1/auth/logout/`, old refresh tokens are permanently blacklisted via `rest_framework_simplejwt.token_blacklist`.
- **Privilege Escalation Prevention**: Client-supplied role parameters during registration are ignored; all self-registered accounts are strictly initialized as `LEARNER`.
- **Anti-Enumeration Protections**: Registration attempts with duplicate email addresses return a generic error message, preventing user email enumeration.
- **Tenant & Institution Isolation**: Trainers and Learners are strictly scoped to their assigned `institution_id`. Cross-institution content access is blocked (`HTTP 404` on retrieval/update, `HTTP 403` on creation under another institution's hierarchy).

### 3. Core API Endpoints

| Category | Method | Endpoint | Description | Access |
|---|---|---|---|---|
| **Auth** | `POST` | `/api/v1/auth/register/` | Register new learner account with consent | Public |
| **Auth** | `POST` | `/api/v1/auth/login/` | Authenticate and obtain JWT access & refresh tokens | Public |
| **Auth** | `POST` | `/api/v1/auth/token/refresh/` | Rotate refresh token and obtain new access token | Authenticated |
| **Auth** | `POST` | `/api/v1/auth/logout/` | Blacklist active refresh token | Authenticated |
| **Auth** | `GET` | `/api/v1/auth/me/` | Retrieve authenticated user profile | Authenticated |
| **Courses** | `GET`, `POST` | `/api/v1/courses/trades/` | List or create institutional trades | Authenticated (Write: Trainer/Admin) |
| **Courses** | `GET`, `PUT`, `PATCH`, `DELETE` | `/api/v1/courses/trades/{id}/` | Trade details, update, or soft-delete | Authenticated (Write: Trainer/Admin) |
| **Courses** | `GET`, `POST` | `/api/v1/courses/modules/` | List or create curriculum modules | Authenticated (Write: Trainer/Admin) |
| **Courses** | `GET`, `PUT`, `PATCH`, `DELETE` | `/api/v1/courses/modules/{id}/` | Module details, update, or soft-delete | Authenticated (Write: Trainer/Admin) |
| **Courses** | `GET`, `POST` | `/api/v1/courses/procedures/` | List or create standardized procedures | Authenticated (Write: Trainer/Admin) |
| **Courses** | `GET`, `PUT`, `PATCH`, `DELETE` | `/api/v1/courses/procedures/{code_or_id}/` | Procedure details, update, or soft-delete | Authenticated (Write: Trainer/Admin) |
| **Courses** | `GET`, `POST` | `/api/v1/courses/steps/` | List or create procedure steps | Authenticated (Write: Trainer/Admin) |
| **Courses** | `GET`, `PUT`, `PATCH`, `DELETE` | `/api/v1/courses/steps/{id}/` | Step details, update, or delete | Authenticated (Write: Trainer/Admin) |
| **System** | `GET` | `/api/health/` | Service health check | Public |
| **Docs** | `GET` | `/api/schema/` | OpenAPI 3.0 schema | Public |
| **Docs** | `GET` | `/api/docs/` | Swagger UI interactive documentation | Public |
| **Docs** | `GET` | `/api/redoc/` | ReDoc interactive documentation | Public |

### 4. Step-Deletion Behavior & Risk Analysis

The endpoint `DELETE /api/v1/courses/steps/{id}/` handles step deletion with two distinct behaviors depending on historical data dependencies:
- **When Step Scores Exist (`409 Conflict`)**: The `StepScore.procedure_step` foreign key specifies `on_delete=models.PROTECT`. If an instructor attempts to delete a step that has already been evaluated in learner submissions, Django raises a `models.ProtectedError`. The custom exception handler intercepts this and returns `HTTP 409 Conflict` with error code `PROTECTED_RESOURCE`. This prevents accidental loss of historical scoring evidence and prevents orphaned score records.
- **When No Scores Exist (`204 No Content - Hard Delete`)**: Because `ProcedureStep` does not define an `is_active` soft-delete field in the schema, calling `DELETE` executes a physical `instance.delete()`, permanently removing the record from the database.
- **Identified Risk**: Any draft step deleted prior to assessment recording is permanently lost and cannot be restored via a soft-delete restore flag. If auditing or soft-deletion of steps is required in future releases, an `is_active` boolean field should be added to `ProcedureStep`.

### 5. Running Automated Tests

Run the full Django test suite covering models, authentication, JWT token rotation/blacklisting, permissions, course APIs, deletion mechanics, and idempotency:

```powershell
cd C:\dev\vocational-trainer\backend
.\venv\Scripts\Activate.ps1
python manage.py test
```

### 6. Seeding Demo Data

To populate the database with Demo ITI, Electrical Wiring trade, Domestic Wiring module, and 4 standardized electrical procedures with 39 safety-annotated steps (from `docs/phase1/procedures/`):

```powershell
python manage.py seed_demo
```

This command is strictly idempotent (`update_or_create`) and can be safely executed multiple times.

> [!IMPORTANT]
> **Manual Superuser Creation**: In accordance with security guidelines, `seed_demo` does not create any administrative user accounts or default passwords. To create an administrator account, run:
> ```powershell
> python manage.py createsuperuser
> ```

