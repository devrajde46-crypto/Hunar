import { SampleProcedureSummary } from "./types";

/**
 * Sample procedure details and filming checklist for /practice/upload preview.
 */
export const SAMPLE_UPLOAD_PROCEDURE: SampleProcedureSummary = {
  id: "proc-sample-01",
  code: "PROC-ELEC-01",
  title: "Single-Pole Switch Controlling a Batten Lamp",
  difficulty: "BEGINNER",
  estimatedMinutes: 25,
  safetyInstructions:
    "Supply must be isolated and proved dead with a calibrated voltage tester prior to handling any conductors. Wear insulated workshop footwear at all times.",
};

export const SAMPLE_FILMING_CHECKLIST = [
  {
    id: "check-1",
    title: "Landscape Orientation",
    description: "Mount phone horizontally on a steady tripod or workbench clamp facing the board.",
  },
  {
    id: "check-2",
    title: "Terminal Illumination",
    description: "Ensure terminals, screws, and conductor ends are brightly lit without deep shadows.",
  },
  {
    id: "check-3",
    title: "Conductor Color Visibility",
    description: "Ensure Red (Phase), Black (Neutral), and Green (Earth) insulation colors are clearly visible.",
  },
  {
    id: "check-4",
    title: "Uncut Continuous Take",
    description: "Record full procedure continuously (5 to 8 minutes). Do not pause, cut, or speed up video.",
  },
];
