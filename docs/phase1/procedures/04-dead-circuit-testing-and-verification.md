> **DRAFT: must be reviewed and corrected by a qualified trainer against the local syllabus and electrical safety standards before use.**

# Procedure 04: Dead-Circuit Safety Testing & Verification

- **Procedure Code:** `PROC-ELEC-04`
- **Trade:** Electrician (General / Testing & Inspection)
- **Estimated Duration:** 15–20 minutes

---

## 1. Objective
Systematically execute standard de-energized electrical safety and verification tests (Safe Isolation Verification, Protective Conductor Continuity, Ring/Radial Circuit Continuity, Correct Polarity, and Insulation Resistance / Dead Short Check) on a completed practice installation using a digital multimeter prior to requesting trainer authorization for energized testing.

---

## 2. Tools & Materials

### Tools
- Digital Multimeter (CAT III 600V or CAT IV rated) with fused test leads and sharp probe tips
- Approved two-pole voltage detector / test lamp (rated to 500V AC)
- Insulated terminal screwdriver (3mm)
- Safety glasses / eye protection

### Materials
- Pre-wired practice board (containing switches, socket outlets, and lamp holders)
- Test socket adapter or test plug with exposed probe access ports
- Temporary jumper wire with insulated crocodile clips (for loop testing)

---

## 3. Safety Prerequisites
1. **Never Assume De-energized:** Always treat every conductor as live until physically tested and proven dead.
2. **Meter Proving Sequence:** Multimeters and voltage detectors must be inspected and proved functional before and after each test sequence.
3. **Strict Isolation Protocol:** The board power plug must be physically unplugged, tagged, and remain in the trainee's continuous visual field.
4. **PPE:** Safety glasses and insulating safety shoes must be worn.

---

## 4. Numbered Step Checklist

| Step ID | Step Description | Visible Camera Evidence | Safety-Critical | Common Mistakes |
| :--- | :--- | :--- | :---: | :--- |
| `TST-01` | **Verify Physical Disconnection (Lockout / Tagout Tag)**<br>Confirm the supply cable is disconnected from the electrical mains. Place the disconnected plug head clearly within camera view next to the test station. | Power plug lying disconnected on the workbench within camera frame; tag or lockout clasp visible if applicable. | **YES** | Performing testing while board remains plugged into mains wall socket. |
| `TST-02` | **Inspect Test Leads and Multimeter Condition**<br>Inspect test lead insulation for cuts, cracks, or exposed copper. Confirm test leads are plugged into the correct multimeter jacks (`COM` for black lead, `V/Ω` for red lead). | Trainee runs fingers along full length of test leads in view of camera; shows lead plugs inserted into `COM` and `V/Ω` jacks; confirms no lead is in `10A` current jack. | **YES** | Leaving red test lead in high-current `10A` jack while testing, which causes a dead short circuit during live checks. |
| `TST-03` | **Test Instrument Self-Check (Lead Resistance Nulling)**<br>Switch multimeter to lowest resistance/continuity buzzer range (e.g., 200Ω or buzzer symbol). Firmly touch the two probe tips together and confirm the meter display reads < 0.2 ohms and the buzzer sounds continuously. | Multimeter display shown reading between 0.0Ω and 0.2Ω while probe tips are held firmly in contact; beeper audible. | **NO** | Using meter with dying battery or faulty leads resulting in false high resistance readings. |
| `TST-04` | **Verify Complete Absence of Voltage (Dead Test)**<br>Set multimeter to AC Voltage mode (600V range). Probe between: (1) Phase and Neutral; (2) Phase and Earth; (3) Neutral and Earth. Confirm all three measurements indicate 0.0V AC. | Multimeter selector on AC Voltage; probes applied across P-N, P-E, and N-E terminals in sequence; meter display consistently showing 0.0V. | **YES** | Testing on DC voltage setting instead of AC; failing to test all three terminal combinations. |
| `TST-05` | **Protective Earth (PE) Continuity Test**<br>Set meter to lowest resistance range (200Ω). Place one probe on the main incoming supply earth pin. Place the second probe on the socket earth terminal and metal enclosures. Verify reading is < 0.5 ohms. | One probe on supply earth pin; second probe firmly contacting socket earth pin; multimeter reading < 0.5Ω clearly shown. | **YES** | Accepting high resistance or open circuit (OL) on protective earth path; poor probe contact on oxidized metal. |
| `TST-06` | **Polarity Verification at Switch**<br>Connect one probe to incoming supply Phase pin. Touch second probe to the switch common terminal and switched phase terminal while toggling switch. Confirm continuity exists only on the Phase conductor path and NEVER between Phase and Neutral. | Meter probes connected to Phase pin and switch terminal; meter toggles between < 0.5Ω and OL in sync with switch position; meter reads OL when tested against Neutral. | **YES** | Polarity reversed (neutral connected through switch); failing to detect switched neutral error. |
| `TST-07` | **Polarity Verification at Socket Outlet**<br>With switch in ON position, probe from supply Phase pin to socket 'L' (right-hand pin). Confirm < 0.5Ω. Probe from supply Phase pin to socket 'N' (left-hand pin). Confirm open circuit (OL). | Probes positioned on supply Phase and socket pins; multimeter display shows continuity to 'L' and infinity/OL to 'N'. | **YES** | Socket wired with reversed polarity (Phase and Neutral swapped). |
| `TST-08` | **Insulation Resistance / Dead Short Circuit Test (P to N)**<br>With all switches ON and test bulb removed from holder, set meter to highest resistance range (or Mega-ohms range, e.g., 2MΩ or 20MΩ). Measure between Phase and Neutral conductors. Confirm meter reads infinite resistance (OL / > 20MΩ). | Meter set to highest resistance; probes connected across Phase and Neutral incoming terminals; display reading "OL" or "1" (over-range/infinity). | **YES** | Failing to notice a short circuit between Phase and Neutral before energizing (causes breaker trip or explosive flashover). |
| `TST-09` | **Insulation Resistance / Dead Short Circuit Test (P to E and N to E)**<br>Measure resistance between Phase and Earth, and between Neutral and Earth with all switches ON. Confirm both readings show complete open circuit (OL / infinity). | Probes applied between P-E and N-E; meter display clearly showing open circuit / over-range on both tests. | **YES** | Energizing with an active earth fault or grounded neutral. |
| `TST-10` | **Document Readings and Flag Ready for Trainer Review**<br>Record all measured values (PE continuity, polarity verification, and insulation resistance) on the practice test sheet. Hold the sheet up to the camera and call for instructor physical verification. | Trainee holds completed test report sheet clearly in front of camera showing recorded numerical values; signs their trainee ID. | **NO** | Incomplete documentation; energizing without trainer inspection and explicit sign-off. |
