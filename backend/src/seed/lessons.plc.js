// Seed lessons for PLC and HMI tracks. Split across a few files purely to
// keep each file readable — seed.js imports and combines all of them.

export const plcLessons = [
  {
    track: "plc",
    slug: "what-is-a-plc-scan-cycle",
    title: "What is a PLC, and how does the scan cycle work?",
    summary: "The three-phase scan cycle that every ladder program runs on, and why it matters for your logic.",
    difficulty: "beginner",
    estimatedMinutes: 8,
    order: 1,
    tags: ["fundamentals", "scan cycle"],
    content: `A PLC (Programmable Logic Controller) doesn't run your ladder program the way a normal computer runs code — top to bottom, once. It runs it in a continuous loop called the **scan cycle**, repeating hundreds of times per second.

## The three phases

1. **Input scan** — the CPU reads every physical input (limit switches, sensors, push buttons) and copies their state into an internal input image table.
2. **Program execution** — the ladder logic runs top to bottom, left to right, using the values frozen in that input table. Any output your logic sets goes into an internal output image table — not directly to the physical output yet.
3. **Output scan** — the CPU copies the output image table to the physical output terminals all at once.

Then it repeats. A typical scan takes a few milliseconds.

## Why this matters practically

Because inputs are only read once per cycle, if a sensor pulses on and off faster than your scan time, the PLC can miss it entirely. This is exactly why fast-changing signals — like a flowmeter's pulse output — go through a dedicated **high-speed counter (HSC)** input, which uses hardware interrupts instead of waiting for the normal scan.

It also explains a subtle bug beginners hit constantly: if you set and reset the same output in different rungs within one scan, only the *last* rung's value survives to the output scan — not whichever one executed "first" in real time.

## Takeaway

Think of the scan cycle as: read everything → think everything → write everything, then repeat. Once this model clicks, a lot of "weird" PLC behavior stops being weird.`,
  },
  {
    track: "plc",
    slug: "ladder-logic-basics-contacts-coils-rungs",
    title: "Ladder logic basics: contacts, coils, and rungs",
    summary: "Reading a ladder diagram like an electrician: normally-open, normally-closed, and how a rung energizes.",
    difficulty: "beginner",
    estimatedMinutes: 10,
    order: 2,
    tags: ["ladder logic", "fundamentals"],
    content: `Ladder logic is drawn to look like an electrical relay schematic, because that's exactly the mental model it replaced. Two vertical lines represent power rails; horizontal lines between them are **rungs**.

## Contacts

- **Normally-open (NO)** contact — symbol \`| |\` — passes power when its bit is TRUE. Use this to ask "is this switch pressed?"
- **Normally-closed (NC)** contact — symbol \`|/|\` — passes power when its bit is FALSE. Use this to ask "is this NOT pressed?" or for e-stops and safety interlocks that fail safe when de-energized.

## Coils

The output element on the right of a rung — symbol \`( )\`. When the rung has continuity (a complete path of energized contacts from left rail to the coil), the coil's bit is set TRUE.

## A simple example

\`\`\`
  X0        X1         Y0
--| |-------| |--------( )--
\`\`\`

This reads: "If input X0 is ON **and** input X1 is ON, energize output Y0." Contacts in series (one after another) behave like an AND. Contacts in parallel branches behave like an OR.

## Start/stop with a seal-in

The classic pattern every beginner should memorize is a **seal-in circuit**:

\`\`\`
  X0(Start)  X1(Stop)        Y0
--| |---------|/|-------------( )--
   Y0
--| |---(parallel branch around X0)
\`\`\`

Pressing Start energizes Y0. Y0's own contact, wired in parallel with the start button, keeps the rung TRUE after the button is released — the coil "seals itself in." Pressing Stop (a normally-closed contact) breaks the rung and de-energizes Y0. This one pattern underlies almost every motor-run circuit you'll ever build.`,
  },
  {
    track: "plc",
    slug: "high-speed-counters-wiring-scaling",
    title: "High-speed counters: wiring and scaling a pulse input",
    summary: "How HSC inputs work on a Delta DVP-series PLC, and how to scale raw pulses into real engineering units.",
    difficulty: "intermediate",
    estimatedMinutes: 14,
    order: 3,
    tags: ["HSC", "Delta PLC", "counters"],
    content: `Normal PLC inputs are only read once per scan cycle, so they can't reliably catch a flowmeter or encoder producing thousands of pulses per second. That's what **high-speed counter (HSC)** inputs are for — dedicated hardware channels that count pulses independently of the scan cycle, using interrupts.

## Wiring on a Delta DVP-series PLC

On a Delta DVP-14SS2, HSC-capable inputs (typically X0–X5) can be configured as single-phase counters. For an NPN-output sensor:
- Sensor **signal (S)** wire → PLC input terminal (e.g. X0)
- Sensor **+V** → 24V supply
- Sensor **0V** → PLC common (S/S terminal), wired for NPN sinking configuration

## Selecting and reading the counter

In WPL Soft, HSC counters like **C235** are 32-bit, single-phase, up-counting registers. Reading the accumulated count uses the paired **HC** register (e.g. HC235), since a standard 16-bit register can't hold large pulse counts without overflowing.

To reset the count: use \`RST C235\` in your logic — commonly triggered at the start of a new batch or fill cycle.

## Scaling pulses to real units

A flowmeter typically specifies pulses-per-unit, e.g. 28.293 pulses per gram. Since ladder logic works in integers, scale by working in larger fixed units:

\`\`\`
DMOV  HC235   D0      // move the 32-bit count into D0/D1
DMUL  D0      K1000   D2   // multiply first to preserve precision
DDIV  D2      K28293  D4   // divide by the scaled pulses-per-unit factor
\`\`\`

This gives you the accumulated fill weight in D4, scaled to match your flowmeter's calibration — the same pattern used for volume-based fill control on a single-head filling machine.

## Common mistake

Dividing before multiplying loses precision to integer truncation. Always multiply up first, then divide — especially when your pulses-per-unit factor isn't a clean round number.`,
  },
];
