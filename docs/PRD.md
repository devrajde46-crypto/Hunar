# Product Requirements Document (PRD)

**Project Name:** AI Vocational Skills Trainer  
**Document Version:** 1.0 (Phase 1 / Phase 2 Architecture Alignment)  
**Status:** Approved for Implementation Planning  
**Target Trade (MVP):** Basic Electrical Wiring (Domestic / Light Commercial)  
**Source of Truth:** `README.md` and `docs/phase1/` (`scope.md`, `data-model.md`, `data-plan.md`, `filming-guidelines.md`, `consent-and-privacy.md`, `screens.md`, and `procedures/`)

---

## 1. Problem Statement

Vocational education and training in technical crafts (such as electrician trades under Industrial Training Institute [ITI] and polytechnic curricula) is fundamentally hands-on and mastery-based. However, vocational institutions face persistent structural and operational bottlenecks:

1. **High Student-to-Trainer Ratios:** Vocational workshops frequently operate at ratios between **25:1 and 35:1** trainees per instructor. During practical workshop sessions, a single trainer cannot continuously observe 30 simultaneous wiring exercises across individual workbenches.
2. **Delayed Feedback on Hidden Execution Errors:** Critical mechanical and electrical errors—such as nicked copper strands from improper wire stripping, inadequate terminal screw torque, loose earthing terminations, or reverse polarity—are frequently missed during brief post-exercise visual checks. Worse, circuits may function during a live lamp test even when wired with dangerous latent flaws.
3. **Severe Safety Liabilities:** In electrical craftsmanship, procedural sequencing is life-critical. Omitting de-energized isolation checks, touching conductors without proving the board is dead, omitting protective earthing, or routing the phase supply directly to switched socket outputs creates immediate risks of electrical shock, arc flashes, and workshop fire hazards.
4. **Subjective, Unstandardized, and Unaudited Assessments:** Conventional workshop grading relies on quick, unstandardized visual inspections at the end of class. There is no persistent, verifiable evidence or audit trail demonstrating how a trainee executed each physical step, whether safety checks were adhered to, or how competency was validated.

The **AI Vocational Skills Trainer** addresses these challenges by delivering an **asynchronous, video-assisted step-verification platform**. Trainees record their hands-on workbench exercises using standard budget smartphones. The system analyzes the video using an ensemble of pretrained computer vision models coupled with a deterministic, rule-based scoring engine. It verifies procedural steps, detects safety violations, flags timestamped defects, and triages submissions into an instructor queue—enabling instructors to deliver rapid, objective, auditable, and safety-gated practical assessments in under two minutes per student.

---

## 2. Users and Personas

The platform serves three primary roles within vocational training institutes:

### 2.1 Learner (Vocational Trainee)
- **Profile:** Trainee enrolled in an electrician vocational certificate or diploma course (e.g., ITI Electrician Trade). Operates an entry-level to mid-range Android smartphone (720p/1080p).
- **Primary Needs:**
  - Clear, accessible step-by-step guidance before undertaking practical tasks.
  - Immediate, non-punitive feedback on practice attempts without waiting days for instructor availability.
  - Actionable, timestamped visual indicators showing exactly what went wrong (e.g., over-stripped wire length, loose screw).
  - Confidence that independent practice will not result in unsafe electrical habits.
- **Pain Points:**
  - Anxious about making dangerous mistakes or damaging workshop components.
  - Lacks immediate correction during practical lab hours when the instructor is attending to other students.
  - Frustrated by subjective or delayed grading that provides no actionable coaching.
- **Value Delivered:** Instant preliminary automated analysis, visual error bookmarks, transparent evaluation rubrics, and safe habit reinforcement.

### 2.2 Trainer (Vocational Instructor / Master Craftsperson)
- **Profile:** Certified vocational electrical instructor responsible for cohorts of 25–35 trainees per practical batch.
- **Primary Needs:**
  - Cohort-wide visibility into practical task performance and mastery velocity.
  - Automated triage to highlight trainees struggling with procedural or safety-critical defects.
  - High-efficiency grading tools that preserve full instructor control over final marks.
  - Persistent, auditable records of student attempts to support institutional grading moderation.
