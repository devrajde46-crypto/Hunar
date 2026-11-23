# Project Implementation Roadmap

**Project Name:** AI Vocational Skills Trainer  
**Document Version:** 1.0  
**Status:** Approved Active Roadmap  
**Total Estimated Timeline:** 
- **13 to 17 weeks** (Standard Path: No-training AI pipeline with measurement validation)
- **15 to 20 weeks** (Contingency Path: Including Phase 5C targeted model fine-tuning)  
**Primary Source of Truth:** `README.md`, `docs/phase1/*`, `docs/PRD.md`, `docs/DESIGN.md`, `docs/ARCHITECTURE.md`, `docs/DATABASE.md`, `docs/API.md`, `AGENTS.md`

---

## 1. Roadmap Overview & Phased Architecture

The implementation roadmap structures the engineering effort into sequential, milestone-driven phases. It follows a strict "validate-before-scaling" methodology: establishing solid backend data persistence and security first, building responsive user interfaces, scaling asynchronous video processing, validating pretrained computer vision models against certified trainer benchmarks, and only fine-tuning models if empirical measurement gates indicate an accuracy deficit.

```mermaid
gantt
    title AI Vocational Skills Trainer - Implementation Horizon
    dateFormat  YYYY-MM-DD
    section Foundation
    Phase 0: Environment Setup (Complete)       :done,    p0, 2026-10-01, 2026-10-14
    Phase 1: Scope, Design, Data Plan (Complete) :done,    p1, 2026-10-15, 2026-11-21
    section Core Engineering
    Phase 2: Core Backend & Security            :active,  p2, 2026-11-24, 3w
    Phase 3: Frontend Integration               :         p3, after p2, 3w
    Phase 4: Video Pipeline & Data Collection   :         p4, after p2, 4w
    section AI & Verification
    Phase 5A: No-Training AI Pipeline           :         p5a, after p4, 3w
    Phase 5B: Measurement Gate Evaluation       :         p5b, after p5a, 1w
    Phase 5C: Optional Targeted Fine-Tuning     :crit,    p5c, after p5b, 3w
    section Human Review & Pilot
    Phase 6: Trainer Review & Analytics         :         p6, after p5b, 2w
    Phase 7: Pilot Testing & Deployment         :         p7, after p6, 4w
    section Post-MVP Scale
    Phase 8: Multi-Trade & Regional Expansion   :         p8, after p7, 8w
```

---

## 2. Detailed Phase Specifications

### Phase 0: Environment Setup
- **Status:** [x] Completed
- **Goals:** 
  - Initialize local development environment on Windows 11 with PowerShell.
  - Set up Python 3.12 virtual environment, Django 6.1 project structure, and local PostgreSQL 16 database.
  - Initialize Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS 4 frontend workspace.
- **Deliverables:**
  - Standardized repository layout with `backend/` and `frontend/` directories.
  - Configured `backend/config/settings.py` with PostgreSQL, DRF, SimpleJWT, and CORS headers.
  - Working `/api/health/` endpoint returning `{"status": "ok"}`.
  - Next.js development server running on `http://localhost:3000`.
- **Milestone:** **M0 — Environment Verified** (Local developer workstations operational with verified database connectivity and clean build pipelines).
- **Rough Duration:** Completed (1 week).
- **Dependencies:** None.
- **Risks:** Local Windows path handling, PowerShell execution policies, and Node.js sandbox permissions.

---

### Phase 1: Scope, Design, and Data Plan
- **Status:** [x] Completed
- **Goals:**
  - Define trade boundaries, problem statement, user personas, and quantitative success criteria.
  - Standardize 4 core domestic electrical wiring procedures with step-level visual evidence cues.
  - Establish student filming guidelines, privacy/consent frameworks, dataset acquisition plans, and full UI/UX screen specifications.
  - Author complete architectural design specifications (`PRD.md`, `DESIGN.md`, `ARCHITECTURE.md`, `DATABASE.md`, `API.md`).
