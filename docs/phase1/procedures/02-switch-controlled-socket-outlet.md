> **DRAFT: must be reviewed and corrected by a qualified trainer against the local syllabus and electrical safety standards before use.**

# Procedure 02: Switch-Controlled 3-Pin Socket Outlet Installation

- **Procedure Code:** `PROC-ELEC-02`
- **Trade:** Electrician (General / Domestic Wiring)
- **Estimated Duration:** 20–25 minutes

---

## 1. Objective
Correctly wire and mount an electrical modular switch controlling an adjacent 3-pin shuttered socket outlet (16A/6A) on a practice board. Ensure correct polarity (Phase to Switch, switched Phase to 'L' terminal, Neutral to 'N' terminal), robust bonding of the Protective Earth (PE) conductor to the earth pin, absence of exposed copper, and de-energized testing prior to energization.

---

## 2. Tools & Materials

### Tools
- Insulated combination pliers (1000V rated)
- Precision wire stripper with gauge stops
- Insulated terminal screwdrivers (Flat 3.5mm, Phillips No. 1 and No. 2)
- Digital multimeter with CAT III test leads
- Safety goggles / eye protection

### Materials
- Surface modular back-box (2-module or combined combi-plate)
- 1 × Single-pole modular switch (16A / 6A, 240V AC)
- 1 × 3-Pin socket outlet with safety shutter (16A / 6A)
- Copper conductors (1.5 sq. mm for control / 2.5 sq. mm for power):
  - Red / Brown (Incoming Phase & Switch-to-Socket link)
  - Black / Blue (Incoming Neutral)
  - Green or Green/Yellow (Protective Earth)
- Terminal screws and mounting machine screws

---

## 3. Safety Prerequisites
1. **Zero Energy State:** Ensure the board feed is unplugged and locked out.
2. **PPE:** Safety footwear and safety goggles must be worn.
3. **Safe Conductor Identification:** Strictly adhere to color coding; never use green/yellow wire for active conductors.
4. **Protective Earth Integrity:** Earth wire connection is life-critical and must be securely terminated first before active conductors are routed.

---

## 4. Numbered Step Checklist

| Step ID | Step Description | Visible Camera Evidence | Safety-Critical | Common Mistakes |
| :--- | :--- | :--- | :---: | :--- |
| `SKT-01` | **Verify Complete Supply Isolation (Dead Check)**<br>Confirm power cord is visibly unplugged from supply receptacle. Place multimeter in AC Voltage mode and probe incoming terminals to confirm 0.0V. | Disconnected cord plug resting on workbench in frame; multimeter selector on ACV 600V; test probes placed across supply leads showing zero reading. | **YES** | Relying on switch position alone; failure to verify multimeter functionality. |
| `SKT-02` | **Inspect Components and Shutter Mechanism**<br>Inspect switch and socket body for physical damage, hairline cracks, and ensure socket safety shutter moves freely when an earth pin is engaged. | Trainee holds socket facing camera, uses an insulated dummy pin to gently depress top earth aperture, showing shutters slide open smoothly. | **NO** | Installing socket with broken or jammed safety shutters. |
| `SKT-03` | **Prepare & Terminate Protective Earth Conductor**<br>Strip 12mm of Green/Yellow earth conductor. Insert conductor fully into the large top terminal marked 'E' (or earth symbol) on the socket outlet and tighten screw to firm torque. | Bare copper strand seated fully in center earth brass bore; screw tightened; zero bare copper visible outside the insulating collar; tug test performed. | **YES** | Omitting earth wire; loose connection; nicking strands; terminating earth into neutral or phase terminal. |
| `SKT-04` | **Prepare & Terminate Neutral Supply Conductor**<br>Strip 10mm of Black/Blue Neutral conductor. Insert into the socket terminal marked 'N' (typically on the left when viewing socket from the back) and securely tighten. | Conductor inserted into brass terminal labeled 'N'; screw tightened firmly; wire tugged; no bare wire protruding. | **YES** | Transposing Phase and Neutral (reverse polarity); clamping terminal screw onto wire insulation. |
| `SKT-05` | **Terminate Incoming Phase to Switch Input Terminal**<br>Strip 10mm of incoming Phase wire (Red/Brown). Connect to the supply/common terminal of the controlling switch. Tighten screw firmly. | Red conductor inserted into switch input terminal; screw driven tight; zero copper strands splayed outside terminal. | **YES** | Feeding incoming Phase directly to socket instead of routing through the switch. |
| `SKT-06` | **Fabricate and Connect Phase Jumper Loop**<br>Cut a short jumper wire (Red/Brown), strip 10mm on both ends. Connect one end to the load terminal of the switch and the other end to the socket terminal marked 'L' (Live). | Short loop wire clearly visible connecting switch output directly to the 'L' terminal of the socket; both terminal screws firmly tightened. | **YES** | Using undersized jumper wire; bridging switch to 'N' terminal creating an instantaneous line-to-neutral short circuit. |
| `SKT-07` | **Perform Mechanical Tug Test**<br>Perform a deliberate pull test on all four terminal connections: Earth terminal, Neutral terminal, Switch input, and Switch-to-Socket phase jumper. | Trainee visibly tugs each wire individually near the terminal block with fingers; no conductor pulls free or loosens. | **NO** | Neglecting tug test; over-pulling causing plastic component fracture. |
| `SKT-08` | **Route Wires and Mount Faceplate**<br>Carefully fold the conductors in smooth loops into the back box. Align the switch and socket plate with box mounting pillars and secure with machine screws. | Wires dressed neatly inside box without kinking; plate flush against wall/box edge; screws driven straight without stripping threads. | **NO** | Pinching wire insulation under the faceplate frame; damaging wire insulation against sharp metal box edges. |
| `SKT-09` | **Verify Polarity & Resistance with Multimeter**<br>With power still disconnected, set multimeter to continuity/resistance mode. Verify: (1) Zero continuity between Phase and Neutral when switch is ON; (2) Continuity (< 1.0 ohm) from Earth pin to incoming Earth wire; (3) Switch properly opens/closes Phase to socket 'L' terminal. | Multimeter probes contacting test points; meter display clearly captured showing open circuit (OL) between P-N, and zero resistance on earth path and switched live path. | **YES** | Omitting dead continuity and short-circuit verification before requesting live power connection. |
