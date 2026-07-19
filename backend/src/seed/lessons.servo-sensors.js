export const servoLessons = [
  {
    track: "servo",
    slug: "servo-vs-stepper",
    title: "Servo vs stepper: choosing the right motion system",
    summary: "Closed-loop feedback vs open-loop stepping, and when each one is the right — and cheaper — choice.",
    difficulty: "beginner",
    estimatedMinutes: 9,
    order: 1,
    tags: ["fundamentals", "motor selection"],
    content: `Both servo and stepper systems give you precise, programmable motion, but they get there differently, and picking the wrong one for the application means either overpaying or under-delivering.

## Stepper motors: open-loop, step-by-step

A stepper motor moves in fixed angular increments per pulse, with no feedback confirming it actually reached that position — the driver assumes each commanded step happened. This works well and is inexpensive as long as the load never exceeds the motor's available torque; if it does, the motor can **stall or lose steps** silently, and the controller has no way to know.

## Servo motors: closed-loop, feedback-verified

A servo motor pairs a motor with an encoder that continuously reports actual position back to the drive. The drive constantly compares commanded position against actual position and corrects the error in real time. If the load pushes back or the motor is momentarily blocked, the system knows immediately and can fault out safely instead of silently drifting out of position.

## Practical decision points

- **Load varies or is uncertain** → servo, because open-loop stepping has no way to detect a missed step under unexpected load
- **High speed with high accuracy needed simultaneously** → servo generally outperforms stepper at speed
- **Cost-sensitive, load is predictable and well within motor capability** → stepper is often the more economical choice
- **Position verification matters for safety or quality** → servo's closed-loop feedback gives you that confirmation; stepper does not

## A common real-world pattern

Many machines use steppers for low-stakes auxiliary motion (like an indexing feed) and reserve servos for axes where losing position silently would cause scrap or a safety issue — matching motion technology to the actual risk of that specific axis, rather than using one technology for the whole machine by default.`,
  },
  {
    track: "servo",
    slug: "pid-tuning-for-servo-loops",
    title: "Understanding PID tuning for servo loops",
    summary: "What proportional, integral, and derivative gains each actually do to a servo's response.",
    difficulty: "advanced",
    estimatedMinutes: 13,
    order: 2,
    tags: ["PID", "tuning"],
    content: `A servo drive's job is to make the motor's actual position match the commanded position as closely and quickly as possible, without overshooting or oscillating. PID (Proportional-Integral-Derivative) control is the standard mechanism most drives use to do this.

## Proportional (P) gain

Reacts to the *current* position error — how far off the motor is right now. Higher P gain means a stronger, faster correction, which sounds good until it's too high: the system starts overshooting the target and oscillating, because it's correcting harder than the physical system can absorb smoothly.

## Integral (I) gain

Reacts to *accumulated* error over time — it's what eliminates small, persistent steady-state error that pure P gain leaves behind (for example, a servo that settles just slightly short of the exact commanded position under a constant load). Too much I gain causes slow, rolling oscillation and can make the system sluggish to respond to new commands, because it's still "unwinding" past accumulated error.

## Derivative (D) gain

Reacts to the *rate of change* of error — essentially it dampens the system, resisting sudden changes and reducing overshoot. It acts like a shock absorber for the P term's aggressiveness, but too much D gain amplifies electrical noise from the encoder signal into jittery, unstable motor behavior.

## A practical tuning approach

1. Start with I and D at zero, and increase P until the axis responds quickly but just starts to show slight overshoot
2. Back P off slightly from that point
3. Add D gradually to damp out the overshoot without introducing jitter
4. Add I only if there's a persistent steady-state error remaining, increasing slowly since I is the gain most likely to introduce slow oscillation if pushed too far

## Why this matters beyond "textbook tuning"

A poorly tuned axis doesn't just perform badly — it can genuinely damage mechanical components over time from repeated overshoot and correction cycling, or wear out faster from constant micro-oscillation. Tuning isn't just a performance nicety; it's part of protecting the machine.`,
  },
  {
    track: "servo",
    slug: "commissioning-a-servo-axis",
    title: "Commissioning a servo axis: homing and limits",
    summary: "Why every servo axis needs a known reference point before it can move safely.",
    difficulty: "intermediate",
    estimatedMinutes: 10,
    order: 3,
    tags: ["commissioning", "homing"],
    content: `A servo drive tracks position relative to wherever it was when it powered up or was last referenced — it has no inherent knowledge of where "home" is in your machine unless you establish it. Commissioning a new axis always starts with solving that problem before any programmed motion is safe to run.

## Homing methods

- **Home switch** — a dedicated sensor at a known physical position; the axis moves slowly toward it, and the moment the switch triggers, that position is set as the reference (often position zero, or offset from it)
- **Mechanical hard stop** — the axis drives slowly into a physical end-of-travel stop and uses a current or torque spike to detect contact, then backs off slightly and zeroes from there — used when a dedicated home sensor isn't practical
- **Absolute encoder** — some servo systems use an encoder that retains absolute position even through a power cycle, eliminating the need to re-home every startup, at a higher hardware cost

## Software and hardware limits

Two separate layers of protection should always exist together, not one instead of the other:
- **Software limits** — position values programmed into the drive or PLC beyond which commanded motion is rejected; these are the first line of defense but only work if the drive's logic is functioning correctly
- **Hardware limit switches** — physical sensors that cut motion (often directly, at the drive or safety circuit level) regardless of what the software thinks the position is; this is the backstop for when software position tracking has drifted or failed

## The habit worth building

Never trust software position alone as the only thing standing between a servo axis and a mechanical crash. If the encoder cable is damaged or the axis loses reference for any reason, the software's idea of "position" can become wrong while still reporting confidently — hardware limits exist precisely for that failure mode.`,
  },
];

