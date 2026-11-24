import { SampleReviewQueueItem } from "./types";

/**
 * Sample trainer review queue for /review and review detail for /review/[id].
 */
export const SAMPLE_REVIEW_QUEUE: SampleReviewQueueItem[] = [
  {
    id: "sub-2026-0889",
    learnerName: "Ramesh Kumar",
    traineeId: "EL-2024-889",
    procedureCode: "PROC-ELEC-01",
    procedureTitle: "Single-Pole Switch Controlling a Batten Lamp",
    submittedAt: "2026-11-24 10:30 AM",
    videoDurationSeconds: 345,
    status: "Safety issue",
    hasSafetyFlag: true,
    flaggedErrorSnippet: "Step 3: Excess exposed copper (> 2mm) on Phase switch terminal",
    aiScore: 78,
  },
  {
    id: "sub-2026-0890",
    learnerName: "Pooja Verma",
    traineeId: "EL-2024-912",
    procedureCode: "PROC-ELEC-02",
    procedureTitle: "Switch-Controlled 3-Pin Socket with Earth Continuity",
    submittedAt: "2026-11-24 11:05 AM",
    videoDurationSeconds: 410,
    status: "Needs review",
    hasSafetyFlag: false,
    flaggedErrorSnippet: "Step 4: Earth continuity terminal torque needs trainer verification",
    aiScore: 84,
  },
  {
    id: "sub-2026-0891",
    learnerName: "Amit Singh",
    traineeId: "EL-2024-870",
    procedureCode: "PROC-ELEC-03",
    procedureTitle: "Two-Way Staircase Lighting Circuit (SPDT)",
    submittedAt: "2026-11-24 11:40 AM",
    videoDurationSeconds: 380,
    status: "Reviewed",
    hasSafetyFlag: false,
    aiScore: 92,
  },
  {
    id: "sub-2026-0892",
    learnerName: "Sunil Patel",
    traineeId: "EL-2024-945",
    procedureCode: "PROC-ELEC-04",
    procedureTitle: "Dead Circuit Continuity & Insulation Testing",
    submittedAt: "2026-11-24 12:15 PM",
    videoDurationSeconds: 290,
    status: "Needs review",
    hasSafetyFlag: true,
    flaggedErrorSnippet: "Step 2: Supply isolation verification sequence incomplete",
    aiScore: 65,
  },
];