- **Pain Points:**
  - Overburdened by spending 80% of lab time policing basic repetitive errors.
  - Physically unable to monitor every student during critical manipulation phases (e.g., terminal connection, wire stripping).
  - Excessive manual grading time required to watch long, unedited student videos.
- **Value Delivered:** Pre-screened submissions with automated step markers, prioritized safety alert queues, one-click evaluation overrides, and $\ge 60\%$ reduction in grading time (< 2 minutes per submission).

### 2.3 Institution Administrator (Principal / Training Officer / DPO)
- **Profile:** ITI Principal, Polytechnic Head of Department, Academic Director, or Institutional Data Protection Officer (DPO).
- **Primary Needs:**
  - Standardized, objective grading metrics across diverse trainer cohorts and workshop sections.
  - Systematic tracking of cohort completion, certification velocity, and workshop safety incident rates.
  - Verifiable evidence records to satisfy vocational training board accreditation and compliance audits.
  - Adherence to data privacy, student consent, and media storage regulations.
- **Pain Points:**
  - Inconsistent evaluation standards and grading disparities among instructors.
  - Lack of demonstrable evidence during external vocational accreditation audits.
  - Risk of workshop safety violations and legal liabilities from undocumented safety checks.
- **Value Delivered:** Centralized compliance dashboards, safety incident frequency analytics, audit-ready submission archives, and transparent student consent management.

---

## 3. Goals and Non-Goals

### 3.1 Project Goals
1. **Asynchronous Workbench Practice Verification:** Enable trainees to record physical practice attempts using standard smartphones on de-energized practice boards and receive automated, step-level feedback within 5 minutes.
2. **Zero-Tolerance Safety Gatekeeping:** Implement a deterministic rule-based safety engine ensuring that any failure on a life-critical step (e.g., missing supply isolation, omitted earth termination, reverse polarity, dead short) immediately flags the submission as a **Safety Violation** and withholds a passing mark.
3. **High Scoring Concordance with Human Experts:** Achieve $\ge 85\%$ concordance (Cohen’s $\kappa \ge 0.75$) with certified electrical trainer consensus scores across validation benchmarks ($\ge 50$ videos).
4. **Zero Safety False Negatives:** Maintain a **0.00% False Negative Rate (FNR) on safety-critical steps**, defaulting ambiguous or occluded safety steps to `Inconclusive - Escalated to Trainer`.
5. **Trainer Grading Acceleration:** Accelerate human instructor review to **under 2 minutes per submission** ($\ge 60\%$ time savings compared to unassisted 6-minute raw video review).
6. **Hardware Accessibility:** Ensure successful recording, framing, and upload by $\ge 90\%$ of pilot trainees using standard budget smartphones without requiring expensive specialized equipment.

### 3.2 Explicit Non-Goals (Out of Scope for MVP)
To maintain engineering rigor, ensure user safety, and prevent scope creep, the following capabilities are **explicitly excluded** from the MVP:

| Excluded Item | Justification & Rationale |
| :--- | :--- |
| **Virtual Reality (VR) / AR Headsets** | Prohibitively expensive for standard vocational institutes; divorces trainees from real-world tactile tactile realities (wire stiffness, terminal torque, copper stripping resistance). |
| **2D / 3D Virtual Software Simulators** | Digital schematic drag-and-drop simulators already exist (e.g., Tinkercad). The core value of this product is evaluating real-world physical craftsmanship. |
| **Real-time Live Audio / Voice Coaching** | Latency and computational constraints on budget mobile edge hardware; noisy workshop environments make real-time edge audio guidance unreliable. |
| **Multiple Vocational Trades (Plumbing, Welding, etc.)** | Expanding beyond electrical wiring dilutes domain-specific model tuning, dataset quality, and rubric precision. MVP is strictly focused on Basic Electrical Wiring. |
| **3-Phase / Industrial High-Voltage (415V) Systems** | High liability risk; industrial switchgear requires dedicated physical safety interlocks beyond asynchronous video triage. |
| **Automated Physical Power Energization** | The system will **never** control physical relays, contactors, or circuit breakers to energize practice circuits automatically. Live energization must remain 100% human-supervised. |
| **Custom End-to-End Model Training from Scratch** | MVP leverages pretrained models with prompt optimization and a transparent rule-based scoring engine; custom neural network training is reserved for post-pilot phases. |

---

## 4. MVP Trade Scope: Basic Electrical Wiring

