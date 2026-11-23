# UI Screen Specifications & Stitch AI Generation Prompts

**Project:** Hunar  
**Document Status:** Approved for Frontend Design (Phase 2)  
**Style System:** Clean, mobile-first, accessible (WCAG AA), high contrast, professional vocational education aesthetic (Tailwind Slate / Indigo / Emerald / Rose palette).

---

## 1. Global Design System Rules (For All Screens)

When generating UI prototypes using Stitch AI or React Tailwind components, use these consistent tokens:
- **Layout & Viewport:** Mobile-first responsive layout (375px base width, smoothly expanding to tablet and desktop). Minimum touch target size 48px × 48px.
- **Color Palette:**
  - Background: Neutral White (`#FFFFFF`) / Slate 50 (`#F8FAFC`) with subtle Slate 200 borders (`#E2E8F0`).
  - Brand Primary: Deep Indigo (`#4338CA` / `bg-indigo-700`) for primary buttons and active tabs.
  - Safe / Pass: Emerald Green (`#059669` / `bg-emerald-600`) for correct steps and passing grades.
  - Danger / Safety Fail: Vivid Crimson (`#DC2626` / `bg-rose-600`) for safety alerts and violations.
  - Warning / Inconclusive: Amber (`#D97706` / `bg-amber-600`) for items needing review.
  - Text: Slate 900 (`#0F172A`) for headings, Slate 600 (`#475569`) for body text.
- **Typography:** Modern clean sans-serif (Inter or system sans), clear font weight hierarchy (`font-bold`, `font-semibold`, `font-normal`).
- **Accessibility:** Explicit label associations, visible focus outlines (`ring-2 ring-indigo-500`), and semantic HTML badges.

---

## 2. Screen Specifications & Stitch AI Prompts

### Screen 1: Login
- **Purpose:** Secure authentication for learners, trainers, and administrators.
- **Key Elements:** App logo and title ("Hunar"), email/username input, password input with show/hide toggle, role indicator helper, "Sign In" button, "Forgot Password" link, link to Register.
- **User Actions:** Enter credentials, submit form, navigate to registration or password recovery.
- **Stitch AI Prompt:**
```text
Create a clean, mobile-first Login screen for the "Hunar" web app using Tailwind CSS. Use a minimalist slate-50 background. Centered card on a subtle white background with rounded-2xl corners, soft drop shadow, and a 1px slate-200 border. At the top, include an electrical bolt icon inside an indigo-100 rounded badge, followed by the title "Vocational Trainer" in font-bold text-slate-900 and subtitle "Sign in to your training portal" in text-slate-500. Include form fields for Email Address and Password with clean slate-100 borders and focus:ring-2 focus:ring-indigo-600. Add a password visibility toggle icon. Include a prominent full-width "Sign In" button (bg-indigo-700 text-white font-medium py-3 rounded-xl hover:bg-indigo-800 transition). Below, include links for "Forgot password?" and "Don't have an account? Register with your Institution ID".
```

---

### Screen 2: Register
- **Purpose:** Trainee enrollment and institutional linking with consent prompt.
- **Key Elements:** Full Name, Trainee/Roll ID, Email, Password, Institution Selector dropdown, Trade selection badge ("Electrician"), consent checkbox ("I agree to record practice videos for evaluation"), "Create Account" button.
- **User Actions:** Fill personal and institutional details, acknowledge consent, submit registration.
- **Stitch AI Prompt:**
```text
Create a mobile-friendly Registration screen for the "Hunar" using Tailwind CSS. Clean, spacious layout on a slate-50 background. Include a top back-arrow button to return to Login. Title: "Create Trainee Account" with subtitle "Join your institution's electrical workshop portal". Form fields: Full Name, Trainee Roll Number, Institutional Email, and Password with validation indicators. Include an Institution dropdown selector and a pre-selected badge for Trade: "Electrician (Basic Wiring)". Include a highlighted card with an info icon containing a checkbox: "I agree to the Video Recording & Practice Evaluation Consent Policy" with a modal link to read the full policy. A primary full-width button "Register & Start Training" in bg-indigo-700 with rounded-xl padding.
```

---