- **Deliverables:**
  - `docs/phase1/scope.md`: Bound to Basic Electrical Wiring (`PROC-ELEC-01` to `04`), defining 85% concordance and 0% safety FNR benchmarks.
  - `docs/phase1/procedures/`: 4 detailed electrical wiring procedure checklists with safety-critical flags and mistake taxonomies.
  - `docs/phase1/filming-guidelines.md`: 5-point phone checklist, landscape mounting, 2-sec hold rules.
  - `docs/phase1/consent-and-privacy.md`: Trainee video recording consent and data privacy framework.
  - `docs/phase1/data-plan.md`: Pilot dataset targets (120–150 videos), annotation taxonomy, 60/20/20 partitioning plan.
  - `docs/phase1/screens.md`: 11 mobile-first UI screen specifications with ready-to-paste Stitch AI prompts.
  - `docs/PRD.md` & `docs/DESIGN.md`: Product requirements and frontend design tokens/conversion rules.
  - `docs/ARCHITECTURE.md`, `docs/DATABASE.md`, `docs/API.md`: Full architectural, relational schema, and REST API contracts.
- **Milestone:** **M1 — Architecture & Trade Design Sign-Off** (Complete design documentation accepted as source of truth; ready for Phase 2 implementation).
- **Rough Duration:** Completed (2 weeks).
- **Dependencies:** Phase 0.
- **Risks:** Premature scope expansion into live testing or multiple trades (mitigated by strict exclusion rules).

---

### Phase 2: Core Backend (Roles, JWT, Models, APIs, Admin, Tests)
- **Status:** [ ] Pending
- **Goals:**
  - Implement relational data models in Django 6.1 following `docs/DATABASE.md` without deviations.
  - Configure custom `User` model with 4 distinct roles (`LEARNER`, `TRAINER`, `INSTITUTION_ADMIN`, `SUPER_ADMIN`).
  - Implement SimpleJWT authentication lifecycle with refresh token rotation and blacklisting.
  - Build and seed curriculum models (`Trade`, `Module`, `Procedure`, `ProcedureStep`) for `PROC-ELEC-01` through `04`.
  - Implement consent recording, role-based DRF permission classes, custom Django Admin views, and automated test coverage.
- **Deliverables:**
  - Django apps: `accounts`, `courses`, `practice`, `assessments`, `analytics`.
  - Database migrations for all 15 relational schema tables.
  - JSON data fixtures pre-populating the 4 electrical procedures, 39 steps, and 9 error taxonomy tags.
  - Authentication endpoints: `/api/v1/auth/register/`, `/login/`, `/token/refresh/`, `/logout/`, `/me/`.
  - Course endpoints: `/api/v1/courses/trades/`, `/courses/procedures/`, `/courses/procedures/{code}/`.
  - Comprehensive automated test suite with $\ge 90\%$ test coverage on models, permissions, and serializers.
- **Milestone:** **M2 — Core Backend API Operational** (All foundational REST endpoints functional, authenticated, and verified by passing automated test suites).
- **Rough Duration:** 2 to 3 weeks.
- **Dependencies:** Phase 1 design specifications.
- **Risks:** Foreign key constraint conflicts on user soft deletes, permission leakages between learner and trainer endpoints.

---

### Phase 3: Frontend Integration
- **Status:** [ ] Pending
- **Goals:**
  - Convert 11 Stitch AI screen specifications into modular, accessible React 19 / Next.js 16 components.
  - Implement mobile-first responsive layouts (375px base) with WCAG 2.1 AA accessibility (48px touch targets, focus rings).
  - Integrate Axios API client with automatic JWT token attachment, proactive token refresh, and error handling.
  - Construct distinct user interfaces for Learner, Trainer, and Institution Administrator personas.
- **Deliverables:**
  - Authentication UI: Login (Screen 1) and Register with mandatory Consent modal (Screen 2).
  - Learner Experience: Dashboard (Screen 3), Procedure Catalog (Screen 4), Procedure Detail & Safety Briefing (Screen 5), Feedback Result (Screen 7), Competency Transcript (Screen 10).
  - Trainer Experience: Review Queue (Screen 8) and Split-Screen Review Workbench (Screen 9).
  - Administrator Portal: Institutional KPI & Accreditation Dashboard (Screen 11).
  - Shared atomic component library under `frontend/components/` (Buttons, Badges, AlertBanners, Modals).