The MVP covers four foundational electrical wiring procedures under the Electrician vocational curriculum:

1. **`PROC-ELEC-01`: Single-Pole One-Way Switch Controlling a Batten Lamp**
   - *Focus:* Safe supply isolation, proper wire stripping without strand nicking, phase switching at common terminal, direct neutral routing to lamp, mechanical tug tests, and pre-energization continuity testing. (10 defined steps; 5 safety-critical).
2. **`PROC-ELEC-02`: Switch-Controlled 3-Pin Socket Outlet Installation**
   - *Focus:* Supply isolation, robust protective earthing (PE) termination to top earth pin, correct polarity (Phase to Switch, switched Phase to 'L', Neutral to 'N'), phase jumper loop fabrication, absence of exposed copper, and dead continuity verification. (9 defined steps; 6 safety-critical).
3. **`PROC-ELEC-03`: Two-Way Staircase Lighting Circuit Installation**
   - *Focus:* SPDT two-way switch terminal identification (Common, L1, L2), safe strapping/traveler method, strict avoidance of forbidden short-circuit (Carter) wiring, direct neutral routing, and comprehensive 4-state dead continuity verification. (10 defined steps; 6 safety-critical).
4. **`PROC-ELEC-04`: Dead-Circuit Safety Testing & Verification**
   - *Focus:* Systematic de-energized testing prior to energization: physical disconnection proof, multimeter inspection & correct jack selection (`COM` and `V/Ω`, avoiding `10A` short circuit), lead nulling, complete 3-way absence of voltage (P-N, P-E, N-E), protective earth path continuity (< 0.5Ω), switch & socket polarity checks, and high-resistance insulation / dead-short checks (> 20MΩ / OL). (10 defined steps; 8 safety-critical).

---

## 5. MVP Feature Specifications & Prioritization

Features are categorized using the MoSCoW prioritization framework:

### 5.1 Must Have (P0 - MVP Critical)

| Feature ID | Feature Name | Description & Functional Scope |
| :--- | :--- | :--- |
| **FEAT-01** | Role-Based Authentication & Profiles | JWT-based auth supporting three distinct roles: `LEARNER`, `TRAINER`, and `INSTITUTION_ADMIN`. Secure credential storage, institutional linking, and session persistence. |
| **FEAT-02** | Trainee Recording Consent Framework | Mandatory, plain-language consent agreement at registration and first upload. Immutable database logging of consent version, timestamp, IP address, and status. |
| **FEAT-03** | Procedure Catalog & Detail Briefing | Categorized procedure list (`PROC-ELEC-01` to `04`) with difficulty ratings, estimated times, required tool checklists, and prominent safety prerequisites. |
| **FEAT-04** | Asynchronous Video Upload Engine | Client-side video validation (MP4/WebM, max 250MB, recommended 1080p/720p, 5–8 min duration). Direct chunked upload to media storage with progress indicators. |
| **FEAT-05** | Pretrained AI Step-Detection Pipeline | Multi-stage analysis utilizing pretrained vision models to detect tool presence, wire strip quality, terminal insertion, and multimeter readings at step boundaries. |
| **FEAT-06** | Transparent Rule-Based Scoring Engine | Deterministic evaluation logic mapping detected visual cues to step rubrics (`CORRECT`, `INCORRECT`, `INCONCLUSIVE`). Strict safety rule: any safety-critical failure forces overall verdict to `SAFETY_VIOLATION`. |
| **FEAT-07** | Interactive Learner Feedback Report | Detailed report featuring an embedded video player with interactive timestamp pins, step-by-step pass/fail checklist, error tag explanations, and snapshot thumbnails. |
| **FEAT-08** | Trainer Review & Priority Triage Queue | Triage dashboard for instructors prioritizing submissions flagged with safety violations, followed by pending reviews and AI-passed submissions. |
| **FEAT-09** | Trainer Evaluation & Override Interface | Split-screen interface for trainers featuring synchronized video playback, speed controls (1x, 1.25x, 1.5x), step jump buttons, one-click AI score overrides, and written coaching feedback. |
| **FEAT-10** | Official Grade Finalization & Audit Trail | Recording official instructor verdicts (`COMPETENT`, `NOT_YET_COMPETENT`, `SAFETY_FAIL`) with immutable audit logging of overrides and review timestamps. |

