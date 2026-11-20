# Phase 1 Data Plan: Video Dataset Acquisition, Labeling & Benchmarking

**Project:** AI Vocational Skills Trainer  
**Document Version:** 1.0  
**Target Trade:** Basic Electrical Wiring (Switch, Socket & Dead Circuit Testing)  

---

## 1. Dataset Acquisition Strategy

To build an accurate and robust AI step-verification pipeline, the training and evaluation dataset must reflect realistic workshop conditions across diverse environments.

### 1.1 Source Channels
1. **Partner Vocational Training Institutes (ITIs / Polytechnics):**
   - Partner with 2–3 regional Industrial Training Institutes (ITIs) running electrician trades.
   - Record practical laboratory sessions during standard practical curriculum modules.
2. **Certified Electrical Trainers (Gold Standard):**
   - Certified instructors perform ideal "benchmark" executions of each procedure to establish baseline timing, optimal tool usage, and pristine terminal connections.
3. **Controlled Trainee Practice Sessions (Classmates & Cohorts):**
   - Trainee cohorts record realistic practice attempts on standardized workbench boards following the filming guidelines.
   - Deliberate injection of standard trainee mistakes (e.g., nicked copper strands, excessive stripped length, reversed polarity, skipped multimeter tests) performed under controlled instructor supervision to ensure balanced failure-mode representations.

### 1.2 Capture Diversity Matrix
To prevent model overfitting to specific visual artifacts, data capture will enforce variability across:
- **Device Diversity:** Budget smartphones (Xiaomi, Samsung Galaxy A-series, Realme) representing typical trainee hardware (720p and 1080p).
- **Lighting Conditions:** High-illumination workshop benches, diffused lamp light, and slight shadow variations.
- **Physical Workpieces:** Variations in wooden vs. acrylic practice boards, white vs. ivory modular plates, and different PVC wire manufacturer colors.
- **Operator Demographics:** Left-handed and right-handed trainees; varying skin tones and hand sizes.

---

## 2. Pilot Dataset Target Size

For the Phase 1 MVP pilot, the target is **120 to 150 unique practice video submissions** distributed across the 4 core procedures:

| Procedure Code | Procedure Name | Target Videos | Target Normal (Pass) | Target Flawed (Fail/Mistake) |
| :--- | :--- | :---: | :---: | :---: |
| `PROC-ELEC-01` | Single-Pole Switch & Lamp | 35 | 22 | 13 |
| `PROC-ELEC-02` | Switch-Controlled Socket Outlet | 35 | 20 | 15 |
| `PROC-ELEC-03` | Two-Way Staircase Wiring | 35 | 20 | 15 |
| `PROC-ELEC-04` | Dead-Circuit Testing & Verification | 30 | 18 | 12 |
| **TOTAL** | | **135** | **80** | **55** |

*Note: Each video represents 5 to 8 minutes of footage, resulting in approximately 15 to 18 hours of multi-step video data.*

---

## 3. Trainer Labeling Protocol & Annotation Taxonomy

To train computer vision models and measure scoring concordance, every video in the pilot dataset will be annotated by certified electrical instructors using an established video labeling tool (such as CVAT or Label Studio).

### 3.1 Step Boundary Annotation
Each procedural step is annotated with:
- `start_time` (seconds or frame number)
- `end_time` (seconds or frame number)
- `step_code` (e.g., `SKT-01`, `SKT-02`, etc.)

### 3.2 Step Assessment Status
Trainers classify each observed step into one of three statuses:
1. `CORRECT` (Pass): Step was completed according to safe vocational standards.
2. `INCORRECT` (Fail): Step was executed with procedural defects or safety violations.
3. `INCONCLUSIVE` (Unobserved): The trainee performed the step off-camera or visual evidence was obstructed by hands/tools.

### 3.3 Standardized Error Taxonomy Tags
When a step is marked `INCORRECT`, instructors assign one or more standardized error tags:

| Error Tag Code | Category | Severity | Description |
| :--- | :--- | :---: | :--- |
| `OMITTED_ISOLATION` | Safety | **Safety-Critical** | Failed to verify zero energy / power cord not disconnected. |
| `EXCESS_COPPER_EXPOSED` | Workmanship | **Safety-Critical** | > 2mm of bare copper visible outside terminal housing. |
| `STRAND_DAMAGE` | Workmanship | Procedural | Conductor strands cut, nicked, or reduced during stripping. |
| `INSULATION_PINCHED` | Electrical | Procedural | Outer plastic insulation clamped under terminal screw. |
| `REVERSE_POLARITY` | Safety | **Safety-Critical** | Phase and Neutral swapped; neutral routed through switch. |
| `OMITTED_EARTH_BOND` | Safety | **Safety-Critical** | Protective earth conductor missing or not clamped to socket earth pin. |
| `LOOSE_TERMINATION` | Mechanical | Procedural | Conductor pulls free or moves during mechanical tug test. |
| `OMITTED_CONTINUITY` | Testing | **Safety-Critical** | Energizing or completing task without dead multimeter continuity check. |
| `METER_JACK_ERROR` | Safety | **Safety-Critical** | Test lead inserted into 10A current jack while checking voltage/resistance. |

### 3.4 Quality Control & Inter-Annotator Agreement
- **Dual-Annotation Split:** A randomly chosen 20% sample of all pilot videos will be independently annotated by two separate instructors.
- **Agreement Metric:** Cohen’s Kappa ($\kappa$) will be calculated on step status and error tagging. Annotation guidelines will be refined until $\kappa \ge 0.80$ is consistently achieved.

---

## 4. File and Label Organization

The dataset directory hierarchy follows a clean, machine-parseable structure:

```
dataset/
├── README.md
├── metadata.json
├── raw_videos/
│   ├── PROC-ELEC-01/
│   │   ├── ELEC01_T001_20261121_ATT01.mp4
│   │   └── ELEC01_T002_20261121_ATT01.mp4
│   ├── PROC-ELEC-02/
│   ├── PROC-ELEC-03/
│   └── PROC-ELEC-04/
└── annotations/
    ├── PROC-ELEC-01/
    │   ├── ELEC01_T001_20261121_ATT01.json
    │   └── ELEC01_T002_20261121_ATT01.json
    ├── PROC-ELEC-02/
    ├── PROC-ELEC-03/
    └── PROC-ELEC-04/
```

### File Naming Convention
```
{PROC_CODE}_{TRAINEE_ID}_{YYYYMMDD}_{ATTEMPT_NUMBER}.[mp4|json]
```
*Example:* `ELEC02_TRN045_20261121_ATT02.mp4`

### JSON Annotation Schema Example
```json
{
  "video_id": "ELEC02_TRN045_20261121_ATT02",
  "procedure_code": "PROC-ELEC-02",
  "trainee_id": "TRN045",
  "duration_seconds": 382.4,
  "annotator_id": "INST_04",
  "overall_verdict": "FAILED_SAFETY",
  "steps": [
    {
      "step_code": "SKT-01",
      "start_time": 12.0,
      "end_time": 35.5,
      "status": "CORRECT",
      "is_safety_critical": true,
      "error_tags": [],
      "notes": "Clear plug disconnection and 0.0V meter verification."
    },
    {
      "step_code": "SKT-03",
      "start_time": 58.0,
      "end_time": 94.2,
      "status": "INCORRECT",
      "is_safety_critical": true,
      "error_tags": ["EXCESS_COPPER_EXPOSED"],
      "notes": "Stripped ~18mm; 6mm of bare copper strand exposed outside earth collar."
    }
  ]
}
```

---

## 5. Dataset Splits & Accuracy Benchmarking Plan

### 5.1 Dataset Partitioning
The 135 pilot videos will be partitioned by **Trainee ID** (never leaking identical learners across splits) to test true generalizability:
- **Training Set (60% ~ 81 videos):** Model training and prompt optimization.
- **Validation Set (20% ~ 27 videos):** Hyperparameter tuning and threshold calibration.
- **Test / Benchmark Set (20% ~ 27 videos):** Locked evaluation set for final accuracy validation.

### 5.2 Evaluation Metrics
1. **Step Concordance Rate:** Percentage of individual step verdicts where the AI agrees with ground truth instructor consensus. (Target: $\ge 85\%$).
2. **Safety-Critical False Negative Rate:**
   $$\text{FNR}_{\text{safety}} = \frac{\text{False Passes on Unsafe Steps}}{\text{Total Unsafe Steps}}$$
   **Target: Exactly 0.00%**. Any unsafe step must be flagged `Incorrect` or `Inconclusive`.
3. **Precision & Recall per Error Tag:** To ensure the system correctly diagnoses the specific underlying cause (e.g., distinguishing between loose screws vs. over-stripped wire).
