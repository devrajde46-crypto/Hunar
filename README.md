# Hunar

Hunar: practice, feedback, and trainer review for vocational skills.

## What Hunar Is

Hunar is an asynchronous skills evaluation and training platform designed for vocational trainees and instructors in technical institutions. It combines guided workbench practice, structured AI-assisted feedback, and human instructor moderation to help learners master hands-on technical crafts. The system starts with basic domestic electrical wiring, helping trainees practice safety-critical procedures and verify their work before live circuit energization.

---

## Important Notes

> [!WARNING]
> **Electrical Procedures Are Drafts:** The electrical wiring procedures included in this repository are **preliminary drafts** that have not yet been validated or endorsed by a certified vocational electrical instructor. They must **never** be used as real-world instructional guides or live electrical installation manuals. All physical wiring and circuit testing must strictly take place under the direct physical supervision of a qualified vocational trainer in accordance with institutional workshop safety rules.

> [!IMPORTANT]
> **Consent Policy Requires Legal Review:** The video recording, biometric likeness, and data privacy consent documentation in this project (`docs/phase1/consent-and-privacy.md`) is a template framework. It must undergo formal review and adaptation by qualified institutional legal counsel and data protection officers before use with real students.

---

## Project Status

| Phase | Description | Status | Scope & Deliverables |
| :--- | :--- | :---: | :--- |
| **Phase 0** | **Environment Setup** | **Done** | Local Windows/PowerShell development workspace, Django 6.1 backend, Next.js 16 frontend, PostgreSQL, and baseline health checks. |
| **Phase 1** | **Scope, Design & Data Plan** | **Done** | Core trade definition (`PROC-ELEC-01` to `04`), filming guidelines, consent policy, data acquisition plan, and foundational architecture specs. |
| **Phase 2** | **Core Backend & Security** | **Done** | Relational models, SimpleJWT authentication with token rotation/blacklisting, RBAC permissions, course APIs, and idempotent demo data seeding. |
| **Phase 3** | **Frontend UI & Stitch Screens** | **Done** | Next.js 16 App Router interface, cookie-based session synchronization, dynamic procedure catalog wired to API, and accessible design system. |
| **Phase 4** | **Video Processing Pipeline** | **Partly done** | **4A–4B done** (Redis/Celery infrastructure configuration, media storage rules, secure chunked upload API with MP4/MOV validation, and Range-supported video playback); **4C–4F planned** (FFmpeg keyframe extraction, audio analysis, Celery async pipeline). |
| **Phase 5** | **AI Assessment Engine** | **Planned** | MediaPipe operator stance/hold verification, YOLO component/wire detection, multimeter OCR, and deterministic rule-based safety scoring. |
| **Phase 6** | **Trainer Review & Analytics** | **Planned** | Instructor review workbench, manual score overrides, cohort accuracy metrics, and institutional audit export. |
| **Phase 7** | **Pilot Testing & Deployment** | **Planned** | Workshop pilot trials at partner Industrial Training Institutes (ITIs) and polytechnics. |
| **Phase 8** | **Multi-Trade Expansion** | **Planned** | Expanding verification pipelines beyond electrical wiring into welding, plumbing, and automotive trades. |

> [!NOTE]
> **Current Prototype State & Preview Screens:**  
> Automated AI scoring and computer vision inference are **NOT implemented yet** (scheduled for Phase 5). In the current application, the interactive pages for video recording upload (`/practice/upload`), assessment feedback (`/submissions/[id]`), trainer review queue (`/review`, `/review/[id]`), learner progress (`/progress`), and the institution admin dashboard (`/admin/dashboard`) are **UI previews populated with realistic sample data**.

---

## Tech Stack

- **Backend**:
  - Python 3.12
  - Django 6.1 & Django REST Framework (DRF)
  - JWT Authentication (`djangorestframework-simplejwt`)
  - API Documentation (`drf-spectacular` OpenAPI 3.0)
  - PostgreSQL (`psycopg2-binary`)
  - Asynchronous Task Queue: Celery & Redis
  - CORS Middleware: `django-cors-headers`
- **Frontend**:
  - Next.js 16 (App Router)
  - React 19
  - TypeScript
  - Tailwind CSS 4
  - Axios HTTP client
- **Database**: PostgreSQL 16+
- **Platform**: Windows 11 / Windows Server (PowerShell)

---

## Folder Structure