### 5.2 Should Have (P1 - Fast Follow / Secondary Scope)

| Feature ID | Feature Name | Description & Functional Scope |
| :--- | :--- | :--- |
| **FEAT-11** | Interactive Filming Assistant | In-app 5-point pre-recording checklist modal (Mount, Frame, Light, Clean, Focus) to maximize recording compliance before file selection. |
| **FEAT-12** | Learner Practical Competency Transcript | Dedicated progress dashboard displaying module mastery percentages, cumulative safety compliance rating, and chronological attempt history. |
| **FEAT-13** | Institution Admin Safety & Velocity Dashboard | High-level KPI dashboard displaying enrolled trainees, submission volumes, first-time safety pass rates, and failure mode frequency charts. |
| **FEAT-14** | Standardized Error Tag Taxonomy Reporting | Categorized error tagging (`EXCESS_COPPER_EXPOSED`, `REVERSE_POLARITY`, `OMITTED_ISOLATION`, etc.) aggregated across batches to guide classroom remedial teaching. |

### 5.3 Later / Post-MVP (P2 - Future Roadmap)

| Feature ID | Feature Name | Description & Functional Scope |
| :--- | :--- | :--- |
| **FEAT-15** | Custom Domain Model Fine-Tuning | Fine-tuning domain-specific vision-language models on the 135+ annotated ITI workshop dataset acquired during Phase 1/2 pilots. |
| **FEAT-16** | Offline-First Progressive Web App (PWA) | Local offline caching of procedure instructions and local video recording buffer for workshops with intermittent connectivity. |
| **FEAT-17** | Practical Skills Portfolio PDF Export | One-click generation of verified, instructor-signed PDF skill certificates with QR-code links to validated submissions. |
| **FEAT-18** | Multi-Language Localization | Support for Hindi and major regional languages (e.g., Marathi, Tamil, Bengali) across learner interfaces and audio/video instructions. |
| **FEAT-19** | Multi-Trade Expansion | Extending taxonomy, rubrics, and video analysis pipelines to Plumbing (pipe fitting, pressure testing) and Welding. |

---

## 6. User Stories and Acceptance Criteria

### US-01: Trainee Enrollment & Recording Consent
- **As a** vocational electrical trainee,
- **I want to** register for an account linked to my training institute and review the video recording privacy policy,
- **So that** I understand how my practice recordings will be stored, evaluated, and protected before I participate.

#### Acceptance Criteria:
1. *Given* a trainee visits the `/register` screen, *When* they enter valid credentials, trainee roll number, and select their institution, *Then* the "Register" button remains disabled until the consent policy checkbox is checked.
2. *Given* the trainee clicks "Read Consent Policy", *When* the policy modal opens, *Then* it displays plain-language terms detailing active semester retention, access controls (learner, trainer, admin only), and right to withdraw consent without academic penalty.
3. *Given* the trainee checks consent and submits registration, *When* the account is created, *Then* an immutable `ConsentRecord` is generated with `consent_version`, `is_granted=True`, IP address, and timestamp.

---

### US-02: Pre-Practice Procedure Briefing & Safety Alerts
- **As a** vocational trainee,
- **I want to** inspect the detailed requirements, required tools, and safety warnings for `PROC-ELEC-02` (Switched Socket),
- **So that** I assemble all necessary equipment and observe mandatory isolation prerequisites before recording.

#### Acceptance Criteria:
1. *Given* a trainee navigates to `PROC-ELEC-02` detail screen, *When* the page loads, *Then* a prominent red safety alert banner is displayed warning that power supply must remain disconnected and proven dead.
2. *Given* the procedure detail view, *When* viewing the tools checklist, *Then* required tools (1000V pliers, wire stripper, multimeter, screwdrivers) are shown as distinct chips.
3. *Given* the step checklist, *When* viewing steps 1, 3, 4, 5, 6, and 9, *Then* each displays an unambiguous "Safety Critical" badge and an explanation of common pitfalls.
4. *Given* the trainee is ready, *When* they click "I Have My Tools Ready - Upload Practice Video", *Then* they are navigated to the `/upload?procedure=PROC-ELEC-02` screen.

---