- **Milestone:** **M3 — Full Interactive UI Wired to Backend** (End-to-end interactive frontend operational on desktop and mobile viewports with authenticated API integration).
- **Rough Duration:** 2 to 3 weeks.
- **Dependencies:** Phase 2 backend APIs.
- **Risks:** Mobile layout regressions on budget Android browser viewports ($375\text{px}$ width), CSS specificity issues with Tailwind 4.

---

### Phase 4: Video Pipeline and Data Collection
- **Status:** [ ] Pending
- **Goals:**
  - Build a resilient, asynchronous video upload and ingestion engine using Celery 5.4 and Redis 7.
  - Implement client-side video validation (MP4/WebM, $\le 250\text{MB}$, duration 5–8 min) and chunked backend ingestion.
  - Set up FFmpeg video transcoding, keyframe extraction (1–2 fps), and audio integrity checking.
  - Formalize data collection partnership with 2–3 regional ITIs to capture the 120–150 pilot video dataset.
  - Deploy video annotation environment (CVAT / Label Studio) for certified electrical instructors to produce gold-standard ground truth labels.
- **Deliverables:**
  - Asynchronous Celery tasks: `process_video_submission`, `extract_keyframes`, `cleanup_stale_media`.
  - Secure media storage abstraction with time-limited presigned URLs (15–30 min expiration).
  - Trainee consent verification enforcement prior to video file creation.
  - Pilot dataset: 120–150 annotated practice videos partitioned into 60% Train, 20% Validation, and 20% Benchmark Test splits by Trainee ID.
- **Milestone:** **M4 — Ingestion Pipeline Operational & Pilot Dataset Secured** (Video processing queue operational under load; gold standard annotated benchmark dataset collected and partitioned).
- **Rough Duration:** 3 to 4 weeks.
- **Dependencies:** Phase 2 backend and Phase 3 upload interface.
- **Risks:** Constrained uplink bandwidth in partner ITI workshops causing upload timeouts; inter-annotator labeling discrepancies among trainers.

---

### Phase 5A: No-Training AI Pipeline
- **Status:** [ ] Pending
- **Goals:**
  - Implement the multi-stage AI inference pipeline without custom model training.
  - Integrate MediaPipe Pose for operator hand tracking, framing distance, and 2-second inspection hold stability validation.
  - Integrate pretrained YOLO (YOLOv8/v11) for detecting tools (pliers, strippers, screwdrivers), electrical components, and jumper wires.
  - Integrate Multimeter OCR for extracting dial positions and numerical LCD readouts ($0.0\text{V}$, $\text{OL}$, $< 0.5\Omega$).
  - Implement the transparent rule-based scoring engine with deterministic zero-tolerance safety gatekeeping.
  - Implement the LLM Tutor with RAG over verified vocational electrical manuals to generate pedagogical coaching feedback.
- **Deliverables:**
  - AI worker module under `backend/ai_pipeline/` running out-of-band via Celery.
  - Deterministic rule engine evaluating steps into `CORRECT`, `INCORRECT`, or `INCONCLUSIVE`.
  - Safety gatekeeper forcing `overall_ai_verdict = SAFETY_VIOLATION` on any safety-critical failure.
  - RAG knowledge base indexed with verified practical trade handbook manuals.
  - Populated `step_scores` and `step_score_errors` records linked to submissions.
- **Milestone:** **M5A — Automated Step Scoring Functional** (Raw video processed end-to-end into automated step verdicts, timestamp markers, and coaching feedback within 5 minutes).
- **Rough Duration:** 2 to 3 weeks.
- **Dependencies:** Phase 4 video ingestion pipeline.
- **Risks:** Pretrained vision models failing to detect subtle wire stripping defects (nicked copper strands) without custom training.

---

### Phase 5B: Measurement Gate Against Trainer Labels
- **Status:** [ ] Pending
- **Goals:**
  - Execute automated benchmarking evaluation comparing Phase 5A AI scores against gold-standard trainer consensus annotations across the 20% Benchmark Test split ($\ge 50$ test attempts).
  - Compute overall step concordance and Cohen’s Kappa ($\kappa$).
  - Measure Safety-Critical False Negative Rate ($\text{FNR}_{\text{safety}}$).
  - Formally evaluate whether Phase 5A satisfies deployment criteria or triggers Phase 5C fine-tuning.
