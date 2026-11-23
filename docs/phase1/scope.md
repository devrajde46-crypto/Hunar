# Phase 1: Scope & Objectives

**Project Name:** Hunar  
**Document Version:** 1.0 (Phase 1 MVP)  
**Status:** Approved for MVP Architecture  
**Target Trade:** Basic Electrical Wiring (Domestic / Light Commercial)  

---

## 1. Problem Statement

Vocational education and training in technical crafts (such as electrician trades under ITI curricula) is fundamentally hands-on. However, vocational institutions face chronic operational constraints:

1. **High Student-to-Trainer Ratios:** Workshops frequently operate at 25:1 to 35:1 student-to-trainer ratios. A single instructor cannot observe 30 simultaneous wiring exercises at individual workbenches.
2. **Delayed Feedback on Hidden Errors:** Errors such as improper wire stripping (nicking copper strands), incorrect terminal torque, reverse polarity, or failure to verify supply isolation are often only detected during post-exercise testing—or worse, go unnoticed if circuits function despite unsafe execution.
3. **Safety Hazards:** In electrical wiring, procedural sequence is life-critical. Touching conductors before verifying that the circuit is dead or omitting grounding conductors creates immediate electrocution and fire hazards.
4. **Subjective & Unrecorded Assessments:** Practical assessments rely on brief, unstandardized visual inspections at the end of class with no persistent audit trail of how the student executed each physical step.

**Hunar** solves this by providing automated, asynchronous step-by-step verification of recorded practice attempts. Trainees record their physical workbench exercises using standard smartphones; the AI pipeline analyzes the video, detects procedural and safety-critical steps, timestamps errors, and assists human trainers in delivering fast, objective, and auditable feedback.

---

## 2. Target Users & User Personas

| User Role | Primary Needs | Key Pain Points | Value Delivered by MVP |
| :--- | :--- | :--- | :--- |
| **Learner (Trainee)** | Instant feedback on practice tasks; clear step guidance; objective grading without waiting days for instructor attention. | Nervous about making safety mistakes; lacks immediate correction when practicing independently. | Immediate preliminary feedback on video upload; timestamped highlights showing exactly where errors occurred; safe habit reinforcement. |
| **Trainer (Instructor)** | Oversight of class-wide practical performance; triage mechanism to identify struggling students; audit trail for assessments. | Spends 80% of lab time policing basic mistakes; unable to monitor 30 students simultaneously; repetitive manual grading. | Pre-screened submissions; automated detection of procedural & safety errors; 60%+ reduction in grading time via pre-filled rubrics. |
| **Institution Admin** | Accreditation compliance; cohort completion tracking; workshop safety incident minimization; standardized grading metrics. | Inconsistent grading standards across instructor cohorts; lack of verifiable evidence for practical exams. | Standardized assessment records; cohort-level competency analytics; safety compliance audit trails. |

---

## 3. MVP Scope: Basic Electrical Wiring

The Phase 1 MVP is strictly bounded to foundational single-phase electrical wiring tasks:

### 3.1 What is IN the MVP

1. **Single MVP Trade:** Basic Electrical Wiring (domestic switch, socket, and lighting control circuits).
2. **Four Standard Procedures:**
   - Single-Pole Switch Controlling a Lamp (`PROC-ELEC-01`)
   - Switched 3-Pin Socket Outlet Installation (`PROC-ELEC-02`)
   - Two-Way Staircase Lighting Circuit (`PROC-ELEC-03`)
   - Dead-Circuit Safety Testing & Continuity Verification (`PROC-ELEC-04`)
3. **Asynchronous Video Upload & Processing:**
   - Trainee records practice on a standard workbench practice board using a mobile phone.
   - Video upload through web interface (MP4/WebM, up to 1080p, 5–8 minutes max).