```
vocational-trainer/
├── .gitignore
├── README.md
├── AGENTS.md                # Operating guidelines and safety boundaries
├── docs/                    # Architecture, API, database, and phase specs
├── backend/
│   ├── .env
│   ├── .env.example
│   ├── manage.py
│   ├── requirements.txt
│   ├── config/              # Django settings, URLs, WSGI/ASGI, Celery config
│   ├── accounts/            # Users, institutions, JWT auth, consent
│   ├── courses/             # Trades, modules, procedures, steps
│   ├── practice/            # Submissions, video upload, playback, tasks
│   ├── assessments/         # Step scores and trainer reviews
│   ├── analytics/           # Cohort metrics and audit reporting
│   └── venv/                # Python virtual environment (gitignored)
└── frontend/
    ├── .env.local
    ├── .env.example
    ├── package.json
    ├── tsconfig.json
    ├── next.config.ts
    ├── app/                 # Next.js App Router (pages and layouts)
    ├── components/          # Shared design components
    ├── lib/                 # Auth context, API client, mock preview data
    └── public/              # Static assets
```

---

## How to Run Locally on Windows

### Prerequisites
- **Python 3.12+**
- **Node.js 20+** and **npm**
- **PostgreSQL 16+** running locally with a database named `vtrainer`
- **Docker Desktop** (optional for Phase 4A Redis: `docker run -d --name hunar-redis -p 127.0.0.1:6379:6379 redis:7`)

---

### Step 1: Backend Setup

1. Open PowerShell and navigate to the `backend` directory:
   ```powershell
   cd C:\dev\vocational-trainer\backend
   ```

2. Create and activate the Python virtual environment:
   ```powershell
   python -m venv venv
   .\venv\Scripts\Activate.ps1
   ```

3. Install backend dependencies:
   ```powershell
   python -m pip install -r requirements.txt
   ```

4. Configure environment variables:
   ```powershell
   Copy-Item .env.example .env
   ```
   Open `.env` in an editor and configure your local database credentials (development defaults):
   ```env
   SECRET_KEY=local-dev-insecure-key
   DEBUG=True
   DB_NAME=vtrainer
   DB_USER=postgres
   DB_PASSWORD=vtrainer_dev_pw
   DB_HOST=localhost
   DB_PORT=5432
   ALLOWED_HOSTS=127.0.0.1,localhost
   HUNAR_MEDIA_ROOT=C:\dev\hunar-media
   HUNAR_MAX_UPLOAD_MB=200
   HUNAR_MAX_VIDEO_SECONDS=300
   ```

5. Apply database migrations:
   ```powershell
   python manage.py migrate
   ```

6. Seed the demonstration dataset:
   ```powershell
   python manage.py seed_demo
   ```

7. Create a local administrator account:
   ```powershell
   python manage.py createsuperuser
   ```

8. Start the Django development server:
   ```powershell
   python manage.py runserver 127.0.0.1:8000
   ```
   The backend API will be available at `http://127.0.0.1:8000/`.  
   Health check: `http://127.0.0.1:8000/api/health/`

---

### Step 2: Frontend Setup

1. Open a second PowerShell terminal and navigate to the `frontend` directory:
   ```powershell
   cd C:\dev\vocational-trainer\frontend
   ```

2. Install dependencies:
   ```powershell
   npm install
   ```

3. Configure environment variables:
   ```powershell
   Copy-Item .env.example .env.local
   ```
   Ensure `.env.local` contains:
   ```env
   NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
   ```

4. Start the Next.js development server:
   ```powershell
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

---

### How to Run Celery on Windows (Phase 4)

Because Windows does not support the POSIX `fork` process model, Celery workers must be started with the `--pool=solo` execution pool:

```powershell
cd C:\dev\vocational-trainer\backend
.\venv\Scripts\Activate.ps1
celery -A config worker -l info --pool=solo
```

---

## Demo Guide for Reviewers

Follow this walkthrough to explore the full application:

1. **Seed Curriculum Data:** Ensure the database has the initial curriculum by running `python manage.py seed_demo` in `backend/`. This populates Demo ITI (institution code `DEMO-ITI`), the Electrical Wiring trade, and 4 practical procedures with 39 steps.
2. **Register a Learner:**
   - In your browser, navigate to `http://localhost:3000/register`.
   - Enter your name, username, email, password, and the institutional code `DEMO-ITI`.
   - Check the mandatory video recording & privacy consent checkbox, then click **Complete Registration**.
3. **Log In:**
   - Sign in on `http://localhost:3000/login` with your newly registered credentials.
   - You will be redirected to the Learner Home (`http://localhost:3000/home`), displaying your name and affiliated institution.
