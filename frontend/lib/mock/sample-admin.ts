import {
  SampleWeeklySubmissionTrend,
  SampleProcedureAdminStat,
} from "./types";

/**
 * Sample analytics data for /admin/dashboard preview.
 */
export const SAMPLE_ADMIN_DASHBOARD = {
  institutionName: "Government Industrial Training Institute (ITI) Pusa, New Delhi",
  institutionCode: "DEMO-ITI",
  affiliatedBoard: "National Council for Vocational Training (NCVT)",
  totalTrainees: 84,
  activeInstructors: 4,

  kpiMetrics: {
    totalSubmissions: 342,
    safetyIncidentRate: 2.3, // Percentage
    firstTimePassRate: 71.8, // Percentage
    pendingTrainerReviews: 12,
  },

  weeklyTrend: [
    { label: "Mon", submissionsCount: 18, safetyFlagsCount: 1 },
    { label: "Tue", submissionsCount: 24, safetyFlagsCount: 0 },
    { label: "Wed", submissionsCount: 32, safetyFlagsCount: 2 },
    { label: "Thu", submissionsCount: 28, safetyFlagsCount: 0 },
    { label: "Fri", submissionsCount: 35, safetyFlagsCount: 1 },
    { label: "Sat", submissionsCount: 14, safetyFlagsCount: 0 },
  ] as SampleWeeklySubmissionTrend[],

  procedureBreakdown: [
    {
      code: "PROC-ELEC-01",
      title: "Single-Pole Switch Controlling a Batten Lamp",
      submissionsCount: 94,
      firstTimePassRate: 74,
      avgDurationMinutes: 22,
      safetyIncidentCount: 3,
    },
    {
      code: "PROC-ELEC-02",
      title: "Switch-Controlled 3-Pin Socket with Earth Continuity",
      submissionsCount: 88,
      firstTimePassRate: 69,
      avgDurationMinutes: 28,
      safetyIncidentCount: 4,
    },
    {
      code: "PROC-ELEC-03",
      title: "Two-Way Staircase Lighting Circuit (SPDT)",
      submissionsCount: 76,
      firstTimePassRate: 68,
      avgDurationMinutes: 34,
      safetyIncidentCount: 1,
    },
    {
      code: "PROC-ELEC-04",
      title: "Dead Circuit Continuity & Insulation Resistance Testing",
      submissionsCount: 84,
      firstTimePassRate: 76,
      avgDurationMinutes: 18,
      safetyIncidentCount: 0,
    },
  ] as SampleProcedureAdminStat[],

  criticalCheckpoints: [
    {
      stepName: "Step 03: Phase Insulation Clearance",
      procedure: "Single-Pole Switch",
      failureRate: 18.4,
      risk: "Flashover & Live Shock Contact",
    },
    {
      stepName: "Step 02: Earth Continuity Crimping",
      procedure: "Power Socket Installation",
      failureRate: 14.2,
      risk: "Missing Ground Fault Path",
    },
    {
      stepName: "Step 05: Neutral Loop Screw Torque",
      procedure: "Consumer Unit Assembly",
      failureRate: 11.8,
      risk: "Terminal Overheating & Fire Hazard",
    },
  ],
};
