import {
  SampleProgressProcedureItem,
  SampleWeakStepItem,
  SampleWeeklySubmissionTrend,
} from "./types";

/**
 * Sample progress and competency data for /progress preview.
 */
export const SAMPLE_LEARNER_PROGRESS = {
  traineeName: "Ramesh Kumar",
  traineeId: "EL-2024-889",
  tradeName: "Electrician (Basic Wiring)",
  institutionName: "Govt ITI Pusa, New Delhi",
  summaryStats: {
    competentCount: 4,
    needsPracticeCount: 2,
    inProgressCount: 1,
    totalProcedures: 7,
    overallPassRate: 67,
  },
  procedures: [
    {
      procedureCode: "PROC-ELEC-01",
      procedureTitle: "Single-Pole Switch Controlling a Batten Lamp",
      difficulty: "BEGINNER",
      status: "Needs practice",
      attemptsCount: 2,
      lastPracticedDate: "2026-11-24",
      bestScorePercentage: 78,
      hasSafetyCriticalSteps: true,
    },
    {
      procedureCode: "PROC-ELEC-02",
      procedureTitle: "Switch-Controlled 3-Pin Power Socket with Earth Conductor",
      difficulty: "BEGINNER",
      status: "Competent",
      attemptsCount: 1,
      lastPracticedDate: "2026-11-22",
      bestScorePercentage: 92,
      hasSafetyCriticalSteps: true,
    },
    {
      procedureCode: "PROC-ELEC-03",
      procedureTitle: "Two-Way Staircase Lighting Circuit with SPDT Switches",
      difficulty: "INTERMEDIATE",
      status: "Competent",
      attemptsCount: 3,
      lastPracticedDate: "2026-11-20",
      bestScorePercentage: 88,
      hasSafetyCriticalSteps: true,
    },
    {
      procedureCode: "PROC-ELEC-04",
      procedureTitle: "Dead Circuit Continuity & Insulation Resistance Testing",
      difficulty: "INTERMEDIATE",
      status: "Competent",
      attemptsCount: 1,
      lastPracticedDate: "2026-11-18",
      bestScorePercentage: 96,
      hasSafetyCriticalSteps: true,
    },
    {
      procedureCode: "PROC-ELEC-05",
      procedureTitle: "Fluorescent Batten Fitting with Electronic Choke Assembly",
      difficulty: "INTERMEDIATE",
      status: "Needs practice",
      attemptsCount: 1,
      lastPracticedDate: "2026-11-15",
      bestScorePercentage: 65,
      hasSafetyCriticalSteps: false,
    },
    {
      procedureCode: "PROC-ELEC-06",
      procedureTitle: "Domestic Consumer Unit: SPN MCB & Neutral Link Assembly",
      difficulty: "ADVANCED",
      status: "Processing",
      attemptsCount: 1,
      lastPracticedDate: "2026-11-12",
      bestScorePercentage: 0,
      hasSafetyCriticalSteps: true,
    },
  ] as SampleProgressProcedureItem[],

  weakestSteps: [
    {
      stepCode: "PROC-01-S03",
      stepTitle: "Phase Conductor Terminal Clearance",
      procedureTitle: "Single-Pole Switch",
      failureRatePercentage: 35,
      isSafetyCritical: true,
      commonMistake: "Exposed bare copper exceeds 2mm tolerance outside switch terminal housing.",
    },
    {
      stepCode: "PROC-02-S04",
      stepTitle: "Earth Continuity Ring Crimping",
      procedureTitle: "3-Pin Power Socket",
      failureRatePercentage: 28,
      isSafetyCritical: true,
      commonMistake: "Insufficient crimp pressure resulting in high earth loop impedance.",
    },
  ] as SampleWeakStepItem[],

  monthlyTrend: [
    { label: "Wk 1", submissionsCount: 2, safetyFlagsCount: 1 },
    { label: "Wk 2", submissionsCount: 3, safetyFlagsCount: 1 },
    { label: "Wk 3", submissionsCount: 4, safetyFlagsCount: 0 },
    { label: "Wk 4", submissionsCount: 5, safetyFlagsCount: 1 },
  ] as SampleWeeklySubmissionTrend[],
};