export const sensorLessons = [
  {
    track: "sensors",
    slug: "inductive-proximity-sensors",
    title: "Inductive proximity sensors: how they work and when to use them",
    summary: "Detecting metal without contact, sensing range, and shielded vs unshielded mounting.",
    difficulty: "beginner",
    estimatedMinutes: 8,
    order: 1,
    tags: ["proximity sensors"],
    content: `An inductive proximity sensor detects metal objects without physical contact by generating a high-frequency electromagnetic field at its sensing face. When a metallic target enters that field, it induces eddy currents in the target, which draws energy from the sensor's oscillator — the sensor detects that energy loss and switches its output.

## Only detects metal

This is the key limitation to remember: inductive sensors only respond to metallic targets, and even then, sensing range varies by metal type — a sensor rated for a certain range on mild steel will typically sense a much shorter range on aluminum or brass, because different metals generate eddy currents with different efficiency.

## Shielded vs unshielded

- **Shielded (flush-mountable)** — the sensing field is contained close to the face, so the sensor can be mounted flush with surrounding metal without false triggering, at the cost of shorter sensing range
- **Unshielded (non-flush)** — the field extends further, giving longer range, but requires clearance around the sensor face so nearby metal doesn't cause a false detection

## Typical wiring (NPN vs PNP)

Both are common in industrial settings and are not interchangeable without matching PLC input wiring:
- **NPN (sinking)** — output switches to 0V (common) when active; the PLC input module must be wired for sinking inputs
- **PNP (sourcing)** — output switches to +V when active; the PLC input module must be wired for sourcing inputs

Wiring an NPN sensor into a PNP-configured input (or vice versa) is one of the most common "the sensor isn't working" troubleshooting calls, when the sensor itself is often perfectly fine.

## When to reach for something else

If the target isn't metal — plastic, glass, liquid level, a person — an inductive sensor simply won't detect it, no matter how close. That's the cue to look at photoelectric, capacitive, or ultrasonic sensing instead.`,
  },
  {
    track: "sensors",
    slug: "photoelectric-sensors-types",
    title: "Photoelectric sensors: through-beam, retroreflective, diffuse",
    summary: "Three ways to detect an object with light, and the tradeoffs between reliability and installation effort.",
    difficulty: "beginner",
    estimatedMinutes: 9,
    order: 2,
    tags: ["photoelectric sensors"],
    content: `Photoelectric sensors detect objects by sensing changes in a light beam, and come in three main configurations with genuinely different tradeoffs — the right choice depends on the application, not just cost.

## Through-beam

Uses two separate units — an emitter and a receiver — mounted facing each other, with the target passing between them. Detection happens when the target physically blocks the beam.

- **Most reliable** of the three types, works over the longest range, and is least affected by the target's color or surface finish, since it only cares about blocking a beam
- Requires aligning and wiring two separate units, which is more installation effort and cost

## Retroreflective

A single unit emits light toward a separate reflector (a special prismatic mirror), and detects the target when it interrupts the light on its way to or from that reflector.

- Only one active unit to wire, simpler installation than through-beam
- Can struggle with **shiny or reflective targets**, since a glossy surface on the target itself can reflect enough light back to the sensor to cause a false "no detection" reading

## Diffuse

A single self-contained unit emits light and directly detects light reflecting back off the target itself — no separate reflector or receiver needed at all.

- Simplest installation, only one point to mount and wire
- **Least consistent range and reliability**, since detection depends heavily on the target's color, surface finish, and angle — a dark or matte target reflects far less light back than a light, glossy one, and sensing range can vary significantly between targets

## Choosing between them

If reliability matters and you can mount two units, go through-beam. If you need single-side mounting and targets are relatively consistent, retroreflective is a solid middle ground. Diffuse suits close-range, simple presence detection where installation simplicity outweighs precision.`,
  },
  {
    track: "sensors",
    slug: "4-20ma-vs-0-10v-wiring",
    title: "4-20mA vs 0-10V: analog signal wiring basics",
    summary: "Why current loops dominate industrial analog wiring, and how to wire and troubleshoot each.",
    difficulty: "intermediate",
    estimatedMinutes: 10,
    order: 3,
    tags: ["analog signals", "wiring"],
    content: `Analog sensors — pressure transmitters, flow sensors, temperature transmitters — commonly output either a voltage signal (0–10V) or a current signal (4-20mA). They're not interchangeable without matching the receiving input card, and each has real practical tradeoffs.

## Why 4-20mA dominates long industrial cable runs

A current signal (as opposed to voltage) stays accurate over long cable distances and isn't affected by voltage drop across the wire's resistance, because the loop is designed to push the same current through regardless of wire resistance, within the loop's voltage budget. A 0–10V signal, by contrast, can lose accuracy over long runs as voltage drops along resistive cable, and is more susceptible to electrical noise pickup.

## Why the "4" and not "0"

Starting the live range at 4mA rather than 0mA means **0mA is a distinguishable fault condition** — a broken wire, disconnected sensor, or power loss all show up as 0mA, which the PLC can clearly interpret as "signal missing" rather than confusing it with a legitimate reading of the low end of the range. A 0-20mA signal doesn't have that built-in fault detection.

## Basic 2-wire current loop wiring

A common 2-wire (loop-powered) transmitter uses the same two wires to both power the sensor and carry the signal:

\`\`\`
24V+ ---> Transmitter(+) ... Transmitter(-) ---> PLC Analog Input(+)
                                                   PLC Analog Input(-) ---> 0V
\`\`\`

The loop current itself is what carries the measurement — the PLC's analog input card measures that current, not a voltage.

## Quick troubleshooting checks

- Reading stuck at 0mA → check for a broken wire, blown loop fuse, or a de-energized transmitter, since 0mA is the designed fault indicator
- Reading pegged at or above 20mA → possible sensor fault or the process value is genuinely outside the sensor's calibrated range
- Unstable, jumpy reading → suspect a wiring or grounding issue rather than the sensor itself, especially if the readings settle down when cable routing is moved away from motor or VFD power cables`,
  },
];
