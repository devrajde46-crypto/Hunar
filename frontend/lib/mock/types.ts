/**
 * Sample Mock Data Types for UI Previews (Phase 3B3)
 * NOTE: These types represent frontend mock previews for upcoming roadmap features:
 * video upload (Phase 3B3/3C), scoring & AI triage (Phase 4), and trainer review / analytics.
 */

export interface SampleProcedureSummary {
  id: string;
  code: string;
  title: string;
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  estimatedMinutes: number;
  safetyInstructions: string;
}

export interface SampleSubmissionStep {
  stepNumber: number;
  title: string;
  isSafetyCritical: boolean;
  score: number;
  passed: boolean;
  safetyViolated: boolean;
  feedback: string;
  timestampSeconds: number;
  detectedErrorTag?: string;
}

export interface SampleSubmissionFeedback {
  id: string;
  learnerName: string;
  traineeId: string;
  procedureCode: string;
  procedureTitle: string;
  submittedAt: string;
  status: "Needs practice" | "Competent" | "Safety issue";
  overallScore: number;
  passedStepsCount: number;
  totalStepsCount: number;
  safetyCriticalPassed: boolean;
  aiGuidanceDisclaimer: string;
  trainerReview?: {
    trainerName: string;
    reviewedAt: string;
    comments: string;
    needsRetest: boolean;
  };
  steps: SampleSubmissionStep[];
}

export interface SampleReviewQueueItem {
  id: string;
  learnerName: string;
  traineeId: string;
  procedureCode: string;
  procedureTitle: string;
  submittedAt: string;
  videoDurationSeconds: number;
  status: "Needs review" | "Reviewed" | "Safety issue";
  hasSafetyFlag: boolean;
  flaggedErrorSnippet?: string;
  aiScore: number;
}

export interface SampleProgressProcedureItem {
  procedureCode: string;
  procedureTitle: string;
  difficulty: string;
  status: "Competent" | "Needs practice" | "Processing";
  attemptsCount: number;
  lastPracticedDate: string;
  bestScorePercentage: number;
  hasSafetyCriticalSteps: boolean;
}

export interface SampleWeakStepItem {
  stepCode: string;
  stepTitle: string;
  procedureTitle: string;
  failureRatePercentage: number;
  isSafetyCritical: boolean;
  commonMistake: string;
}

export interface SampleWeeklySubmissionTrend {
  label: string;
  submissionsCount: number;
  safetyFlagsCount: number;
}

export interface SampleProcedureAdminStat {
  code: string;
  title: string;
  submissionsCount: number;
  firstTimePassRate: number;
  avgDurationMinutes: number;
  safetyIncidentCount: number;
}