4. **Browse Procedures:**
   - Click **Browse catalog** or navigate to `http://localhost:3000/procedures`.
   - Use the search bar and difficulty filter chips (Beginner / Intermediate / Advanced) to filter exercises.
   - Notice the persistent Draft Notice reminding trainees to follow their trainer's instructions.
5. **Inspect Procedure Steps:**
   - Click **View Steps** on any procedure (e.g., `/procedures/PROC-ELEC-01`).
   - Review the required tool list, sequential steps, and red `SAFETY-CRITICAL` indicators with visual camera evidence cues.
6. **Explore UI Preview Screens:**
   - Click **Record & Upload Practice** on any procedure to preview the filming checklist and mock upload screen at `/practice/upload`.
   - Check the sample evaluation report at `/submissions/sample-sub-1`.
   - Review learner progress charts at `/progress`.
   - Inspect the trainer queue at `/review` and institutional metrics at `/admin/dashboard`.
7. **Interactive API Documentation:**
   - Open Swagger UI at `http://127.0.0.1:8000/api/v1/docs/` or ReDoc at `http://127.0.0.1:8000/api/v1/redoc/`.
   - Inspect OpenAPI 3.0 schema definitions for authentication, courses, and practice submission endpoints.
8. **Django Administrative Interface:**
   - Navigate to `http://127.0.0.1:8000/admin/` and sign in with the superuser created via `createsuperuser`.
   - Inspect registered users, institutions, trades, active/deactivated procedure steps, and consent records.
9. **Run Automated Test Suite:**
   - In `backend/`, run `python manage.py test`. All 57 automated tests covering models, authentication, JWT blacklisting, permissions, course APIs, upload validation, and Range-based video streaming will execute and pass.

---

## Documentation Index

Comprehensive engineering specifications are located in the `docs/` directory:

### Core Specifications
- [docs/PRD.md](docs/PRD.md): Product Requirements Document (problem statement, personas, and success metrics)
- [docs/ROADMAP.md](docs/ROADMAP.md): Project Implementation Roadmap (8 milestone phases)
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md): System Architecture Specification (asynchronous worker design and inference pipeline)
- [docs/DATABASE.md](docs/DATABASE.md): Relational Database Schema Specification (PostgreSQL table structures and indexes)
- [docs/API.md](docs/API.md): REST API Specification (endpoint contracts, payload formats, and status codes)
- [docs/DESIGN.md](docs/DESIGN.md): Design System Specification (color palette, typography, tokens, and Stitch conversions)
- [docs/openapi.yml](docs/openapi.yml): OpenAPI 3.0 API Definition (auto-generated via `drf-spectacular`)

### Phase 1 Design & Standards
- [docs/phase1/scope.md](docs/phase1/scope.md): Trade Scope & Verification Benchmarks
- [docs/phase1/data-model.md](docs/phase1/data-model.md): Conceptual Domain Entity Model
- [docs/phase1/data-plan.md](docs/phase1/data-plan.md): Dataset Collection, Labeling Taxonomy & Partitioning Plan
- [docs/phase1/filming-guidelines.md](docs/phase1/filming-guidelines.md): Mobile Video Filming Guidelines & 2-Second Hold Protocol
- [docs/phase1/consent-and-privacy.md](docs/phase1/consent-and-privacy.md): Learner Video Recording & Data Privacy Consent Policy
- [docs/phase1/screens.md](docs/phase1/screens.md): Wireframe Screen Specifications & Stitch AI Prompts

### Standardized Electrical Wiring Procedures (Drafts)
- [docs/phase1/procedures/01-single-pole-switch-and-lamp.md](docs/phase1/procedures/01-single-pole-switch-and-lamp.md): `PROC-ELEC-01` — Single-Pole Switch Controlling a Batten Lamp
- [docs/phase1/procedures/02-switch-controlled-socket-outlet.md](docs/phase1/procedures/02-switch-controlled-socket-outlet.md): `PROC-ELEC-02` — Switch-Controlled 3-Pin Socket Outlet Installation
- [docs/phase1/procedures/03-staircase-wiring-two-way-control.md](docs/phase1/procedures/03-staircase-wiring-two-way-control.md): `PROC-ELEC-03` — Two-Way Staircase Lighting Circuit Installation
- [docs/phase1/procedures/04-dead-circuit-testing-and-verification.md](docs/phase1/procedures/04-dead-circuit-testing-and-verification.md): `PROC-ELEC-04` — Dead-Circuit Safety Testing & Verification

### Operating Guidelines
- [AGENTS.md](AGENTS.md): AI Agent Operating Guidelines, Terminal Rules & Ethical Safety Principles
