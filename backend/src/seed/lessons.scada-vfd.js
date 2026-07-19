export const scadaLessons = [
  {
    track: "scada",
    slug: "scada-vs-hmi",
    title: "SCADA vs HMI: what's the actual difference",
    summary: "HMI is one machine's face. SCADA is the whole plant's nervous system. Here's where the line sits.",
    difficulty: "beginner",
    estimatedMinutes: 8,
    order: 1,
    tags: ["fundamentals", "SCADA vs HMI"],
    content: `These terms get used interchangeably on the floor, but they describe different scopes of a system.

## HMI: one machine, local control

An HMI (Human-Machine Interface) is typically mounted on or near a single machine, talking to one PLC, showing that machine's status and letting an operator control it directly. A filling machine's touchscreen showing fill count and a start/stop button is an HMI.

## SCADA: the whole site, supervisory view

SCADA (Supervisory Control and Data Acquisition) sits above multiple machines, PLCs, and often multiple HMIs across an entire line, building, or site. It aggregates data from all of them into one system for monitoring, historian logging, alarm management, and reporting — and it can issue supervisory commands, but usually doesn't run the tight real-time control loop itself; that stays on the local PLC.

## A concrete example

A bottling plant might have:
- 5 machines, each with its own PLC and local HMI (filling, capping, labeling, shrink tunnel, conveyor)
- 1 SCADA system polling all 5 PLCs, showing a plant-wide overview screen, logging production counts to a historian, and emailing a report every shift

If the SCADA server goes offline, each machine keeps running under its own PLC/HMI — SCADA is supervisory, not the thing keeping the line safe in real time.

## Why the distinction matters

Architecting a system without this separation is a common mistake: putting real-time safety logic in a SCADA layer that depends on a network connection to a machine three buildings away is a reliability risk. Real-time control belongs on the local PLC; SCADA's job is visibility and coordination across many of them.`,
  },
  {
    track: "scada",
    slug: "tag-database-naming-conventions",
    title: "Tag databases: naming conventions that scale",
    summary: "A messy tag list works fine at 50 tags and becomes unmanageable at 5,000. Build the convention early.",
    difficulty: "intermediate",
    estimatedMinutes: 9,
    order: 2,
    tags: ["tag database", "naming"],
    content: `Every point your SCADA system reads or writes — a sensor value, a motor status, a setpoint — is a **tag**. On a small system you can get away with sloppy names like \`Tank1\` and \`Motor_B\`. On a plant-wide system with thousands of tags across dozens of machines, an inconsistent naming scheme becomes a genuine operational hazard — engineers misidentify tags during troubleshooting.

## A structured pattern

A widely used approach is a hierarchical, delimited structure:

\`\`\`
AREA.MACHINE.DEVICE.SIGNAL
FILL01.M01.PUMP01.RUN_STATUS
FILL01.M01.TANK01.LEVEL_PCT
CAP02.M03.TORQUE01.SETPOINT
\`\`\`

This lets you filter and search tags by area, by machine, or by device type, and it scales predictably as more machines get added — new equipment just extends the pattern rather than requiring a new one.

## Keep signal suffixes consistent

Standardize suffixes across the whole plant, not per-machine:
- \`_STATUS\` for a boolean run/stop or ok/fault state
- \`_PCT\` for a 0–100% scaled analog value
- \`_SP\` for a setpoint (as opposed to \`_PV\` for a process value)
- \`_ALM\` for an alarm bit

## Document it once, enforce it everywhere

The convention only has value if everyone follows it. A one-page naming standard document, referenced in every new project's kickoff, prevents each engineer from inventing their own scheme — which is how most tag databases end up messy in the first place.`,
  },
  {
    track: "scada",
    slug: "historians-logging-data",
    title: "Historians: logging data without drowning in it",
    summary: "Choosing what to log, at what interval, so your historian is useful instead of just huge.",
    difficulty: "intermediate",
    estimatedMinutes: 9,
    order: 3,
    tags: ["historian", "data logging"],
    content: `A historian is a database purpose-built for time-series data — it stores a tag's value at successive points in time so you can later ask "what was this doing at 3am last Tuesday?" Logging everything at the fastest possible rate feels safe, but it usually just produces a huge, hard-to-query database that still doesn't answer the questions engineers actually ask.

## Match the logging interval to how fast the value actually changes

- A tank temperature drifting over minutes doesn't need per-second logging — every 10–30 seconds is plenty and cuts storage dramatically.
- A fast process value tied to quality control (like fill weight per cycle) may genuinely need per-event logging, not time-based at all.

## Log events, not just values, where it matters

For anything tied to a discrete action — a batch start, a recipe change, a fault occurring — log it as a **timestamped event** rather than relying on someone reconstructing it from a value trend later. Most historians support this alongside time-series tags.

## Use deadband logging for slow-changing analog values

Many historians support "log only if the value changed by more than X" instead of "log every N seconds" — this alone can cut storage for stable analog signals by an order of magnitude without losing any meaningful information.

## Plan retention deliberately

Raw, full-resolution data for the last 30–90 days, then automatically roll up to hourly or daily averages for long-term trend analysis, is a common and practical retention pattern — full resolution forever is rarely necessary and rarely affordable.`,
  },
];

