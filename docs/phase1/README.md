# Phase 1 Documentation Index: Scope, Design & Data Plan

**Project:** Hunar  
**Phase:** Phase 1 (MVP Foundation, Trade Scoping, and Architecture Design)  
**Trade Focus:** Basic Electrical Wiring (Switch, Socket & Dead Circuit Verification)  

---

## 1. Document Index

| Document | Description | Direct Link |
| :--- | :--- | :--- |
| **Project Scope & Objectives** | Problem statement, target personas, MVP trade scope, in/out boundaries, and quantitative success criteria. | [scope.md](file:///C:/dev/vocational-trainer/docs/phase1/scope.md) |
| **Procedure 01: Switch & Lamp** | Step-by-step checklist for single-pole switch controlling a batten lamp with visual cues and safety markers. | [01-single-pole-switch-and-lamp.md](file:///C:/dev/vocational-trainer/docs/phase1/procedures/01-single-pole-switch-and-lamp.md) |
| **Procedure 02: Switched Socket** | Step-by-step checklist for wiring a switch-controlled 3-pin socket with protective earthing and polarity verification. | [02-switch-controlled-socket-outlet.md](file:///C:/dev/vocational-trainer/docs/phase1/procedures/02-switch-controlled-socket-outlet.md) |
| **Procedure 03: Staircase Circuit** | Step-by-step checklist for two-way lighting control using SPDT switches and safe traveler wiring. | [03-staircase-wiring-two-way-control.md](file:///C:/dev/vocational-trainer/docs/phase1/procedures/03-staircase-wiring-two-way-control.md) |
| **Procedure 04: Dead Testing** | Step-by-step checklist for de-energized isolation, continuity, polarity, and insulation resistance checks. | [04-dead-circuit-testing-and-verification.md](file:///C:/dev/vocational-trainer/docs/phase1/procedures/04-dead-circuit-testing-and-verification.md) |
| **Filming Guidelines** | Practical rules for learners recording practice videos (mounting, framing, lighting, 2-sec hold, phone checklist). | [filming-guidelines.md](file:///C:/dev/vocational-trainer/docs/phase1/filming-guidelines.md) |
| **Consent & Privacy Policy** | Plain-language data consent policy covering video storage, access control, retention, and withdrawal rights. | [consent-and-privacy.md](file:///C:/dev/vocational-trainer/docs/phase1/consent-and-privacy.md) |
| **Data & Benchmarking Plan** | Dataset acquisition strategy, pilot targets (120-150 videos), annotation taxonomy, and accuracy benchmarks. | [data-plan.md](file:///C:/dev/vocational-trainer/docs/phase1/data-plan.md) |
| **Django Data Model** | Proposed relational data architecture for Phase 2 with Mermaid ER diagram and field definitions (Design Only). | [data-model.md](file:///C:/dev/vocational-trainer/docs/phase1/data-model.md) |
| **UI Screen Specs & Prompts** | 11 screen specifications with purpose, elements, actions, and ready-to-paste Stitch AI prompts. | [screens.md](file:///C:/dev/vocational-trainer/docs/phase1/screens.md) |

---

## 2. Phase 1 Checklist

### What is Completed (Phase 1 Deliverables)
- [x] Defined core trade scope, user personas, and strict exclusion boundaries in `scope.md`.
- [x] Established quantitative success criteria (85% concordance, 0% safety-critical false negatives, 60% instructor time savings).
- [x] Created 4 detailed, standardized electrical wiring procedures with step IDs, visual evidence cues, safety criticality flags, and common mistakes in `procedures/`.
- [x] Formulated student-friendly, phone-focused recording and framing guidelines with a 5-point checklist in `filming-guidelines.md`.
- [x] Drafted a transparent, plain-language video recording consent and data privacy framework in `consent-and-privacy.md`.
- [x] Outlined video dataset acquisition, trainer annotation protocol, error tagging taxonomy, and benchmark validation splits in `data-plan.md`.
- [x] Designed the full Django ORM schema (10 entities) and Mermaid ER diagram for Phase 2 implementation in `data-model.md`.
- [x] Authored 11 mobile-first UI screen specifications with complete, ready-to-paste Stitch AI prompts in `screens.md`.

### What Still Needs Human / Expert Review
- [ ] **Electrical Safety Trainer Review:** A certified vocational electrical instructor must review the 4 procedures in `procedures/` against the regional syllabus, local wire color codes, and electrical code standards.
- [ ] **Institutional Legal / DPO Review:** Institutional legal counsel or Data Protection Officer must review and approve `consent-and-privacy.md` before real trainee enrollment.
- [ ] **Workshop Feasibility Check:** Practical instructors must verify that the workbench phone mounting and lighting recommendations in `filming-guidelines.md` are workable in actual partner ITI workshop environments.
- [ ] **Pilot Partner Data Agreement:** Formalize the video recording protocol with participating ITIs/polytechnics according to `data-plan.md`.
