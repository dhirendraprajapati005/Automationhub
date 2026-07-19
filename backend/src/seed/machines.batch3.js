export const machinesBatch3 = [
  {
    slug: "pick-and-place",
    title: "Pick and Place Machine",
    category: "Material Handling",
    summary: "Automated part transfer using vacuum or gripper end effectors, driven by pneumatic or servo-actuated axes.",
    order: 2,
    tags: ["pick and place", "vacuum", "automation"],
    content: `## Working Principle

A pick-and-place machine transfers discrete parts from one location to another — typically from an infeed conveyor or tray into a packaging fixture, or between process stations — using an end effector (vacuum cup or mechanical gripper) mounted on a set of coordinated axes. The core control challenge isn't any single motion, but coordinating multiple axes (and the end effector's grip/release timing) into one smooth, repeatable cycle.

## Components

- Pneumatic or servo-driven X/Y/Z axes (a simple pick-and-place is often fully pneumatic; higher-speed or more flexible ones use servo axes)
- Vacuum generator and vacuum cup, or a pneumatic gripper, as the end effector
- Vacuum sensor (confirms a part was actually picked, not just that the cycle ran)
- Part presence sensors at pick and place locations
- PLC or dedicated motion controller sequencing the axes and end effector together

## Electrical Wiring

Pneumatic axis solenoids and the vacuum generator's control valve are discrete outputs; the vacuum sensor (confirming actual vacuum level, not just "valve commanded open") is a discrete or analog input that's critical to wire correctly, since without it the machine has no way to know a pick actually succeeded — it would place nothing and never detect the miss. Servo-driven versions add servo drive I/O and often a dedicated motion network connection rather than simple discrete wiring for axis control.

## Pneumatic Diagram

Supply air → FRL → separate solenoid valves for each pneumatic axis (extend/retract) plus the vacuum generator's control valve. Flow control valves at each cylinder tune approach speed — critical near the pick/place points, where arriving too fast risks dropping or damaging the part, but too slow costs cycle time.

## PLC Logic

The sequence is a chain of confirmed steps, not a fixed-timer sequence, specifically because "part picked successfully" needs real feedback:

\`\`\`
LD   M0              // start pick cycle
OUT  Y0               // extend Z axis down to part
LD   Y0
ANI  X5                // X5 = Z-down limit sensor, wait for arrival
OUT  Y1                // engage vacuum
TON  T0    K5           // brief settle time
LD   T0
LD   X6                 // X6 = vacuum sensor confirms part attached
OUT  M1                 // M1 = "part confirmed picked" flag
LD   M1
OUT  Y0                 // retract Z, part in hand
\`\`\`

If M1 (part confirmed) never sets, the logic branches to a fault/retry state rather than continuing blindly into a place cycle with no part.

## Sequence of Operation

1. Part arrives at pick location, presence sensor confirms
2. End effector moves to pick position (Z-axis down)
3. Vacuum/grip engages; vacuum sensor confirms successful pick
4. End effector retracts and the axis system moves to the place location
5. Part is released at the place location (vacuum breaks / gripper opens)
6. End effector returns to the home/pick-ready position for the next cycle

## Common Faults

- Vacuum pick failures — leaking vacuum cup, worn cup not sealing, or part surface unsuitable for vacuum (porous, uneven)
- Part dropped mid-transfer — vacuum level marginal (passes the sensor threshold but not with real margin), or transfer speed too aggressive for the vacuum hold force
- Axis not reaching position — pneumatic cylinder speed/cushioning misadjusted, or a mechanical obstruction

## Troubleshooting

- If pick failures are intermittent rather than constant, check vacuum cup wear and vacuum line leaks before suspecting the vacuum generator itself — a marginal system fails intermittently depending on small variations in part surface or seating
- If parts are dropped consistently at the same point in the transfer path (not randomly), that's almost always a speed/acceleration issue at that specific point, not a vacuum strength issue
- Confirm the vacuum sensor's actual threshold setting against real measured vacuum during a successful pick, since a threshold set too low will "confirm" marginal picks that then fail later in the cycle

## Maintenance

- Replace vacuum cups on a scheduled interval — they're a wear item, and gradual degradation causes exactly the intermittent pick failures described above
- Check and clean vacuum line filters, since debris restricting vacuum flow reduces effective hold force gradually and often escapes notice until failure rates climb
- Inspect pneumatic cylinder cushioning and speed control settings periodically, especially after any product or part-weight change`,
  },
  {
    slug: "dome-cutting-machine",
    title: "Dome Cutting Machine",
    category: "Finishing",
    summary: "Precision trimming of a container's molded dome or flash using a rotating blade or hot-wire cutter.",
    order: 1,
    tags: ["dome cutting", "trimming", "finishing"],
    content: `## Working Principle

A dome cutting machine removes excess material — a molded dome, flash, or a temporary process cap — from a container at a precise height and cut plane, typically as a finishing step after blow molding or a similar forming process. The container is held and rotated (or the cutting tool orbits the stationary container) while a blade or heated wire makes a clean circumferential cut at the set height.

## Components

- Container clamping/holding fixture
- Rotating spindle (either rotating the container or the cutting head, depending on design)
- Cutting element — a rotary blade, or a heated wire/blade for materials that cut cleaner with heat
- Height/position adjustment mechanism to set the exact cut plane
- Sensors confirming container presence and correct seating before the cut cycle starts

## Electrical Wiring

The cutting spindle motor is typically a simple AC motor or VFD-controlled motor, run continuously or triggered per cycle depending on machine design. If a heated cutting element is used, its temperature is controlled through an SSR-driven heating circuit with feedback from a temperature sensor, similar in principle to a shrink tunnel's zone control but applied to the cutting element itself.

## Pneumatic Diagram

The clamping fixture is usually pneumatically actuated (clamp closed during the cut, released after) — supply air through a solenoid valve to the clamp cylinder, sequenced so clamping is fully confirmed (via a sensor, not just a timer) before the cut motion begins.

## PLC Logic

The clamp-confirm-then-cut sequencing is the safety- and quality-critical part of the logic — cutting before the container is fully clamped risks a bad cut or a safety incident:

\`\`\`
LD   X0             // container presence sensor
OUT  Y0              // engage clamp
LD   Y0
ANI  X1               // X1 = clamp-closed confirmation sensor, wait for it
OUT  M0                // M0 = clamp confirmed
LD   M0
OUT  Y1                 // start cutting cycle only once clamp is confirmed
\`\`\`

## Sequence of Operation

1. Container arrives and is positioned in the fixture
2. Clamp engages; a dedicated sensor (not a timer) confirms the clamp actually closed
3. Cutting cycle begins only after clamp confirmation
4. Spindle rotates the container (or cutting head) through a full revolution at the set height
5. Cut completes, clamp releases
6. Container and separated dome/flash material are ejected or conveyed onward

## Common Faults

- Incomplete or uneven cut — cutting element dull or misaligned, or container not seated evenly in the fixture
- Clamp fails to confirm closed — clamp sensor misadjusted, or an obstruction preventing full clamp travel
- Cut plane inconsistent across containers — height adjustment mechanism drifting, or container height variation exceeding what the fixture compensates for

## Troubleshooting

- If cut quality degrades gradually over a production run rather than failing suddenly, suspect a dulling blade or heated-wire element wear before any control logic issue
- If clamp-confirm failures are frequent, check the sensor's physical adjustment before assuming a pneumatic problem — a sensor positioned at the very edge of its detection range will fail intermittently as tiny mechanical variations shift it in and out of range
- Uneven cuts specific to containers from one mold cavity suggest a container dimensional issue upstream, not a cutting machine fault

## Maintenance

- Replace or sharpen cutting blades on a scheduled interval based on cycle count, not just visible dullness, since cut quality degrades before a blade looks obviously worn
- Verify clamp-confirm sensor position and function regularly, given its safety-relevant role in the sequence
- Check height adjustment mechanism calibration after any changeover to a different container size`,
  },
  {
    slug: "neck-shaving-machine",
    title: "Neck Shaving Machine",
    category: "Finishing",
    summary: "Removing flash from a container's neck/thread area to ensure a clean, properly sealing finish.",
    order: 2,
    tags: ["neck shaving", "trimming", "finishing"],
    content: `## Working Principle

After blow molding, a container's neck and thread area often retains a thin ring of excess material (flash) from the mold parting line. A neck shaving machine rotates the container against a fixed or rotating blade positioned precisely at the neck finish, shaving this flash away to leave a clean, dimensionally correct thread and sealing surface — critical for the cap to seal properly downstream.

## Components

- Container holding/rotating fixture (often a spinning chuck engaging the container body)
- Shaving blade, precisely positioned radially and axially against the neck finish
- Blade height/position adjustment for different neck sizes and finish specifications
- Flash/scrap removal (vacuum extraction or simple collection chute, since the shaved material needs to be cleared away from the process)

## Electrical Wiring

The chuck drive motor is typically a straightforward AC or servo motor providing consistent rotation speed during the shave — consistent RPM matters for cut quality, so speed is a controlled parameter, not just "motor on." Blade position adjustment, where motorized rather than manual, uses a servo or stepper axis with its own feedback for repeatable positioning across changeovers.

## Pneumatic Diagram

The container clamping/chucking action engaging the container for rotation is commonly pneumatic, similar in principle to a dome cutter's clamp — engaged and confirmed before rotation and shaving begin, released after the cycle completes.

## PLC Logic

Speed control during the shave, and confirmed engagement before starting, are the two logic priorities:

\`\`\`
LD   X0              // container in position
OUT  Y0               // engage chuck
LD   Y0
ANI  X1                // chuck-engaged confirmation
OUT  Y2                 // start spindle rotation at set speed (via VFD reference)
TON  T0    K30            // shave dwell — one full rotation plus margin
LD   T0
OUT  Y0                    // disengage chuck, cycle complete
\`\`\`

## Sequence of Operation

1. Container arrives and is positioned at the shaving station
2. Chuck engages and rotation begins, confirmed before proceeding
3. Blade contacts the neck finish at the set position as the container rotates
4. Flash is shaved away over one or more full rotations
5. Rotation stops, chuck disengages
6. Container proceeds downstream; shaved flash material is cleared from the work area

## Common Faults

- Incomplete flash removal — blade position set incorrectly for the current neck size, or blade wear reducing cut depth
- Neck finish damage (over-shaving) — blade positioned too aggressively, or rotation speed mismatched to the blade/material combination
- Inconsistent results across containers — chuck not gripping/centering containers consistently, causing the neck to present at a slightly different position each time

## Troubleshooting

- If results are inconsistent between individual containers rather than uniformly good or bad, focus on the chuck's grip and centering repeatability first, since an inconsistent starting position undermines even a correctly positioned blade
- If flash removal quality degrades gradually across a shift, check blade wear before adjusting position — repositioning to compensate for a dulling blade treats the symptom and delays catching the real wear issue
- Confirm chuck engagement sensor logic and rotation speed independently when troubleshooting, since either alone can produce similar-looking finish defects

## Maintenance

- Replace or resharpen shaving blades on a scheduled interval tied to cycle count, since cut quality degrades measurably before a blade looks visibly worn
- Verify blade position calibration at every container size changeover
- Keep the chuck and container-contact surfaces clean and free of shaved material buildup, which otherwise affects grip consistency over time`,
  },
  {
    slug: "lead-press-machine",
    title: "Lead Press Machine",
    category: "Assembly",
    summary: "Applying controlled, monitored force to press a component into place — force/position feedback over a blind press.",
    order: 1,
    tags: ["press", "force control", "assembly"],
    content: `## Working Principle

A lead press machine (sometimes called an insertion or arbor press in automated form) applies controlled mechanical force to press a component — a connector, bushing, insert, or similar part — into an assembly to a precise depth or until a target force is reached. Unlike a simple pneumatic press that just extends to a fixed position, a monitored press tracks force and/or position through the stroke, which is what actually confirms a correct, fully-seated assembly rather than just "the cylinder moved."

## Components

- Press cylinder (pneumatic, hydraulic, or servo-electric depending on force and precision needs)
- Load cell or pressure sensor providing real-time force feedback
- Linear position sensor (often integrated with a servo axis, or a separate linear encoder) for position feedback
- Tooling specific to the part being pressed
- PLC or dedicated press controller analyzing the force/position curve, not just an endpoint value

## Electrical Wiring

The load cell's signal (typically a low-level mV/V output, often through a dedicated amplifier module) feeds an analog input, and — because press-fit quality analysis depends on the *shape* of the force curve through the stroke, not just a final number — this often runs through a dedicated press-monitoring controller rather than a standard PLC analog input alone, especially for safety- or quality-critical assemblies. Position feedback, if servo-driven, comes through the servo drive's own encoder feedback path.

## Pneumatic Diagram

For pneumatic press designs, supply air through a proportional valve (rather than a simple on/off solenoid) allows some level of force modulation, though pneumatic presses inherently offer less precise force control than hydraulic or servo-electric designs — the choice of actuation technology is itself a design decision driven by how tightly force needs to be controlled for the specific assembly.

## PLC Logic

The core check isn't just "did the cylinder reach position" but whether the force/position relationship through the stroke matched an acceptable window — a rising force at the wrong position, or an absent force rise where one is expected, indicates a bad part or misalignment even if the press completes its stroke:

\`\`\`
LD   M0               // start press cycle
OUT  Y0                // begin press stroke

// continuously monitor during stroke
LD   D100 > D110        // D100 = current force, D110 = max allowable force at this stage
OUT  M10                 // M10 = over-force abort flag
LD   M10
OUT  Y0                   // immediately stop/retract on over-force

LD   D120 >= D130          // D120 = final force, D130 = minimum acceptable seated force
OUT  M11                    // M11 = "properly seated" pass flag
\`\`\`

## Sequence of Operation

1. Part and assembly are positioned and confirmed in the press fixture
2. Press stroke begins, with force and position monitored continuously, not just at the end
3. If force exceeds a safe maximum at any point, the press aborts immediately rather than continuing
4. Press reaches target depth or target force (whichever the process specifies as the completion criterion)
5. Final force/position values are checked against the acceptable window to pass or fail the assembly
6. Press retracts, part is released for the next process step

## Common Faults

- Over-force abort — misaligned part, wrong component in the fixture, or genuine interference from a dimensional issue
- Under-force / not properly seated — component didn't fully insert, often from contamination or a dimensional issue on the mating parts
- Inconsistent force curves on otherwise identical parts — fixture wear or misalignment developing gradually

## Troubleshooting

- If over-force aborts cluster around specific part batches, treat it as a likely incoming-part quality issue before adjusting press force limits to "make it pass" — loosening the limit to avoid nuisance aborts risks accepting genuinely bad assemblies
- If the force curve shape changes gradually over time on the same tooling, suspect fixture or tooling wear rather than a sudden process change
- Cross-check the load cell's zero and calibration periodically — a drifted zero point shifts every subsequent force reading by the same offset, which can silently pass genuinely bad parts or reject genuinely good ones

## Maintenance

- Calibrate the load cell against a known reference on a scheduled interval — force-based quality decisions are only as good as the sensor's calibration
- Inspect press tooling for wear, since worn tooling changes the force required for a given assembly independent of the parts themselves
- Verify fixture alignment periodically, especially after any tooling change or maintenance work on the press`,
  },
];