export const vfdLessons = [
  {
    track: "vfd",
    slug: "vfd-basics-what-it-does",
    title: "VFD basics: what a variable frequency drive actually does",
    summary: "How changing frequency changes motor speed, and why VFDs save energy on variable loads.",
    difficulty: "beginner",
    estimatedMinutes: 9,
    order: 1,
    tags: ["fundamentals"],
    content: `An AC induction motor's speed is directly tied to the frequency of the power feeding it — roughly, speed is proportional to frequency (with some slip). A motor built for 50Hz mains power spins at a fixed speed as long as it's fed 50Hz. A **VFD (Variable Frequency Drive)** sits between the mains supply and the motor, and instead of passing raw 50Hz through, it converts incoming AC to DC, then synthesizes a new AC waveform at whatever frequency you command — letting you run that same motor anywhere from a slow crawl to above its rated speed.

## The three stages inside a VFD

1. **Rectifier** — converts incoming AC to DC
2. **DC bus** — smooths and stores that DC (capacitors)
3. **Inverter** — uses fast-switching transistors (IGBTs) to chop the DC back into a synthesized AC waveform at the commanded frequency

## Why this matters for energy and process control

Before VFDs were common, controlling flow from a fixed-speed pump meant throttling a valve — the pump ran at full speed regardless, wasting energy against a partially closed valve. A VFD instead slows the pump itself to match the actual demand, which on variable-flow applications can cut energy use substantially, since power draw on a centrifugal pump or fan drops roughly with the cube of speed.

## Beyond just speed control

VFDs also give you controlled acceleration and deceleration ramps (soft-starting a conveyor instead of slamming it to full speed), torque control modes for tensioning applications, and built-in motor protection — all things a simple contactor-and-motor setup can't do on its own.`,
  },
  {
    track: "vfd",
    slug: "reading-a-vfd-parameter-sheet",
    title: "Reading a VFD parameter sheet without panic",
    summary: "The handful of parameters that matter on almost every commissioning, and what they actually control.",
    difficulty: "intermediate",
    estimatedMinutes: 12,
    order: 2,
    tags: ["parameters", "commissioning"],
    content: `A VFD parameter manual can run to 300+ numbered parameters, which is intimidating the first time you open one. In practice, the vast majority of commissioning jobs only touch a small, consistent subset.

## The core motor nameplate group

These should always match the motor's nameplate exactly:
- **Rated voltage** — motor's rated line voltage
- **Rated current** — motor's rated full-load amps (critical for correct overload protection)
- **Rated frequency** — usually 50Hz or 60Hz
- **Rated speed (RPM)** — used by the drive to calculate slip compensation

Getting these wrong doesn't just cause poor performance — it can let the drive's motor protection under- or over-trip, either nuisance-tripping a healthy motor or failing to protect an overloaded one.

## Acceleration and deceleration time

Set independently, these define how many seconds the drive takes to ramp from 0 to max frequency (accel) and back down (decel). Too short causes overcurrent trips and mechanical shock; too long makes a process sluggish. Conveyor and pump applications typically want smooth, longer ramps (several seconds); some applications need fast response.

## Minimum and maximum frequency

Sets the usable speed range. A minimum frequency above 0Hz is common on pumps and fans to avoid running below a speed where cooling airflow or lubrication becomes inadequate.

## Control source selection

Determines whether the drive takes its run command and speed reference from its own keypad, external terminals (a simple run contact plus a 0–10V or 4-20mA speed signal), or a fieldbus network like Modbus. Getting this parameter wrong is the single most common reason a newly wired VFD "does nothing" on first power-up — the drive is still listening to the keypad, not the terminals you wired.`,
  },
  {
    track: "vfd",
    slug: "common-vfd-faults-diagnosis",
    title: "Common VFD faults and how to diagnose them",
    summary: "Overcurrent, overvoltage, and ground fault trips — what usually causes each one on the floor.",
    difficulty: "intermediate",
    estimatedMinutes: 11,
    order: 3,
    tags: ["troubleshooting", "faults"],
    content: `Most VFD fault codes cluster into a handful of root causes. Recognizing the pattern saves a lot of guesswork.

## Overcurrent (OC) trip

The most common trip on the floor. Usual causes, roughly in order of likelihood:
- Acceleration time set too short for the load's inertia — the motor can't spin up fast enough to keep up with the commanded frequency ramp
- A mechanically jammed or overloaded load
- Motor parameters mismatched to the actual motor (see the parameter sheet lesson)

Start by checking the accel time before assuming a mechanical problem — it's the cheapest thing to test.

## Overvoltage (OV) trip, usually on deceleration

This happens when a spinning motor's inertia keeps driving it forward faster than the drive is commanding during a fast decel — the motor briefly acts as a generator, pumping energy back into the DC bus faster than it can dissipate. Fixes: lengthen the decel time, or add a **braking resistor** to burn off that regenerated energy as heat.

## Ground fault

Indicates current is leaking to ground somewhere in the motor or cable rather than returning fully through the intended path. Check motor cable insulation and the motor's own insulation resistance (megger test) before suspecting the drive itself — the drive is usually just reporting a real fault, not causing one.

## Undervoltage / phase loss

Points upstream of the drive — a loose incoming power connection, a blown fuse on one phase, or an unstable mains supply. Check incoming line voltage on all phases before touching drive parameters.

## The habit worth building

Before adjusting any parameter to "make a fault go away," ask what physically changed right before the fault started appearing — a new load, a mechanical repair, a different operator running the line differently. Faults are usually the drive correctly reporting a real condition, not a drive malfunction.`,
  },
];
