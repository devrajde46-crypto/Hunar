import { SampleSubmissionFeedback } from "./types";

/**
 * Sample submission feedback for /submissions/[id] preview.
 * Strictly adheres to ethical AI principles: wording is honest guidance reviewed by trainer,
 * never implies the AI guarantees safety.
 */
export const SAMPLE_SUBMISSION_FEEDBACK: SampleSubmissionFeedback = {
  id: "sub-2026-0889",
  learnerName: "Ramesh Kumar",
  traineeId: "EL-2024-889",
  procedureCode: "PROC-ELEC-01",
  procedureTitle: "Single-Pole Switch Controlling a Batten Lamp",
  submittedAt: "2026-11-24 10:30 AM",
  status: "Needs practice",
  overallScore: 78,
  passedStepsCount: 4,
  totalStepsCount: 6,
  safetyCriticalPassed: false,
  aiGuidanceDisclaimer:
    "AI evaluation is an automated triage aid and guidance tool, reviewed by your trainer. It does not certify that an electrical circuit is safe to energize. All live electrical tests must occur under the direct physical supervision of your workshop trainer.",
  trainerReview: {
    trainerName: "Shri S. Sharma (Certified ITI Trainer)",
    reviewedAt: "2026-11-24 11:15 AM",
    comments:
      "Good overall workbench discipline on mounting and stripping. However, Step 3 has an exposed live conductor loop exceeding 2mm outside the switch terminal collar. Re-terminate Step 3 at Bay B-04 before circuit energization.",
    needsRetest: true,
  },
  steps: [
    {
      stepNumber: 1,
      title: "Mounting the Batten Lamp Holder & Switch Box",
      isSafetyCritical: false,
      score: 100,
      passed: true,
      safetyViolated: false,
      feedback: "Components mounted securely perpendicular to workbench base with correct screw torque.",
      timestampSeconds: 32,
    },
    {
      stepNumber: 2,
      title: "Preparing & Stripping Conductor Insulation",
      isSafetyCritical: false,
      score: 95,
      passed: true,
      safetyViolated: false,
      feedback: "Clean insulation cut without nicking copper strands. Measured strip length: 12mm.",
      timestampSeconds: 78,
    },
    {
      stepNumber: 3,
      title: "Phase Wire Termination to Switch Terminal",
      isSafetyCritical: true,
      score: 40,
      passed: false,
      safetyViolated: true,
      detectedErrorTag: "EXCESS_COPPER_EXPOSED",
      feedback:
        "Safety Issue Detected: Bare copper conductor exposed > 2mm outside switch terminal collar. Risk of accidental flashover or shock contact.",
      timestampSeconds: 135,
    },
    {
      stepNumber: 4,
      title: "Connecting Switch Return Wire to Lamp Holder",
      isSafetyCritical: false,
      score: 90,
      passed: true,
      safetyViolated: false,
      feedback: "Return conductor routed cleanly into switch feed terminal with firm screw retention.",
      timestampSeconds: 195,
    },
    {
      stepNumber: 5,
      title: "Terminating Neutral Conductor to Lamp Holder",
      isSafetyCritical: false,
      score: 95,
      passed: true,
      safetyViolated: false,
      feedback: "Neutral conductor connected to outer brass ring collar terminal correctly.",
      timestampSeconds: 245,
    },
    {
      stepNumber: 6,
      title: "Dead Circuit Continuity & Insulation Resistance Test",
      isSafetyCritical: true,
      score: 75,
      passed: true,
      safetyViolated: false,
      feedback:
        "Continuity proved with multimeter on dead circuit. Trainer physical verification recommended before power.",
      timestampSeconds: 310,
    },
  ],
};
