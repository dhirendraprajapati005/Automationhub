export const machinesBatch2 = [
  {
    slug: "labeling-machine",
    title: "Labeling Machine",
    category: "Labeling & Packaging",
    summary: "Applying pressure-sensitive labels using a servo-driven dispense edge synchronized to container speed.",
    order: 1,
    tags: ["labeling", "servo", "packaging"],
    content: `## Working Principle

A pressure-sensitive labeling machine peels a label off its backing liner at a sharp dispense edge and applies it to a moving container. As the liner sharply bends around the edge, the stiffer label can't follow the tight bend and peels away, presenting it for application right at the point the container passes. Label placement accuracy depends on precisely synchronizing when the label starts dispensing to the container's actual position and speed — not fixed timing alone.

## Components

- Label roll unwind stand with dancer arm or tension sensor
- Dispense edge (peel plate)
- Servo motor driving the label web at a speed matched to line speed
- Container presence/registration sensor (often a photoelectric sensor detecting the container's leading edge)
- Rewind stand collecting the spent backing liner
- Wipe-down or brush/roller to press the applied label firmly onto the container

## Electrical Wiring

The servo drive controlling label web speed receives its position/speed command from the PLC, which itself derives container speed from a line encoder — the same synchronization principle as a rotary capper, but here driving label dispense speed rather than a rotating turret. The container registration sensor's signal timing is critical and typically wired to a fast input, since the trigger point directly determines label placement position on the container.

## Pneumatic Diagram

Many labeling machines use minimal pneumatics beyond a wipe-down cylinder or a container-holding mechanism during application; the core dispensing motion is electrically (servo) driven, not pneumatic, which is what gives modern labelers their placement precision.

## PLC Logic

The registration sensor trigger starts a servo-driven dispense move, offset by a programmable delay to fine-tune placement position:

\`\`\`
LD   X2                      // container registration sensor triggers
TON  T0        K[delay]       // programmable placement delay
LD   T0
CALL SVON_DISPENSE            // trigger servo dispense move for one label length
\`\`\`

Label gap sensing (detecting the gap between labels on the liner, not just container position) is a second, independent sensor loop that stops the dispense servo at exactly one label length, preventing over- or under-feed drift over a long roll.

## Sequence of Operation

1. Container arrives, registration sensor detects its leading edge and position
2. PLC calculates dispense start timing based on container speed and placement offset
3. Servo drives the label web forward at matched speed, presenting the label at the peel edge as the container passes
4. Label transfers onto the container as it passes beneath the dispense edge
5. Wipe-down mechanism presses the label firmly to eliminate air bubbles and ensure adhesion
6. Label gap sensor confirms exactly one label was dispensed before the next cycle

## Common Faults

- Label placement drifting gradually along the container — servo/line speed synchronization losing sync, often from an encoder coupling slipping
- Labels applied crooked or wrinkled — web tension too loose or too tight, or a dirty/worn peel edge
- Missed labels — label gap sensor fault, or the roll running low/out without a low-roll interlock catching it

## Troubleshooting

- If placement drift is gradual and progressive rather than random, suspect mechanical slip (encoder coupling, drive belt) over an electronic fault
- Crooked labels concentrated at one edge of the roll, rather than randomly, usually point to web tracking/guide misalignment, not the dispense logic
- Test the gap sensor's signal on the HMI or a diagnostic screen while manually feeding a short length of label web, to confirm it's reliably detecting each gap before troubleshooting anything downstream

## Maintenance

- Clean the peel edge regularly — adhesive buildup here degrades peel consistency gradually, which shows up as increasingly inconsistent placement over time
- Check unwind dancer arm or tension sensor calibration after any roll size or label stock change
- Inspect wipe-down rollers/brushes for wear, since a worn wipe-down mechanism stops fully pressing labels flat even when dispensing itself is working correctly`,
  },
  {
    slug: "shrink-tunnel",
    title: "Shrink Tunnel",
    category: "Labeling & Packaging",
    summary: "Applying controlled heat to shrink film or sleeve labels tightly around a container or pack.",
    order: 2,
    tags: ["shrink wrap", "heat control", "packaging"],
    content: `## Working Principle

A shrink tunnel applies controlled hot air (or infrared heat, in some designs) to a loosely fitted shrink film or sleeve as it passes through on a conveyor, causing the film to contract tightly around the product or container. Getting this right is a balance: too little heat or too short a dwell leaves the film loose and wrinkled; too much heat distorts or scorches the film, or overheats the product inside.

## Components

- Enclosed tunnel with heating elements (hot air blowers or infrared emitters)
- Mesh or roller conveyor belt (mesh allows hot air to circulate around and beneath the product)
- Temperature sensors (typically multiple zones) feeding closed-loop temperature control
- Variable-speed conveyor drive to control dwell time in the tunnel
- Cooling section immediately after the tunnel exit, in many designs, to set the shrink and prevent film relaxing back

## Electrical Wiring

Each heating zone's temperature sensor (typically a thermocouple or RTD) feeds a temperature controller or PLC analog input, closing a control loop against the heating element output — usually via a solid-state relay (SSR) rather than a mechanical contactor, since SSRs handle the frequent on/off cycling of temperature control far better without contact wear. The conveyor speed is set by a VFD, whose speed reference is a direct process parameter, not incidental — dwell time in the tunnel is one of the two main levers (along with temperature) controlling shrink quality.

## Pneumatic Diagram

Most shrink tunnels have minimal pneumatics — the process is thermal and mechanical (conveyor), not pneumatically actuated, aside from possible pneumatic guide rails or product-spacing mechanisms upstream of the tunnel entrance.

## PLC Logic

Temperature control for each zone typically runs as an independent PID loop against its own setpoint, while conveyor speed is set as a separate process parameter tied to the recipe:

\`\`\`
// Zone 1 temperature PID (conceptual)
LD   D200        // D200 = zone 1 actual temperature (scaled from analog input)
PID  D201  D200  D202   // D201 = setpoint, D202 = output to SSR duty cycle

// Conveyor speed from active recipe
MOV  D300        D500    // D500 = VFD speed reference register
\`\`\`

## Sequence of Operation

1. Wrapped product (film or sleeve applied upstream) enters the tunnel on the mesh conveyor
2. Product passes through one or more heated zones, each independently temperature-controlled
3. Heat causes the film to shrink and conform tightly to the product
4. Product exits the tunnel, often into a cooling section to set the shrink
5. Product continues downstream to the next process step

## Common Faults

- Loose or wrinkled film after the tunnel — insufficient heat, dwell time too short (conveyor running too fast), or a cold zone from a failed heating element
- Scorched or distorted film — zone running too hot, or dwell time too long for the film's shrink temperature rating
- Uneven shrink around the product — uneven heat distribution, often from a partially blocked air circulation path or an unevenly loaded product on the conveyor

## Troubleshooting

- If shrink quality is inconsistent product-to-product rather than uniformly poor, check air circulation and mesh belt condition before adjusting temperature setpoints
- If one specific zone consistently reads differently from its setpoint, verify that zone's sensor and SSR independently — a failed SSR can get stuck fully on or fully off, which looks like a temperature control problem but is actually an output device failure
- Confirm actual conveyor speed against the recipe's intended dwell time using a stopwatch check, since VFD parameter drift or a mechanical belt slip can silently change actual dwell time without any fault being flagged

## Maintenance

- Clean mesh belt and air circulation paths regularly — buildup restricts airflow and causes uneven heating long before it causes an outright fault
- Verify zone temperature sensors against a calibrated reference periodically
- Inspect SSRs for signs of degradation (a common industrial maintenance item, since they're a wear component despite having no moving parts)`,
  },
  {
    slug: "conveyor",
    title: "Conveyor System",
    category: "Material Handling",
    summary: "The connective backbone of a line — belt/roller transport, accumulation logic, and jam detection.",
    order: 1,
    tags: ["conveyor", "material handling", "VFD"],
    content: `## Working Principle

A conveyor moves product between machines or process stations, using a continuously driven belt, roller bed, or chain to carry items along a fixed path. Beyond simple transport, most industrial conveyors also handle **accumulation** — allowing product to gently back up and wait (without jamming or crushing) when a downstream station is temporarily busy, then release smoothly once it's ready again.

## Components

- Belt, roller, or chain transport surface, depending on product type and speed requirements
- Drive motor (often VFD-controlled for speed flexibility) with drive pulley/sprocket
- Idler pulleys/sprockets and belt tensioning mechanism
- Photoelectric sensors along the conveyor for product presence, accumulation zones, and jam detection
- Guide rails to keep product aligned, especially on narrower belts

## Electrical Wiring

The drive motor typically runs through a VFD rather than a simple contactor, giving speed control and soft-start/stop capability — an abrupt full-speed start on a loaded conveyor can cause product to tip or shift. Zone sensors for accumulation control are discrete inputs, each tied to logic that starts/stops (or slows) specific conveyor zones independently, which requires the conveyor to be mechanically and electrically segmented into zones rather than driven as one single length.

## Pneumatic Diagram

Most conveyors are electrically driven with no pneumatics in the transport function itself, though pneumatic stop gates, diverters, or pushers are common accessories mounted along a conveyor to control product flow or route it to different lines.

## PLC Logic

Zone-based accumulation logic is the core pattern: each zone checks whether the zone ahead of it is clear before running, which naturally creates a "wave" of stopped product that doesn't crush together:

\`\`\`
LD   X10           // zone 2 downstream-clear sensor
ANI  M20            // M20 = zone 2 fault/jam flag
OUT  Y10            // Y10 = zone 1 drive run permission

// jam detection: product present but not advancing within expected time
LD   X11            // zone sensor: product present
TON  T10   K50       // if present longer than expected transit time...
LD   T10
OUT  M20             // ...flag a jam
\`\`\`

## Sequence of Operation

1. Product enters the conveyor from an upstream process or manual load point
2. Each zone's control logic checks the zone ahead before running, allowing accumulation without collision
3. Product advances zone to zone as downstream space becomes available
4. Jam detection timers flag any zone where product isn't advancing as expected
5. Product exits to the next process station or machine

## Common Faults

- Belt slipping or mistracking — tension too low, or guide/tracking rollers misaligned
- Zone accumulation not releasing — a downstream-clear sensor fault, or logic wired to the wrong zone's sensor
- Frequent jam faults at one specific location — often a mechanical transition point (a gap between conveyor sections, a guide rail pinch point) rather than a control logic issue

## Troubleshooting

- If jams cluster at a specific physical location repeatedly, inspect that location mechanically first — sensors and logic are rarely the actual cause when the fault is so physically consistent
- If a zone won't run at all, verify its sensor logic independently (force the input, check the HMI) before assuming a motor or VFD fault
- Belt mistracking that worsens gradually over weeks, rather than appearing suddenly, points to tension or roller wear rather than a sudden alignment shift

## Maintenance

- Check and adjust belt tension on a scheduled interval — both too loose and too tight cause premature wear, just via different failure modes
- Keep all conveyor sensors clean and properly aimed; dust and product residue accumulation is one of the most common sources of "random" intermittent faults on any conveyor
- Lubricate chain-driven sections per the manufacturer's schedule; belt sections generally need less lubrication maintenance but more tracking/tension attention`,
  },
];