### Screen 3: Learner Dashboard
- **Purpose:** Home screen for trainees showing current progress, upcoming practical assignments, and recent submission status.
- **Key Elements:** Greeting header with trainee name, quick-stat cards (Completed Procedures, Current Safety Rating, Pending Feedback), "Current Module" card with progress bar, "Continue Practice" CTA button, recent submissions list with status badges (`Pass`, `Needs Practice`, `Safety Alert`).
- **User Actions:** Tap to view procedures, resume current exercise, view detailed feedback on past attempts.
- **Stitch AI Prompt:**
```text
Create a modern mobile-first Learner Dashboard for the "Hunar" in Tailwind CSS. Top app bar with learner avatar, notification bell, and greeting "Hello, Devraj" with subtitle "Batch ELEC-2026 • Govt ITI". Top stat row with 3 cards: "Procedures Completed: 3/4", "Safety Score: 100%", and "Pending Review: 1". Featured hero card with an indigo-gradient background: "Active Module: Switch & Socket Installation", showing an 75% progress bar and a white CTA button "Continue Procedure". Below, section titled "Recent Practice Submissions" displaying a list of 3 items: each item shows procedure title, date, thumbnail preview, and a pill badge: one green "Pass (AI Verified)", one amber "Trainer Review Pending", and one red "Safety Violation Detected". Bottom navigation bar with 4 tabs: Dashboard, Procedures, Progress, Profile.
```

---

### Screen 4: Procedure List
- **Purpose:** Catalog of available electrical wiring procedures within the trade module.
- **Key Elements:** Module filter header, procedure cards showing code (`PROC-ELEC-01`), title, estimated time (e.g., 20 mins), difficulty tag (`Beginner`), completion checkmark, safety badge.
- **User Actions:** Filter/search procedures, tap a procedure card to open details.
- **Stitch AI Prompt:**
```text
Design a mobile Procedure Catalog screen for an electrical vocational training app using Tailwind CSS. Sticky top header with search input and horizontal filter chips: "All", "Lighting Circuits", "Sockets & Power", "Testing & Safety". The list displays cards for 4 procedures:
1. PROC-ELEC-01: Single-Pole Switch & Lamp (Beginner • 20 mins • Completed checkmark)
2. PROC-ELEC-02: Switch-Controlled Socket Outlet (Intermediate • 25 mins • Start Practice button)
3. PROC-ELEC-03: Two-Way Staircase Circuit (Intermediate • 30 mins)
4. PROC-ELEC-04: Dead-Circuit Safety Testing (Beginner • 20 mins • Safety Shield icon)
Each card features clear typography, a subtle slate-200 border, difficulty badge, clock icon with time estimate, and a Chevron-right indicator. Clean, high-contrast, touch-accessible cards.
```

---

### Screen 5: Procedure Detail
- **Purpose:** Pre-practice briefing screen detailing objectives, required tools, safety precautions, and step-by-step checklist.
- **Key Elements:** Procedure title and code, safety warning banner ("Supply must remain isolated"), Tools & Materials horizontal list/chips, collapsible step breakdown checklist (identifying safety-critical steps with red shield icons), "Record / Upload Practice Video" sticky bottom button.
- **User Actions:** Review required tools, inspect safety rules, launch camera/upload screen.
- **Stitch AI Prompt:**
```text
Create an accessible mobile Procedure Detail screen for "PROC-ELEC-02: Switch-Controlled Socket Outlet" in Tailwind CSS. Top navigation with back button and share icon. Prominent red-50 safety alert banner at top with a warning triangle: "CRITICAL: Power supply must remain disconnected and proven dead with multimeter before starting work." Section for "Required Tools & Materials" displaying clean icon pills: 1000V Pliers, Wire Stripper, Multimeter, 16A Socket, Modular Switch. Section for "Step-by-Step Procedure Checklist" with 9 numbered items. Steps 1, 3, 4, 6, and 9 display a prominent red pill badge "Safety Critical". Each step item shows step ID, title, and expand arrow. Fixed bottom bar with a full-width high-contrast button: "I Have My Tools Ready - Upload Practice Video" (bg-indigo-700 text-white py-3.5 rounded-xl font-semibold).
```

---