4. **Automated Multi-Step Verification:**
   - Identification of key steps (e.g., tool selection, cable preparation, conductor insertion, screw tightening, dead-test verification).
   - Step classification: `Correct`, `Incorrect`, or `Inconclusive/Unobserved`.
   - Error tagging (e.g., excessive copper exposure, strand nicking, loose terminal, reverse polarity).
5. **Safety-Critical Gatekeeping:**
   - Dedicated rule engine: any failure on a designated safety-critical step immediately flags the submission as **Safety Violation**, withholding a passing mark regardless of overall task completion.
6. **Human-in-the-Loop Trainer Review:**
   - Trainer dashboard with an evaluation queue.
   - Video player with AI step markers, pre-scored checklists, and one-click override/confirmation.
7. **Role-Based Web Interface:**
   - Distinct, mobile-first responsive interfaces for Learners, Trainers, and Institution Administrators.
8. **Audit Trail & Consent Management:**
   - Explicit trainee recording consent records linked to user profiles.

---

### 3.2 What is EXPLICITLY OUT of the MVP

To maintain high technical quality, avoid premature complexity, and respect hardware constraints, the following features are strictly excluded from Phase 1 and Phase 2 MVP:

| Excluded Feature | Reason for Exclusion |
| :--- | :--- |
| **Virtual Reality (VR) / AR Headsets** | Cost-prohibitive for government/budget ITIs; removes the critical physical tactile reality of stripped copper, terminal torque, and wire stiffness. |
| **2D / 3D Virtual Software Simulators** | Digital schematic drag-and-drop simulators already exist (e.g., Tinkercad). The unique value of this product is evaluating **real-world physical workbench manipulation**. |
| **Real-time Live Audio/Voice Coaching** | Unreliable on budget smartphones and noisy workshop environments; high-latency edge inference exceeds MVP feasibility. |
| **Multiple Trades (Plumbing, Welding, etc.)** | Deep domain-specific computer vision modeling is required per trade. Expanding early fragments dataset quality and model accuracy. |
| **3-Phase / Industrial High-Voltage Wiring** | Severe safety liability; live 415V industrial switchgear requires dedicated physical supervisory protocols beyond asynchronous video triage. |
| **Automated Physical Power Energization** | The system will never control physical relays or breakers to automatically energize circuits. Live testing must remain human-supervised. |

---

## 4. Success Criteria

The MVP will be deemed successful and ready for full training deployment when it satisfies the following verifiable benchmarks during pilot trials:

### 4.1 AI Scoring Accuracy & Agreement
- **Overall Step Concordance:** AI step-level scoring must achieve at least **85% agreement** (Cohen’s $\kappa \ge 0.75$) with consensus scores from a panel of two certified electrical trainers across a validation set of $\ge 50$ benchmark videos.
- **Strict Zero-Tolerance Safety Criticality:** **0% false negative rate on safety-critical steps.**
  - If a learner executes a safety-critical step unsafely (e.g., skipping dead-circuit testing, leaving exposed live copper outside a terminal, failing to terminate protective earth), the AI system **must never score it as "Correct"**.
  - In cases of visual ambiguity or camera occlusion on safety-critical steps, the system must default to `Inconclusive - Escalated to Trainer` rather than `Pass`.

### 4.2 Operational Efficiency
- **Trainer Review Acceleration:** Certified trainers evaluate student practical submissions in **under 2 minutes per submission** using pre-populated AI markers, representing a **$\ge 60\%$ reduction** in grading time compared to reviewing 6-minute raw videos unassisted.
- **Feedback Turnaround Time:** Preliminary automated feedback delivered to the learner within **5 minutes** of video upload completion on standard 4G/broadband connections.

### 4.3 Practical Usability & Completion
- **Upload & Usability Success:** At least **90% of pilot learners** successfully record, frame, and upload their practice videos using standard budget Android smartphones on their first or second attempt following the filming guidelines.
- **Trainer Satisfaction:** Over **80% positive rating** on ease-of-use and grading trust during exit surveys with participating workshop instructors.