### US-03: Video Practice Upload & Validation
- **As a** vocational trainee,
- **I want to** upload my continuous, unedited workbench wiring recording,
- **So that** the platform can verify my work and process it for feedback.

#### Acceptance Criteria:
1. *Given* a trainee accesses the video upload screen, *When* they select a video file, *Then* client-side validation checks that the file format is MP4 or WebM and file size is $\le 250\text{MB}$.
2. *Given* a video duration outside 4 to 10 minutes, *When* selected, *Then* a warning banner prompts the trainee to confirm the recording is a full, uncut attempt.
3. *Given* valid video selection, *When* the trainee clicks "Run AI Step Verification", *Then* an upload progress bar indicates progress from 0% to 100%, updates `PracticeSubmission.processing_status` to `UPLOADED`, and displays a waiting state.
4. *Given* upload completion, *When* background processing commences, *Then* the submission status transitions to `QUEUED` and then `PROCESSING`.

---

### US-04: Automated Step Evaluation & Safety Gatekeeping
- **As the** vocational training system,
- **I want to** evaluate submitted practice footage against step rubrics and enforce deterministic safety rules,
- **So that** trainees receive structured feedback and unsafe electrical executions are strictly prevented from passing.

#### Acceptance Criteria:
1. *Given* an uploaded video for `PROC-ELEC-01`, *When* processed through the rule engine, *Then* each of the 10 steps receives an `ai_status` of `CORRECT`, `INCORRECT`, or `INCONCLUSIVE`, accompanied by a confidence score (0.0 to 1.0) and timestamp interval.
2. *Given* a step where `is_safety_critical=True` (e.g., Step 4: Phase wire connection with >2mm exposed copper), *When* an error tag `EXCESS_COPPER_EXPOSED` is detected, *Then* that step status is set to `INCORRECT` and `overall_ai_verdict` is automatically forced to `SAFETY_VIOLATION`.
3. *Given* camera occlusion or visual ambiguity on any safety-critical step, *When* model confidence is $< 0.70$, *Then* the engine must assign `INCONCLUSIVE` and escalate to the trainer, never assigning `CORRECT`.
4. *Given* overall execution where all safety steps pass and procedural steps score $\ge 80\%$, *When* evaluated, *Then* the overall verdict is marked `PASS`.

---

### US-05: Learner Interactive Feedback Review
- **As a** vocational trainee,
- **I want to** view my evaluation report with synchronized video bookmarks and error descriptions,
- **So that** I understand exactly what mistakes occurred and how to correct them before practicing again.

#### Acceptance Criteria:
1. *Given* an analyzed submission, *When* the learner opens the feedback screen, *Then* the overall verdict banner (`Pass`, `Needs Practice`, or `Safety Violation Detected`) is prominently displayed at the top.
2. *Given* the embedded video player, *When* the learner clicks a colored timeline marker or step card at `02:45`, *Then* the video immediately seeks to that timestamp and begins playback.
3. *Given* an incorrect step (e.g., Step 3 in socket wiring), *When* expanded, *Then* it displays the detected error tag (`EXCESS_COPPER_EXPOSED`), hazard explanation ("Shock and short circuit risk"), and a captured frame snapshot.
4. *Given* a `SAFETY_VIOLATION` verdict, *When* viewed, *Then* the system presents a primary CTA "Re-Practice Procedure" and a secondary CTA "Submit to Instructor for Verification".

---

### US-06: Trainer Review Queue Prioritization
- **As a** vocational electrical instructor,
- **I want to** view an automatically prioritized queue of trainee submissions,
- **So that** I can triage high-risk safety violations immediately and manage class evaluations efficiently.

#### Acceptance Criteria:
1. *Given* a trainer logs into the platform, *When* they access the `/trainer/queue`, *Then* submissions are grouped into filter tabs: "All", "Safety Alerts", and "AI Passed".
2. *Given* submissions in the queue, *When* ordered by default, *Then* submissions with `overall_ai_verdict = SAFETY_VIOLATION` are pinned to the top with high-contrast red alert indicators.
3. *Given* a submission card, *When* viewed, *Then* it displays student name, roll number, procedure title, submission timestamp, AI verdict, and a prominent "Review Now" button.

---