### Screen 6: Video Upload
- **Purpose:** Guidance and upload interface for recording or selecting a practice video.
- **Key Elements:** Filming reminders checklist (Landscape, Mounted, Bright Light, 2-Sec Inspection Hold), drag-and-drop or tap-to-select video zone, selected file preview thumbnail, file size & duration validator, "Start AI Analysis" button with upload progress bar.
- **User Actions:** Review filming tips, choose video file from device, start upload, monitor progress.
- **Stitch AI Prompt:**
```text
Create a mobile-first Video Upload screen for the "Hunar" using Tailwind CSS. Header: "Submit Practice Recording" for PROC-ELEC-02. Top collapsible accordion titled "Quick Filming Checklist" with 4 checked items: "Landscape mode", "Phone mounted on stand", "Terminals brightly lit", "Uncut 5-8 min video". Central interactive upload zone with a dashed indigo-300 border, cloud upload icon, text "Tap to record or select MP4/WebM video", and helper text "Max size: 250MB • 1080p recommended". Below the upload zone, show an uploaded video card preview with filename "socket_practice_devraj.mp4", size "84.2 MB", duration "6m 12s", and a green checkmark. An active upload progress bar at 100% with text "Upload complete. Ready for analysis". A prominent primary button "Run AI Step Verification" in bg-indigo-700 text-white py-3.5 rounded-xl.
```

---

### Screen 7: Feedback Result
- **Purpose:** Interactive evaluation report showing AI verdicts, timestamped video bookmarks, and safety notices.
- **Key Elements:** Overall verdict banner (`Pass`, `Needs Practice`, or `Safety Violation`), embedded video player with interactive timeline pins, step-by-step rubric breakdown with status pills (`Pass`, `Fail`, `Inconclusive`), expandable step cards showing AI feedback and detected error tags, "Request Trainer Review" button.
- **User Actions:** Tap timeline markers to jump video to specific steps, read feedback per step, submit for trainer re-check.
- **Stitch AI Prompt:**
```text
Design a comprehensive mobile-friendly Feedback Result screen for a completed electrical wiring attempt in Tailwind CSS. Top banner: Red-100 background with dark red border and icon displaying "Verdict: Safety Violation Detected - Re-practice Required". Below banner, an interactive video player container with playback controls and a custom timeline scrubber displaying colored marker pins corresponding to steps (green dots for correct steps, red dot at 02:45 for mistake). Below video, "Step Analysis Rubric":
- Step 1: Supply Isolation (Green checkmark • Correct • 00:15)
- Step 3: Earth Conductor Termination (Red warning icon • Incorrect • 02:45) -> Expanded card showing: "Error Tag: Excess Copper Exposed (> 5mm bare wire outside terminal shroud). Risk: Shock hazard." Includes a snapshot thumbnail of the error.
- Step 4: Neutral Conductor Termination (Green checkmark • Correct • 03:10)
Bottom floating action button: "Submit to Instructor for Verification".
```

---

### Screen 8: Trainer Review Queue
- **Purpose:** Workflow queue for instructors to review pending student submissions, prioritized by safety flags.
- **Key Elements:** Filter tabs ("Needs Attention / Safety Flags", "Pending Review", "Completed"), search bar by student name or roll number, submission cards displaying student name, batch, procedure, submission timestamp, AI suggested verdict, and a "Review" button.
- **User Actions:** Filter by priority, select a submission to evaluate.
- **Stitch AI Prompt:**
```text
Create a clean, efficient Trainer Review Queue screen for desktop and tablet in Tailwind CSS. Top header: "Practical Assessment Queue" with badge "8 Pending Submissions". Filter tabs: "All (8)", "Safety Alerts (3)", "AI Passed (5)". Search bar: "Search by student name or roll number...". The queue displays a table/card list:
- Card 1 (High Priority Red Border): Student "Devraj Sharma (TRN-045)", Procedure "PROC-ELEC-02 (Socket Wiring)", Submitted "15 mins ago", AI Verdict: "Safety Alert: Excess Copper Exposed", Button: "Review Now (2 min triage)" in bg-rose-600 text-white.
- Card 2: Student "Pooja Patel (TRN-022)", Procedure "PROC-ELEC-01 (Switch & Lamp)", Submitted "1 hour ago", AI Verdict: "Passed (9/9 Steps)", Button: "Quick Approve" in bg-emerald-600 text-white.
Clean tabular layout with avatar, timestamp, status tags, and action buttons.
```