- **Pass Criteria for Measurement Gate:**
  1. Overall Step Concordance $\ge 85\%$ ($\kappa \ge 0.75$).
  2. Safety-Critical False Negative Rate **exactly $0.00\%$** (zero false passes on unsafe steps).
  3. Processing Latency $\le 5.0\text{ minutes}$ for a 6-minute video.
- **Deliverables:**
  - Automated concordance benchmarking harness script.
  - Empirical Benchmark Evaluation Report detailing step-by-step concordance, confusion matrices, and safety FNR.
  - Gate Decision Sign-Off: Proceed directly to Phase 6 (if passed) OR trigger Phase 5C (if gate fails).
- **Milestone:** **M5B — Measurement Gate Evaluated** (Empirically verified accuracy metrics logged against ground truth).
- **Rough Duration:** 1 week.
- **Dependencies:** Phase 4 (annotated benchmark dataset) & Phase 5A (inference pipeline).
- **Risks:** Visual ambiguity or occlusions causing excessive `INCONCLUSIVE` classifications.

---

### Phase 5C: Optional Targeted Fine-Tuning (Conditional Contingency)
- **Status:** [ ] Pending *(Triggered ONLY if Phase 5B fails to meet accuracy or safety thresholds)*
- **Goals:**
  - Fine-tune YOLO object detection weights on the partitioned 60% `TRAIN` dataset split to improve detection of terminal screws, stripped conductor ends, and modular switch ports.
  - Train a lightweight classifier on MediaPipe pose embeddings to distinguish between proper tug testing vs. idle hand movement.
  - Re-calibrate confidence thresholds to guarantee $0.00\%$ safety-critical FNR.
- **Deliverables:**
  - Fine-tuned domain model weights for electrical workbench components.
  - Post-tuning concordance validation report demonstrating achievement of $\ge 85\%$ agreement and $0.00\%$ safety FNR.
- **Milestone:** **M5C — Fine-Tuned Accuracy Gate Satisfied** (Fine-tuned pipeline passes all M5B criteria).
- **Rough Duration:** 2 to 3 weeks (if triggered).
- **Dependencies:** Phase 5B measurement gate deficit.
- **Risks:** Model overfitting to specific partner ITI workbench backgrounds or wire manufacturer color shades.

---

### Phase 6: Trainer Review and Analytics
- **Status:** [ ] Pending
- **Goals:**
  - Implement the human-in-the-loop instructor evaluation workbench (Screen 8 & 9).
  - Deploy the synchronized video player with speed controls (1x, 1.25x, 1.5x, 2x) and timestamp jump buttons.
  - Implement one-click score overrides and official grading sign-off (`COMPETENT`, `NOT_YET_COMPETENT`, `SAFETY_FAIL`).
  - Build institutional analytics dashboards (Screen 11) for tracking cohort velocity and safety failure frequencies.
  - Implement accreditation audit data export (CSV/JSON).
- **Deliverables:**
  - Operational Trainer Review Queue prioritized by safety alerts.
  - Split-screen review detail page with bi-directional video/rubric synchronization.
  - Immutable audit logging of all trainer overrides in `audit_logs` and `trainer_reviews`.
  - Accreditation export generator producing verified student practical transcripts.
- **Milestone:** **M6 — Human Review & Analytics Complete** (Instructors evaluate submissions in $< 2\text{ minutes}$ with full override authority; accreditation reporting operational).
- **Rough Duration:** 2 weeks.
- **Dependencies:** Phase 3 frontend & Phase 5A/5B scoring pipeline.
- **Risks:** Cognitive fatigue or UI friction if instructor override interface is complex.

---

