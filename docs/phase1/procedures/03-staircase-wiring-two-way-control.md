> **DRAFT: must be reviewed and corrected by a qualified trainer against the local syllabus and electrical safety standards before use.**

# Procedure 03: Two-Way Staircase Lighting Circuit Installation

- **Procedure Code:** `PROC-ELEC-03`
- **Trade:** Electrician (General / Domestic Wiring)
- **Estimated Duration:** 25–30 minutes

---

## 1. Objective
Wire and mount a classic two-way staircase lighting control circuit on a practice board using two single-pole double-throw (SPDT / two-way) switches to control a central lamp holder from two independent locations, ensuring correct conductor routing, safe phase switching, zero neutral switching, and complete de-energized verification across all four switch state combinations.

---

## 2. Tools & Materials

### Tools
- Insulated combination pliers (1000V rated)
- Precision wire stripper with gauge markings
- Insulated terminal screwdrivers (Flat 3mm / 4mm, Phillips No. 1)
- Digital multimeter with continuity sounder
- Eye protection goggles

### Materials
- Practice wiring board with 2 switch boxes (representing staircase top and bottom) and 1 central lamp junction box
- 2 × Single-pole double-throw (SPDT / two-way) modular switches (6A, 240V AC) with terminals marked C (Common), 1 (or L1), and 2 (or L2)
- 1 × Batten lamp holder (insulated brass/polycarbonate, B22/E27)
- 1.5 sq. mm single-core PVC insulated copper wire:
  - Red / Brown (Phase supply and lamp switch-feed)
  - Yellow / White / Orange (Strapping / traveler conductors between switches)
  - Black / Blue (Neutral return conductor)
- Test incandescent or LED bulb (e.g., 40W / 9W)
- Box mounting and terminal screws

---

## 3. Safety Prerequisites
1. **Zero Energy State:** Ensure the entire board supply cord is disconnected and physically placed within clear view.
2. **De-energized Verification:** Measure incoming supply with a multimeter before touching terminals.
3. **No Short-Circuit Strapping Method:** Use the standard safe traveler method (Phase to Switch 1 Common, Lamp to Switch 2 Common, travelers bridging L1-L1 and L2-L2). The obsolete "Carter system" / short-circuit method (where phase and neutral are both connected to both switches) is strictly forbidden due to severe flashover danger.
4. **PPE:** Eye protection and insulating safety footwear required.

---

## 4. Numbered Step Checklist

| Step ID | Step Description | Visible Camera Evidence | Safety-Critical | Common Mistakes |
| :--- | :--- | :--- | :---: | :--- |
| `STC-01` | **Verify Supply Isolation**<br>Ensure practice board cord is disconnected. Place multimeter on AC Voltage range and measure incoming supply points to verify zero energy. | Disconnected plug visible on workbench; probes touched to terminals; meter displaying 0.0V. | **YES** | Assuming circuit is de-energized without physical verification. |
| `STC-02` | **Inspect 2-Way Switch Terminals and Markings**<br>Examine both two-way switches. Locate and identify Common (C), Terminal 1 (L1), and Terminal 2 (L2) markings on the rear casing of each switch. | Trainee holds both switches up to camera, pointing with an insulated tool to the terminal markings (C, 1, 2) on both units. | **NO** | Confusing 1-way and 2-way switches; failing to identify the Common terminal correctly. |
| `STC-03` | **Connect Incoming Phase to Switch 1 Common Terminal**<br>Strip 10mm of incoming Phase conductor (Red/Brown). Connect securely to the Common (C) terminal of the first 2-way switch (bottom of stairs). | Red wire inserted into center/common terminal; terminal screw tightened; zero bare copper showing outside terminal. | **YES** | Connecting incoming phase to a traveler terminal (L1 or L2) instead of Common; leaving bare wire exposed. |
| `STC-04` | **Connect Strapping (Traveler) Wire 1 between Switches**<br>Strip 10mm on both ends of Traveler Wire 1 (Yellow/Orange). Connect one end to Terminal 1 of Switch 1, route through conduit, and connect the other end to Terminal 1 of Switch 2. | Wire routed cleanly through conduit; ends seated in Terminal 1 of both switches; screws tightened firmly; tug test performed. | **NO** | Cross-connecting traveler wires erratically without marking; loose terminal clamping. |
| `STC-05` | **Connect Strapping (Traveler) Wire 2 between Switches**<br>Strip 10mm on both ends of Traveler Wire 2 (Yellow/Orange/White). Connect one end to Terminal 2 of Switch 1, route through conduit, and connect the other end to Terminal 2 of Switch 2. | Second traveler wire routed parallel to first; ends seated into Terminal 2 on both switches; screws tightened firmly; zero exposed conductor. | **NO** | Strands cut during stripping; loose screw. |
| `STC-06` | **Connect Switch 2 Common Terminal to Lamp Holder Phase Terminal**<br>Strip 10mm of load wire (Red/Brown). Connect one end to the Common (C) terminal of Switch 2 (top of stairs). Route other end to center contact terminal of the lamp holder. | Wire securely connected from Common terminal of Switch 2 to the lamp holder phase terminal; screw tightened firmly. | **YES** | Connecting lamp feed to a traveler terminal instead of Common; connecting lamp directly to incoming live supply. |
| `STC-07` | **Connect Direct Neutral Conductor to Lamp Holder**<br>Route Neutral conductor (Black/Blue) directly from supply terminal to the outer/skirt terminal of the lamp holder, completely bypassing both switches. | Black/Blue conductor routed cleanly to lamp holder terminal; zero connections made to any switch; screw firmly tightened. | **YES** | Running neutral through either two-way switch (forbidden Carter method); reversing phase and neutral at lamp. |
| `STC-08` | **Perform Mechanical Tug Test**<br>Conduct a firm mechanical pull test on all terminations across Switch 1 (3 wires), Switch 2 (3 wires), and Lamp Holder (2 wires). | Trainee methodically pulls each of the 8 terminations gently but firmly; no wire moves out of its terminal clamp. | **NO** | Skipping mechanical verification on traveler connections. |
| `STC-09` | **Mount Switches and Lamp Base**<br>Dress wires neatly into both back boxes and ceiling rose. Mount switch plates and lamp holder securely using mounting screws. | All plates mounted flush and level; no cables pinched behind plate edges. | **NO** | Pinched wires creating intermittent contact or insulation breach. |
| `STC-10` | **Comprehensive 4-State Dead Continuity Verification**<br>With supply disconnected and multimeter on continuity mode, verify lamp state across all four switch permutations:<br>(1) SW1 UP, SW2 UP -> Circuit Closed (Continuity)<br>(2) SW1 UP, SW2 DOWN -> Circuit Open (OL)<br>(3) SW1 DOWN, SW2 DOWN -> Circuit Closed (Continuity)<br>(4) SW1 DOWN, SW2 UP -> Circuit Open (OL)<br>Verify zero continuity between Phase and Neutral. | Multimeter display and beeper captured clearly while trainee toggles switches through all 4 combinations; meter clearly reflects alternating open and closed circuit state. | **YES** | Skipping the 4-combination truth-table test; energizing with an unresolved phase-neutral dead short. |
