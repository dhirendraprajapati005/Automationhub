export const machinesBatch1 = [
  {
    slug: "filling-machine",
    title: "Single-Head Filling Machine",
    category: "Filling & Dosing",
    summary: "Volume-based liquid filling using a flowmeter pulse count and a scaled fill-to-target ladder routine.",
    order: 1,
    tags: ["filling", "flowmeter", "Delta PLC"],
    content: `## Working Principle

A single-head filling machine dispenses a target volume of liquid into a container by opening a fill valve and monitoring a flowmeter's pulse output until the accumulated count corresponds to the target volume, then closing the valve. Unlike time-based filling (open valve for X seconds), volume-based filling stays accurate even as line pressure or viscosity varies slightly, because it's measuring actual delivered volume, not assuming a fixed flow rate.

## Components

- Flowmeter (pulse output, calibrated pulses-per-unit)
- Pneumatic fill valve (2/2 or 3/2 solenoid-actuated)
- Container presence sensor (photoelectric or inductive, depending on container material)
- Nozzle with drip-stop or anti-glug air vent
- PLC with a high-speed counter input
- HMI for target volume entry and fill count display

## Electrical Wiring

The flowmeter's pulse output wires into a dedicated HSC-capable input (e.g. X0 on a Delta DVP-14SS2) — never a standard scan-cycle input, since fill-rate pulse frequency is far too fast for a normal scan to catch reliably. The fill valve solenoid is driven through an output relay or transistor output, not directly from the PLC output terminal, to protect the PLC from the solenoid's inductive kickback.

## Pneumatic Diagram

Supply air → FRL unit → 2/2 or 3/2 solenoid valve → fill valve actuator. A flow control valve at the actuator lets you tune how fast the fill valve opens/closes, which affects how much liquid passes during the valve's own transition time — relevant for high-precision fills where that transition volume isn't negligible.

## PLC Logic

The core routine resets the high-speed counter at the start of each fill, then compares the scaled count against the target:

\`\`\`
RST  C235                    // reset the HSC at fill start
SET  Y0                      // open fill valve

// scan loop: scale raw pulses to target units
DMOV HC235   D0               // read accumulated pulses
DMUL D0      K1000  D2        // scale up before dividing
DDIV D2      K28293 D4        // D4 = current fill in grams

LD>= D4      D10              // D10 = target volume register
OUT  M10                      // M10 = target reached flag

LD   M10
RST  Y0                       // close fill valve
\`\`\`

## Sequence of Operation

1. Container arrives, presence sensor confirms position
2. HSC counter resets to zero
3. Fill valve opens (Y0 set)
4. Ladder logic continuously scales the pulse count and compares against target
5. When target is reached, fill valve closes
6. Brief dwell time allows drips to settle before the container indexes away
7. Cycle repeats for the next container

## Common Faults

- Fill valve fails to close (stuck open) — overfill, usually a solenoid or valve seat issue
- No pulses received — flowmeter wiring fault, or air trapped in the line reading as no flow
- Consistent under-fill across all containers — pulses-per-unit calibration factor drifted from actual, or line pressure dropped below what the flowmeter was calibrated at

## Troubleshooting

- If fills are consistently off by a fixed percentage, check the calibration factor first before suspecting the flowmeter itself — a scaling constant that's slightly wrong produces a proportional, repeatable error
- If fills are inconsistent (varying container to container), suspect air entrainment in the liquid line, or a fill valve that isn't opening/closing at a consistent speed
- Use the HMI's live pulse count display during a manual test fill to confirm the HSC is actually counting before troubleshooting anything else in the fill logic

## Maintenance

- Periodically verify flowmeter calibration against a known reference volume, since long-term drift is common on mechanical flowmeters
- Inspect fill valve seals for wear — a worn seal causes the exact "fails to fully close" fault described above
- Check nozzle anti-drip components for buildup, especially with viscous or sugary products`,
  },
  {
    slug: "leak-testing-machine",
    title: "Bottle Leak Detection Machine",
    category: "Quality & Inspection",
    summary: "Pressure-drop leak detection: pressurize the sealed container and measure how fast pressure falls.",
    order: 1,
    tags: ["leak testing", "pressure drop", "Delta PLC", "DVP-04AD-S2"],
    content: `## Working Principle

A sealed, empty container is clamped and pressurized to a set test pressure with compressed air. The system then monitors pressure over a fixed dwell period. A good, leak-free container holds pressure with only a small, predictable drop (from temperature equalization and normal system tolerance). A container with a leak — a pinhole, a bad seam, a cracked base — loses pressure faster than that threshold, and the machine rejects it. This is a non-destructive, fast, repeatable method well suited to 100% inline inspection rather than sampling.

## Components

- Analog pressure transducer feeding an analog input module (e.g. Delta DVP-04AD-S2)
- Test head / sealing cups that clamp onto the container opening
- Pneumatic cylinder to raise/lower the test head
- Solenoid valve to admit test air into the sealed container
- PLC for the pressure-drop percentage calculation
- HMI showing live pressure, pass/fail result, and reject count

## Electrical Wiring

The pressure transducer's analog output (commonly 4-20mA) wires into the analog input module's dedicated terminals, with shielded cable recommended and shield grounded at one end only to avoid ground loop noise affecting the reading. The test head cylinder's solenoid, sealing solenoid, and reject actuator are all discrete outputs, ideally each through its own output relay for isolation.

## Pneumatic Diagram

Supply air splits into two paths: one through a precision regulator down to test pressure, feeding the test solenoid into the sealed container; the other, at normal working pressure, driving the test head clamp cylinder. Keeping these on separate regulated branches prevents the clamp cylinder's air draw from disturbing the precise test pressure.

## PLC Logic

The core calculation compares pressure at the start and end of the dwell period as a percentage drop, since a percentage is more robust to normal ambient/thermal variation than a raw pressure difference:

\`\`\`
// at start of dwell
MOV  D100    D102          // D102 = starting pressure snapshot

// after dwell timer T0 expires
SUB  D102    D100    D104   // D104 = pressure drop
DMUL D104    K1000   D106
DDIV D106    D102    D108   // D108 = drop as a scaled percentage

LD>  D108    D20            // D20 = reject threshold
OUT  M20                     // M20 = reject flag
\`\`\`

## Sequence of Operation

1. Container arrives and is clamped by the test head
2. Sealing solenoid engages, admitting test air to reach set pressure
3. Brief stabilization delay lets pressure settle before measurement begins
4. Starting pressure is captured
5. Dwell timer runs; pressure is monitored (and can be trended, not just checked at the end)
6. Ending pressure is captured, percentage drop calculated
7. Pass: container releases to the line. Fail: reject actuator diverts the container
8. Test head retracts, cycle repeats

## Common Faults

- False rejects on good containers — usually a seal issue at the test head itself (worn sealing cup), not the container
- False passes on genuinely leaking containers — test pressure set too low to detect small leaks within the dwell time, or dwell time too short
- Erratic pressure readings — check the analog module's wiring and grounding before suspecting the transducer

## Troubleshooting

- If reject rate suddenly jumps across all containers, check the test head seal first — a worn or misaligned sealing cup will leak air around the seal itself, mimicking a container leak on every single test
- If reject rate is inconsistent in a pattern matching a specific mold cavity or supplier batch, that's likely a genuine container quality issue, not a machine fault
- Verify the analog input's scaling parameters match the transducer's actual output range — a transducer swapped for a different range without updating PLC scaling will produce plausible-looking but wrong readings

## Maintenance

- Replace sealing cups on a scheduled interval, not just on failure — a slowly degrading seal produces gradually increasing false rejects that are easy to misattribute to "bad containers lately"
- Periodically verify the pressure transducer against a calibrated reference gauge
- Check dwell and stabilization timer settings after any product changeover, since containers of different volumes stabilize at different rates`,
  },
  {
    slug: "rotary-capping-machine",
    title: "Rotary Capping Machine",
    category: "Capping & Closing",
    summary: "Continuous-motion cap application using a rotating turret, star wheels, and torque-controlled chucks.",
    order: 1,
    tags: ["capping", "torque control", "rotary"],
    content: `## Working Principle

A rotary capping machine applies caps to moving containers without stopping the line, using a rotating turret synchronized with the infeed conveyor. Containers are picked up by star wheels, carried through the turret at a matched speed, and capping chucks — spinning and pressing down simultaneously via a cam-follower mechanism — thread or press the cap on as the container travels through the arc. This continuous-motion approach achieves far higher throughput than an indexing (stop-and-cap) design.

## Components

- Infeed and outfeed star wheels, timed to the turret
- Rotating turret carrying multiple capping chucks
- Cap feeder (sorts and orients caps, feeds them into a chute)
- Capping chucks with torque-limiting clutches
- Cam-follower mechanism controlling chuck vertical motion through the rotation
- Servo or geared motor driving turret rotation, synchronized to line speed

## Electrical Wiring

The turret drive motor (servo or VFD-controlled induction motor) receives its speed reference synchronized to the conveyor's actual speed, typically via an encoder on the conveyor feeding a scaled reference to the turret drive — not a fixed independent speed, since any mismatch between conveyor and turret speed causes container jams or missed caps at the star wheel handoff points.

## Pneumatic Diagram

If the chuck engagement (down-pressure) is pneumatically assisted rather than purely cam-driven, a rotating air union feeds air through the turret's rotating shaft to each chuck's cylinder — a rotary union is required specifically because the turret itself is continuously rotating, unlike a stationary machine's fixed air lines.

## PLC Logic

Line-speed synchronization is the core control problem, more than any single ladder rung:

\`\`\`
// scale conveyor encoder pulses to a turret speed reference
DMOV HC235    D0            // conveyor encoder accumulated count
DMUL D0       K1000  D2
DDIV D2       K[scale] D4    // D4 = scaled speed reference

MOV  D4       D500           // D500 = turret VFD/servo speed setpoint register
\`\`\`

Cap feeder low-level and jam sensors feed interlocks that pause the turret (or signal a fault) rather than let it run empty or crash a jammed cap feed into the chucks.

## Sequence of Operation

1. Containers arrive on the infeed conveyor at line speed
2. Infeed star wheel picks up each container and hands it into the turret
3. As the container rotates through the turret arc, the cam-follower lowers the capping chuck onto the cap
4. The chuck spins (via friction drive or geared drive) to thread/press the cap while torque is monitored against the clutch's set limit
5. Cam profile lifts the chuck as the container approaches the outfeed arc
6. Outfeed star wheel hands the capped container back to the outfeed conveyor

## Common Faults

- Under-torqued caps (loose) — clutch torque setting too low, or worn clutch friction surfaces
- Over-torqued caps (cracked or stripped threads) — clutch setting too high, or a clutch that's stuck/not slipping when it should
- Missed cap pickup — cap feeder starving the chucks, usually a feeder jam or low cap level
- Container jam at star wheel handoff — turret/conveyor speed synchronization drifted out of tolerance

## Troubleshooting

- If torque issues appear on only certain chucks (not all), the fault is almost always in that specific chuck's clutch, not a systemic setting
- If star wheel jams recur at the same point in the cycle, check speed synchronization first — cam and mechanical timing rarely drift on their own, but a slipping encoder coupling or a VFD parameter reset will
- Test cap feeder orientation sensors independently from the rest of the machine when caps are being picked up in the wrong orientation

## Maintenance

- Inspect and re-torque-test capping chucks on a scheduled interval, since clutch friction surfaces wear gradually and torque drifts before it fails outright
- Keep the cap feeder's sorting rails and sensors clean — buildup here is a very common source of intermittent, hard-to-diagnose jams
- Verify turret/conveyor speed synchronization after any conveyor drive maintenance or encoder replacement`,
  },
];