### Phase 7: Pilot Testing and Deployment
- **Status:** [ ] Pending
- **Goals:**
  - Deploy platform to cloud production staging environment (containerized Django API, Celery GPU workers, managed PostgreSQL, Redis, private S3 storage).
  - Conduct active workshop pilot trials across 2–3 partner ITIs with $\ge 100$ enrolled trainees.
  - Validate mobile recording compliance using the 5-point filming checklist on budget Android smartphones.
  - Measure instructor time savings ($\ge 60\%$ reduction vs unassisted grading) and student feedback turnaround ($\le 5\text{ mins}$).
  - Administer standardized post-pilot satisfaction surveys to instructors ($\ge 80\%$ trust rating) and trainees.
- **Deliverables:**
  - Fully deployed, monitored production environment with SSL/TLS 1.3 encryption.
  - 100+ trainee practice attempts evaluated and certified.
  - Formal Pilot Evaluation Report analyzing system concordance, safety compliance, and operational efficiency.
- **Milestone:** **M7 — Institutional Pilot Completed & Certified** (Platform successfully operates across real vocational workshops with verified instructor satisfaction and accreditation compliance).
- **Rough Duration:** 3 to 4 weeks.
- **Dependencies:** Phase 6 complete.
- **Risks:** Network outages in workshop buildings, poor bench lighting causing student recording failures.

---

### Phase 8: After Validation (Post-MVP Expansion)
- **Status:** [ ] Pending (Future Horizons)
- **Goals:**
  - Scale validated core platform to additional vocational trades, languages, and low-connectivity environments.
- **Planned Horizons:**
  1. **Multi-Trade Expansion:** Extend computer vision taxonomies and rubrics to Plumbing (pipe joint soldering, pressure testing) and Welding.
  2. **Regional Language Localization:** Support Hindi, Marathi, Tamil, Bengali, and other regional languages across UI text, voice prompts, and feedback transcripts.
  3. **Offline-First PWA Mode:** Implement local offline recording buffers and background synchronization for rural training centers with intermittent internet.
  4. **Practical Skills Portfolio & QR Credentials:** Cryptographically verifiable digital skill certificates with QR links to validated practical video evidence.
  5. **Simulated Pre-Training:** Optional lightweight web-based schematic practice modules to reinforce theory before physical workbench trials.
- **Milestone:** **M8 — Multi-Trade Regional Vocational Platform**.
- **Rough Duration:** Ongoing post-MVP roadmap.
- **Dependencies:** Phase 7 pilot validation.

---

## 3. Overall Timeline & Critical Path Summary

| Phase | Description | Status | Duration (Weeks) | Cumulative (No Fine-Tuning) | Cumulative (With Fine-Tuning) |
| :---: | :--- | :---: | :---: | :---: | :---: |
| **0** | Environment Setup | [x] Done | 1 | Complete | Complete |
| **1** | Scope, Design, Data Plan | [x] Done | 2 | Complete | Complete |
| **2** | Core Backend (Models, JWT, APIs, Tests) | [ ] Pending | 2–3 | Week 3 | Week 3 |
| **3** | Frontend Integration (11 Screens) | [ ] Pending | 2–3 | Week 6 | Week 6 |
| **4** | Video Pipeline & Pilot Data Collection | [ ] Pending | 3–4 | Week 9 | Week 9 |
| **5A** | No-Training AI Pipeline | [ ] Pending | 2–3 | Week 12 | Week 12 |
| **5B** | Measurement Gate Evaluation | [ ] Pending | 1 | Week 13 | Week 13 |
| **5C** | *Optional Targeted Fine-Tuning* | [ ] Pending | *2–3 (Optional)* | *N/A (Bypassed)* | Week 16 |
| **6** | Trainer Review & Analytics | [ ] Pending | 2 | Week 15 | Week 18 |
| **7** | Pilot Testing & Cloud Deployment | [ ] Pending | 3–4 | **17 Weeks** | **20 Weeks** |
| **8** | Post-MVP Scale & Multi-Trade Expansion | [ ] Pending | Ongoing | Post-MVP | Post-MVP |

**Total Estimated Implementation Window:**
- **Standard Path (No Fine-Tuning Needed):** **13 to 17 Weeks** (~3.5 to 4 months)
- **Contingency Path (Targeted Fine-Tuning Required):** **15 to 20 Weeks** (~4 to 5 months)
