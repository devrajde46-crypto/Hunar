> **DRAFT: must be reviewed and corrected by a qualified trainer against the local syllabus and electrical safety standards before use.**

# Procedure 01: Single-Pole One-Way Switch Controlling a Batten Lamp

- **Procedure Code:** `PROC-ELEC-01`
- **Trade:** Electrician (General / Domestic Wiring)
- **Estimated Duration:** 15–20 minutes

---

## 1. Objective
Correctly wire and mount a single-pole, single-throw (SPST / one-way) switch to control a single batten lamp holder on a de-energized training practice board, ensuring the phase conductor is switched, the neutral connects directly to the lamp, correct terminal torque is applied, and safe working isolation practices are strictly observed.

---

## 2. Tools & Materials

### Tools
- Insulated combination pliers (1000V rated)
- Wire stripper with gauge selector
- Insulated flat-blade terminal screwdriver (3mm / 4mm)
- Insulated Phillips head screwdriver (No. 1 / No. 2)
- Digital multimeter or certified two-pole voltage detector
- Safety glasses / eye protection

### Materials
- Wooden or PVC training board with mounted modular switch box and round ceiling rose / batten block
- 1 × Single-pole one-way modular piano switch (6A / 10A, 240V AC)
- 1 × Batten lamp holder (B22 / E27, insulated skirt)
- 1.5 sq. mm single-core PVC insulated copper wire:
  - Red or Brown (Phase / Live)
  - Black or Blue (Neutral)
  - Green or Green/Yellow (Protective Earth)
- 1 × Working incandescent or LED test bulb (e.g., 40W / 9W)
- Terminal screws and surface mounting wood/PVC screws

---

## 3. Safety Prerequisites
1. **Zero Energy State:** Ensure the main power supply to the practice board is completely switched off and physically unplugged or locked out.
2. **De-energized Verification:** Never touch terminal screws or conductor ends with bare hands until testing proves the test board is dead.
3. **PPE:** Safety footwear and impact-resistant eye protection must be worn throughout.
4. **Tool Condition:** All hand tools must have intact, undamaged insulating handles with no cracks or exposed steel shanks.

---

## 4. Numbered Step Checklist

| Step ID | Step Description | Visible Camera Evidence | Safety-Critical | Common Mistakes |
| :--- | :--- | :--- | :---: | :--- |
| `SWS-01` | **Verify Supply Isolation (Dead Verification)**<br>Verify the practice board power cord is physically unplugged and use a digital multimeter or voltage detector on the incoming supply terminals to prove zero voltage before beginning work. | Disconnected power plug clearly placed in view on workbench; two test probes placed across supply terminals; multimeter screen displaying 0.0V. | **YES** | Assuming board is dead without testing; checking voltage with multimeter set to wrong dial setting (e.g., DC or resistance). |
| `SWS-02` | **Inspect Tools & Materials**<br>Visually inspect the insulation on screwdrivers, pliers, and the switch body for structural cracks or chips. | Trainee holds up screwdriver and switch body close to the camera, rotating them briefly to display intact insulation. | **NO** | Using uninsulated screwdrivers; proceeding with cracked switch casing. |
| `SWS-03` | **Measure & Strip Phase Supply Wire**<br>Cut incoming Phase wire (Red/Brown) to required length and strip approximately 10mm to 12mm of outer insulation cleanly using wire strippers without cutting or scoring copper conductor strands. | Wire stripper engaged at proper gauge notch; outer insulation pulled off cleanly; bare copper core shown with zero severed or bent strands. | **NO** | Over-stripping (>15mm leaving exposed live copper); nicking or reducing the diameter of conductor strands; using pliers teeth instead of stripper. |
| `SWS-04` | **Connect Phase Conductor to Switch Input (Common) Terminal**<br>Insert the stripped Phase supply conductor fully into the lower/common terminal of the one-way switch and tighten the terminal screw firmly. Ensure no bare copper protrudes outside the terminal housing. | Conductor seated deep into brass terminal slot; screwdriver turning screw firmly; wire tugged gently to verify mechanical grip; zero bare copper visible beyond plastic shroud. | **YES** | Leaving >2mm bare copper exposed outside the terminal; trapping plastic wire insulation under the screw clamp; loose terminal screw causing contact resistance. |
| `SWS-05` | **Measure, Strip & Connect Switch Output (Switched Phase) Wire**<br>Prepare a second Phase conductor (Red/Brown) of appropriate length. Strip 10mm of insulation and connect one end to the upper terminal (load output) of the one-way switch. Route the other end to the lamp holder. | Wire stripped cleanly; conductor inserted into upper terminal; terminal screw tightened; wire routing shown neatly through conduit/surface clips to the lamp holder base. | **YES** | Switching the neutral wire instead of the phase wire (extremely dangerous; leaves lamp fixture energized even when switch is turned off). |
| `SWS-06` | **Connect Switched Phase to Lamp Holder Terminal**<br>Pass the switched Phase conductor through the base sleeve of the batten lamp holder and terminate it securely into the center contact brass terminal. | Conductor inserted through back shroud into the lamp brass terminal; screw tightened; insulated sleeve in place. | **NO** | Connecting wire without threading through lamp holder base cover; loose screw resulting in arcing. |
| `SWS-07` | **Connect Neutral Supply Conductor to Lamp Holder**<br>Route the incoming Neutral wire (Black/Blue) directly from the supply terminal block to the outer brass screw/skirt terminal of the batten lamp holder, bypassing the switch completely. | Direct routing of Neutral wire to lamp holder without passing through switch; stripped end clamped securely in terminal; zero exposed copper outside terminal block. | **YES** | Routing neutral through the switch; pinching neutral wire beneath switch frame screws. |
| `SWS-08` | **Tug Test on All Terminals**<br>Perform a firm manual pull/tug test on all four terminal connections (switch input, switch output, lamp phase, lamp neutral) to verify mechanical stability. | Trainee visibly pulls on each connected wire close to the terminal with thumb and forefinger; connection remains immovable. | **NO** | Skipping mechanical verification; pulling so hard that the component snaps. |
| `SWS-09` | **Mount Switch and Lamp Holder to Practice Board**<br>Tuck excess wire neatly into the switch box without pinching. Secure the switch faceplate and lamp holder body using mounting screws. | Wires neatly folded in S-curves; faceplate seated flat against box; screwdriver driving mounting screws straight and flush. | **NO** | Pinching wire insulation between plate and box; over-tightening screws causing plastic plate to crack. |
| `SWS-10` | **Pre-Energization Continuity & Resistance Verification**<br>With supply still disconnected, set multimeter to resistance/continuity mode. Test between supply plug phase and lamp holder terminal with switch open (infinite resistance / OL) and switch closed (< 1.0 ohm). Verify zero continuity between Phase and Neutral. | Multimeter selector on beep/resistance; probes applied across test points; meter display shown showing expected open-circuit and closed-circuit readings when switch toggled. | **YES** | Energizing the circuit before verifying that no dead short exists between Phase and Neutral. |