### US-07: Trainer Evaluation, Score Override & Sign-Off
- **As a** vocational instructor,
- **I want to** review student video footage alongside pre-populated AI evaluations and adjust scores as needed,
- **So that** I can finalize official practical grades in under two minutes while maintaining complete human authority.

#### Acceptance Criteria:
1. *Given* a trainer opens a submission review, *When* the screen loads, *Then* it presents a split view: video player with speed controls (1x, 1.25x, 1.5x) and quick-jump buttons on the left, and interactive step rubrics on the right.
2. *Given* a step evaluated by AI as `INCORRECT`, *When* the instructor inspects the video segment and determines the termination is acceptable, *Then* clicking "Override to Pass" updates the step review, sets `trainer_override=True`, and records `is_overridden=True` on `TrainerReview`.
3. *Given* review completion, *When* the trainer selects the final grade (`COMPETENT`, `NOT_YET_COMPETENT`, `SAFETY_FAIL`), enters coaching remarks, and clicks "Finalize & Send Feedback", *Then* the database records the review, updates submission status to `REVIEWED`, and notifies the student.

---

### US-08: Institution Safety and Competency Audit
- **As an** institution administrator or training head,
- **I want to** monitor aggregate practical pass rates and safety failure frequencies across batches,
- **So that** I can ensure uniform grading standards and prepare audit reports for vocational accreditation.

#### Acceptance Criteria:
1. *Given* an administrator accesses `/admin/dashboard`, *When* viewing KPI summary cards, *Then* metrics display: Total Enrolled Trainees, Practical Exercises Logged, First-Time Safety Compliance Rate, and Average Instructor Review Time.
2. *Given* the error frequency analytics section, *When* filtered by trade module, *Then* a chart displays the most frequent failure tags (e.g., `EXCESS_COPPER_EXPOSED`, `LOOSE_TERMINATION`, `REVERSE_POLARITY`).
3. *Given* an accreditation audit request, *When* the administrator clicks "Export Accreditation Audit Report", *Then* a structured CSV/data export is generated containing anonymized trainee IDs, procedure codes, completion dates, AI verdicts, trainer sign-offs, and safety audit logs.

---

## 7. Success Metrics and Acceptance Benchmarks

To transition from Phase 1/2 pilot to institutional deployment, the platform must satisfy the following quantitative criteria:

| Metric Category | Specific Indicator | Target Threshold | Source of Truth / Measurement Method |
| :--- | :--- | :---: | :--- |
| **Scoring Concordance** | Overall Step Agreement | $\ge 85\%$ ($\kappa \ge 0.75$) | Consensus comparison across $\ge 50$ benchmark test videos annotated by 2 certified trainers (`docs/phase1/scope.md#L84`). |
| **Safety Reliability** | Safety-Critical False Negative Rate | **Exactly 0.00%** | Zero false passes on unsafe steps. Any visual ambiguity must default to `Inconclusive` (`docs/phase1/scope.md#L86`). |
| **Trainer Acceleration** | Average Review Duration | **$\le 2.0$ minutes** | Timed instructor evaluation per submission, representing $\ge 60\%$ reduction vs. unassisted raw video review. |
| **Feedback Latency** | Preliminary Feedback Turnaround | **$\le 5.0$ minutes** | Time elapsed from video upload completion to automated feedback report availability on 4G/broadband. |
| **Recording Usability** | First/Second Attempt Upload Success | $\ge 90\%$ | Percentage of pilot trainees successfully recording and uploading compliant footage via smartphone. |
| **User Satisfaction** | Trainer Trust & Usability Rating | $\ge 80\%$ positive | Standardized post-pilot exit survey administered to participating vocational instructors. |

---

## 8. Risks and Mitigation Strategies

