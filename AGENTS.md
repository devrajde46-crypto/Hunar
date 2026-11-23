# AI Agent Operating Guidelines & Repository Rules

**Project:** Hunar  
**Target Platform:** Windows 11 / Windows Server (PowerShell)  
**Stack:** Django 6.1 (DRF, PostgreSQL, SimpleJWT, Celery/Redis) + Next.js 16 (React 19, TypeScript, Tailwind CSS 4, Axios)  
**Applicability:** Mandatory for all AI coding agents, autonomous subagents, and human contributors operating in this repository.

---

## 1. Execution Environment & Terminal Rules

1. **Integrated Terminal Only:**
   - Always run commands strictly within Antigravity's integrated terminal session.
   - **Never** attempt to spawn external PowerShell, CMD, Windows Terminal, or GUI browser windows.
   - Do not use background processes that detach or hide terminal output unless explicitly authorized.

2. **Windows Pathing & PowerShell Syntax:**
   - The host system runs Windows with PowerShell. Always use valid PowerShell commands (e.g., `Get-ChildItem`, `Test-Path`, `Copy-Item`, `Set-Location`, `Select-String`).
   - Do not use POSIX-only shell commands or bash operators (e.g. `export VAR=val`, `grep`, `touch`, `source`) without PowerShell equivalents (`$env:VAR="val"`, `Select-String`, `New-Item`, `. .\venv\Scripts\Activate.ps1`).
   - In cross-platform documentation, use forward slashes for URLs/markdown links (`file:///C:/dev/...`) and standard Windows backslashes for local paths (`backend\venv\Scripts\python.exe`).

3. **Virtual Environment & Python Executables:**
   - **Never** invoke bare `pip` or `django-admin` globally.
   - Always activate the virtual environment first (`.\venv\Scripts\Activate.ps1` from `backend/`) or call the virtual environment Python executable explicitly:
     ```powershell
     # Correct:
     python -m pip install <package>
     python -m django --version
     python manage.py <subcommand>
     # Or using explicit path:
     C:\dev\vocational-trainer\backend\venv\Scripts\python.exe -m pip ...
     
     # FORBIDDEN:
     pip install ...
     django-admin startproject ...
     ```

4. **Security & System Integrity:**
   - **Never** disable, alter, or attempt to bypass Windows Defender, Smart App Control, Antivirus, Firewall, or User Account Control (UAC) settings.
   - Never tamper with system directories (`C:\Windows`, `Program Files`) or modify system registry keys.
   - Never disable SSL/TLS certificate verification in scripts, package managers, or HTTP clients.

---

## 2. Secrets, Git Safety & File Modification Boundaries

1. **Zero Secret Leakage:**
   - **Never commit `.env`, `.env.local`, or any private credential files.**
   - Before running any `git add` command, inspect `git status` to ensure secrets, database credentials, API tokens, and JWT private keys are strictly gitignored.
   - Never hardcode API keys, passwords, or production secrets into source code or test fixtures. Use environment variable lookups with safe development defaults.

2. **Strict File Preservation & Non-Destructive Operations:**
   - **Never delete or overwrite any existing file without stopping and obtaining explicit human user confirmation.**
   - If a target file already exists, stop and ask the user how to proceed.
   - **Destructive Git commands are strictly forbidden** without explicit user instruction. Never run:
     - `git reset --hard`
     - `git clean -fd` or `git clean -f`
     - `git checkout .` / `git restore .` (discarding working tree edits)
     - `git rm` (without confirmation)
     - `git push --force`

3. **Incremental Commits:**
   - Do not commit changes automatically unless the user explicitly requests a commit.
   - Always display `git status` and a clear summary table of created/modified files before asking the user for commit approval.

---

## 3. Workflow, Dependencies & Phased Development

1. **One Phase / One Feature at a Time:**
   - Focus exclusively on the active task or phase assigned by the user. Do not prematurely scaffold, modify, or refactor code belonging to later roadmap phases.
   - Always consult [ROADMAP.md](file:///c:/dev/vocational-trainer/docs/ROADMAP.md) to understand current phase boundaries and deliverables.

2. **Read the Source of Truth First:**
   - Before writing or editing code in any application directory, read the relevant foundation specifications:
     - Architecture: [docs/ARCHITECTURE.md](file:///c:/dev/vocational-trainer/docs/ARCHITECTURE.md)
     - Database & Models: [docs/DATABASE.md](file:///c:/dev/vocational-trainer/docs/DATABASE.md) and [docs/phase1/data-model.md](file:///c:/dev/vocational-trainer/docs/phase1/data-model.md)
     - REST API & Auth: [docs/API.md](file:///c:/dev/vocational-trainer/docs/API.md)
     - Frontend Specs & Design Tokens: [docs/DESIGN.md](file:///c:/dev/vocational-trainer/docs/DESIGN.md) and [docs/phase1/screens.md](file:///c:/dev/vocational-trainer/docs/phase1/screens.md)
     - Product Requirements: [docs/PRD.md](file:///c:/dev/vocational-trainer/docs/PRD.md)
     - Procedural & Safety Rules: [docs/phase1/procedures/](file:///c:/dev/vocational-trainer/docs/phase1/procedures/)
   - If a proposed implementation would contradict a Phase 1 or planning document, halt and discuss the discrepancy with the user.

3. **Zero Unauthorized Dependencies:**
   - **Do not add new Python packages or npm packages without asking first.**
   - Do not run `pip install <new_package>` or `npm install <new_package>` arbitrarily. Stick strictly to packages defined in `backend/requirements.txt` and `frontend/package.json`. If a new dependency is required, explain the rationale and request user permission before modifying dependency manifests.

4. **Mandatory Automated Testing:**
   - Write unit and integration tests for all newly introduced backend models, API serializers, viewsets, authentication helpers, and business logic.
   - Backend tests must be written inside the respective Django app `tests/` directory and run via `python manage.py test <app>` or `pytest`.
   - Never declare a feature complete until all relevant automated tests pass without errors or deprecation warnings.

---

## 4. Electrical Safety & Ethical AI Principles

1. **Human-in-the-Loop Authority (Non-Negotiable):**
   - In vocational crafts involving electrical wiring, human safety is life-critical.
   - Certified vocational instructors are the ultimate authority. The AI system is an automated triage and pre-scoring assistant, **never** an autonomous certification authority.
   - Every interface, data model, and API endpoint must preserve the instructor's ability to review video evidence, adjust scores, and override AI verdicts.

2. **Never Claim Autonomous Safety Guarantees:**
   - **Never state or imply that the AI system guarantees that an electrical installation is safe, functional, or ready for live energization.**
   - All physical testing and live circuit energization must occur under the direct physical supervision of a qualified vocational trainer in accordance with institutional workshop rules.
   - Any visual ambiguity, occlusion, or confidence score $< 0.70$ on safety-critical steps must default deterministically to `INCONCLUSIVE` / `Escalated to Trainer`.

3. **Stop and Ask if Any Step Fails:**
   - If a command, test suite, build step, database migration, or script execution fails: **Stop immediately**.
   - Do not enter repetitive trial-and-error loops or execute random commands in hope of resolving the error.
   - Inspect the exact error message, identify the root cause, present a clear diagnosis to the user, and ask for guidance if the resolution involves architectural decisions or environment changes.