---

### Screen 9: Trainer Review Detail
- **Purpose:** Instructor grading interface with synchronized video playback, side-by-side AI rubric, and one-click override controls.
- **Key Elements:** Split layout (video player on left/top, step checklist on right/bottom), timestamp jump buttons, toggle switches to override AI pass/fail for each step, instructor comment box, final grade selector (`Competent`, `Not Yet Competent`, `Safety Fail`), "Finalize & Send Feedback" button.
- **User Actions:** Watch video at flagged timestamps, adjust step scores, type personalized coaching notes, submit official grade.
- **Stitch AI Prompt:**
```text
Design a desktop/tablet split-screen Trainer Review Detail interface in Tailwind CSS. Left side (60% width): Large video player with playback speed controls (1x, 1.25x, 1.5x) and timestamp jump buttons ("Jump to Step 3 Error [02:45]"). Right side (40% width): Interactive grading panel. Student info header: "Devraj Sharma • PROC-ELEC-02". Scrollable step list:
Step 3: Protective Earth Termination. AI Verdict: "Incorrect". Side-by-side trainer radio buttons: [Confirm Fail] [Override to Pass]. Text input for trainer note: "Trim 4mm off the copper before inserting into earth terminal."
Bottom panel: Final Verdict selector with 3 pill buttons: [Competent] [Not Yet Competent] [Safety Fail (Selected)]. Large text area for "Instructor Coaching Summary". Bottom sticky action bar with "Save Draft" and "Finalize & Send Feedback to Student" (bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl).
```

---

### Screen 10: Learner Progress
- **Purpose:** Long-term skill tracking and competency transcript for trainees.
- **Key Elements:** Learner profile card, overall competency percentage dial, module completion cards with progress bars, safety compliance badge, historical submission log with grades and trainer notes.
- **User Actions:** Review mastered skills, identify areas needing practice, download printable competency summary.
- **Stitch AI Prompt:**
```text
Create a motivating mobile-friendly Learner Progress & Competency screen in Tailwind CSS. Top card: Student profile with photo, name "Devraj Sharma", trade "Electrician Level 1", and a circular progress ring showing "75% Practical Competency". Section for "Safety Record": Gold shield badge with "100% Zero-Defect Post-Correction Record". Middle section: "Module Competencies" with 4 progress bars:
1. Single Pole Lighting: 100% Mastered (Green bar)
2. Socket Installation: 70% In Progress (Amber bar)
3. Two-Way Staircase: 50% In Progress
4. Dead-Circuit Testing: 100% Mastered
Bottom list: "Recent Certified Tasks" showing verified timestamps, instructor signatures, and a secondary outline button "Export Practical Skills Portfolio (PDF)".
```

---

### Screen 11: Institution Dashboard
- **Purpose:** Executive oversight for institution principals, department heads, and training officers.
- **Key Elements:** High-level KPI cards (Total Enrolled Trainees, Overall Practical Pass Rate, Safety Violation Incident Rate, Avg Feedback Turnaround Time), trade comparison charts, instructor activity table, batch compliance export button.
- **User Actions:** Filter by batch or academic term, monitor safety incident trends, export accreditation compliance reports.
- **Stitch AI Prompt:**
```text
Create a professional, data-dense Institution Admin Dashboard for vocational training centers in Tailwind CSS. Top navigation bar with institution logo "Govt Industrial Training Institute", term selector dropdown "Academic Year 2026 - Term 1", and "Export Accreditation Audit Report" button.
Top row of 4 KPI metric cards:
1. "Enrolled Trainees": 142 (Active in 6 Batches)
2. "Practical Exercises Logged": 586 submissions
3. "First-Time Safety Compliance": 88.4% (+4.2% vs last month)
4. "Avg Instructor Review Time": 1.8 mins / video
Middle section: Two charts side-by-side:
- Left: "Step Failure Frequency by Trade Module" (bar chart showing top failure modes: Over-stripping copper, Loose screw torque, Reversed polarity).
- Right: "Batch Practical Velocity & Completion".
Bottom section: "Instructor Triage Activity" table showing Trainer Name, Batches Assigned, Submissions Reviewed, and Average Feedback Turnaround Time. Clean, high-contrast, modern institutional design.
```