| Risk Description | Severity | Probability | Mitigation Strategy |
| :--- | :---: | :---: | :--- |
| **Camera Occlusion & Blur:** Trainee hands, forearms, or tools block the camera view during critical terminal screw tightening or multimeter checks. | High | High | Enforce 35°–45° overhead camera angle in `filming-guidelines.md`; mandate the "2-second inspection hold" after wire stripping and screw tightening; configure scoring engine to treat obscured safety steps as `INCONCLUSIVE` rather than guessing. |
| **False Negative on Safety Violation:** Pretrained model fails to detect an over-stripped wire or reversed polarity, presenting a dangerous false pass. | Critical | Low | Implement deterministic multi-stage rule engine; hardcode high sensitivity thresholds on safety steps; enforce mandatory trainer review on all initial attempts; flag any confidence score $< 0.70$ for human review. |
| **Workshop Bandwidth Bottlenecks:** Multiple students uploading 250MB 1080p video files simultaneously overwhelm rural/semi-urban ITI internet connections. | High | Medium | Enforce 1080p/720p 30fps limits (forbidding 4K); implement client-side video compression and chunked/resumable upload pipelines; encourage staged or overnight batch uploading during lab sessions. |
| **Trainer Resistance or Apprehension:** Instructors perceive AI system as surveillance, automated replacement, or an extra administrative burden. | Medium | Medium | Design UI explicitly as an *instructor assistant* that eliminates mundane triage; emphasize that trainers retain 100% authority over official grades and overrides; highlight $\ge 60\%$ time savings in training briefings. |
| **Student Privacy & Media Compliance Concerns:** Concerns regarding the capture and storage of student likenesses and workshop video footage. | High | Low | Implement explicit plain-language consent framework (`consent-and-privacy.md`); store videos in encrypted private object storage; enforce strict RBAC; mandate facial de-identification/deletion after the academic audit window. |

---

## 9. Assumptions and Dependencies

### 9.1 Technical Assumptions
1. **Device Availability:** Trainees have access to budget Android smartphones (running Android 10+ with minimum 720p/1080p video recording at 30fps).
2. **Workshop Physical Infrastructure:** Partner ITIs provide stable workbench mounting fixtures (clamps, desktop stands) and adequate overhead illumination ($\ge 300\text{ lux}$) to prevent harsh shadows.
3. **De-Energized Practice Boards:** All physical wiring exercises evaluated by video are performed on completely de-energized, disconnected practice boards. No live mains voltage is present during student recording.
4. **Pretrained Inference Capability:** Pretrained computer vision and multimodal models (e.g., YOLO-based object detectors, OCR engines for multimeter displays, and multimodal LLMs) can reliably extract tool presence and state cues without requiring initial ground-up neural network training.

### 9.2 Dependencies
- **Backend Infrastructure:** PostgreSQL 16+, Redis, Celery task workers for asynchronous video processing, and Django 6.1 REST Framework.
- **Frontend Infrastructure:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Axios client with JWT interceptors.
- **UI Prototyping:** Screen specifications developed via Stitch AI prompts, converted into modular, accessible React components.
- **Pilot Partners:** Active collaboration with 2–3 regional ITIs to collect the 120–150 video pilot benchmarking dataset specified in `data-plan.md`.

---

## 10. Open Questions and Items Marked "TO CONFIRM"

The following open questions require empirical validation or formal sign-off during Phase 2 development:

1. **Regional Electrical Wiring Standards & Clause References [TO CONFIRM]:**
   - While the physical safety rules (isolation, earthing, polarity, strand integrity) are universal engineering principles, the formal regulatory clause citations (e.g., National Electrical Code / IS 732 / IEC 60364 / BS 7671) must be formally reviewed and confirmed by a certified regional electrical syllabus committee prior to institutional certification.
2. **Workshop Network Bandwidth at Partner ITIs [TO CONFIRM]:**
   - The actual uplink bandwidth across target government ITI workshops must be empirically measured to determine whether 250MB video files can upload reliably without queue congestion, or if client-side transcode down to 720p/1Mbps must be mandated as the default.
3. **Institutional Data Protection Officer (DPO) Legal Sign-off [TO CONFIRM]:**
   - The draft consent policy in `consent-and-privacy.md` must receive formal review and sign-off from legal counsel or the institutional DPO of participating polytechnics prior to onboarding non-pilot trainees.
4. **Pretrained Model Pipeline Latency & Hosting Infrastructure [TO CONFIRM]:**
   - The hosting topology (local GPU workstation vs. cloud inference worker) and exact inference latency for 6-minute video processing must be benchmarked against the 5-minute feedback turnaround target during initial integration testing.
5. **Standardized Practice Board Dimensions & Component Tolerances [TO CONFIRM]:**
   - Workbench practice board dimensions, modular plate mounting standards, and wire manufacturer color consistency across participating ITI partner labs must be cataloged to calibrate bounding box aspect ratios and computer vision color segmentation thresholds.
