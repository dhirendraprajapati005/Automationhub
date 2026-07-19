export const pneumaticsLessons = [
  {
    track: "pneumatics",
    slug: "cylinders-single-vs-double-acting",
    title: "Pneumatic cylinders: single-acting vs double-acting",
    summary: "Which direction air pushes, and why double-acting cylinders dominate industrial automation.",
    difficulty: "beginner",
    estimatedMinutes: 8,
    order: 1,
    tags: ["cylinders", "fundamentals"],
    content: `A pneumatic cylinder converts compressed air pressure into linear mechanical motion. How it retracts is the key design distinction between the two main types.

## Single-acting cylinders

Air pressure extends the piston in one direction only; a built-in spring returns it once air pressure is released. Only one air port and one control valve output are needed.

- Simpler, cheaper, uses less air (only the extend stroke consumes compressed air)
- Return force depends on the spring, which is generally weaker and less consistent than an air-powered return, and the spring adds mechanical wear over the cylinder's life
- Common in simple applications like clamps or small ejector pins where the return stroke doesn't need to do meaningful work

## Double-acting cylinders

Air pressure actively drives motion in **both** directions — extend and retract each have their own port, and a control valve alternates which port is pressurized.

- Full, consistent force available in both directions, since both strokes are actively air-powered rather than relying on a spring
- Requires two air lines and typically a 5/2 or 5/3 way valve rather than a simpler 3/2
- Standard choice for most industrial automation — most cylinders you'll encounter on a real production line are double-acting

## Why double-acting is the default choice

Beyond just needing force in both directions, double-acting cylinders give you independent control over extend and retract speed (via separate flow control valves on each port) and don't have a spring wearing out over the machine's service life — reliability considerations that matter for equipment expected to run continuously in production.`,
  },
  {
    track: "pneumatics",
    slug: "solenoid-valves-3-2-5-2-5-3",
    title: "Solenoid valves: 3/2 vs 5/2 vs 5/3",
    summary: "Reading valve nomenclature — what the numbers mean and which valve fits which cylinder.",
    difficulty: "beginner",
    estimatedMinutes: 9,
    order: 2,
    tags: ["valves"],
    content: `Solenoid valve nomenclature looks cryptic at first — "5/2 way valve" — but it's actually a compact description of exactly how the valve behaves, once you know how to read it.

## Reading the numbers

The format is **ports/positions**:
- First number = total number of ports (connections) on the valve
- Second number = number of distinct switching positions the valve can be in

## 3/2 way valve

3 ports, 2 positions. Used to control single-acting cylinders: one port to the air supply, one port to the cylinder, one port to exhaust. In one position, supply connects to the cylinder; in the other, the cylinder connects to exhaust instead (letting the spring return it).

## 5/2 way valve

5 ports, 2 positions. The standard choice for double-acting cylinders: supply, two cylinder ports (one per side of the piston), and two separate exhaust ports. Each of the two positions connects supply to one cylinder port while exhausting the other — reversing which side of the piston is pressurized reverses the cylinder's direction.

## 5/3 way valve

5 ports, 3 positions — adds a **center position** to the 5/2 layout, which is where the real value comes in. Common center configurations:
- **Closed center** — both cylinder ports blocked, holding the cylinder locked in place at whatever position it was in
- **Open (exhaust) center** — both cylinder ports vented, letting the cylinder float freely under external force

A 5/3 valve is the right choice whenever a cylinder needs to be able to stop and hold mid-stroke, not just at its two end positions — a 5/2 valve has no "stop here" state, only fully extended or fully retracted.

## Practical takeaway

If you only ever need full-extend or full-retract, a 5/2 is simpler and cheaper. The moment a design calls for holding position mid-travel, that's the signal to move to a 5/3.`,
  },
  {
    track: "pneumatics",
    slug: "basic-pneumatic-circuit-diagram",
    title: "Building a basic pneumatic circuit diagram",
    summary: "Reading a circuit diagram top to bottom: supply, conditioning, valve, actuator.",
    difficulty: "intermediate",
    estimatedMinutes: 10,
    order: 3,
    tags: ["circuit diagrams"],
    content: `A pneumatic circuit diagram is drawn in a standard, predictable order that mirrors how air actually flows through the system, which makes it far easier to read once you know the pattern.

## The standard flow, bottom to top

Most pneumatic diagrams are drawn with the air supply at the bottom and the actuator at the top, following the actual direction air travels:

1. **Compressed air supply** — the source, typically drawn as a triangle symbol at the bottom
2. **FRL unit (Filter-Regulator-Lubricator)** — conditions the raw supply air: filters out particulates and moisture, regulates it down to a consistent working pressure, and on older pneumatic systems adds a fine mist of oil for valve/cylinder lubrication (many modern components are designed to run oil-free, so this stage is increasingly optional)
3. **Directional control valve** — the 3/2, 5/2, or 5/3 valve that determines which direction air flows to the actuator, drawn as a box with the port connections and switching positions shown
4. **Flow control valves** — often placed directly at the cylinder ports to independently regulate extend and retract speed by restricting exhaust flow
5. **The actuator itself** — the cylinder, drawn as a rectangle with the piston and rod

## Why regulation matters even with a "good enough" supply pressure

Running components directly off unregulated supply pressure — which can fluctuate as other equipment on the same compressed air line draws air — causes inconsistent cylinder speed and force. A regulator gives each circuit its own stable, deliberately chosen working pressure independent of what else is happening elsewhere on the compressed air network.

## A troubleshooting habit this builds

Once you can read a diagram fluently, troubleshooting a slow or weak cylinder becomes a process of elimination following the diagram's flow: check supply pressure first, then the FRL for a clogged filter or misadjusted regulator, then the valve for proper shifting, then the flow controls for an overly restricted setting — working through the diagram in the same order the air actually travels.`,
  },
];

export const roboticsLessons = [
  {
    track: "robotics",
    slug: "industrial-robot-types",
    title: "Industrial robot types: SCARA, articulated, delta, cartesian",
    summary: "Four common robot architectures and the task each one is actually built for.",
    difficulty: "beginner",
    estimatedMinutes: 9,
    order: 1,
    tags: ["robot types", "fundamentals"],
    content: `Industrial robots aren't one-size-fits-all — different mechanical architectures excel at genuinely different tasks, and picking the wrong type for an application means fighting the robot's natural strengths instead of using them.

## Articulated robots

The most familiar type — a series of rotary joints (typically 6), similar in concept to a human arm. Highly flexible, can reach almost any orientation within its work envelope, making it the default choice for complex tasks like welding, painting, and general material handling where the end tool needs to approach from many angles.

## SCARA robots

Selective Compliance Assembly Robot Arm — moves fast in the horizontal plane with two parallel rotary joints, but has limited vertical travel and is rigid vertically, compliant horizontally (hence the name). This makes it excellent for fast, precise pick-and-place and assembly tasks moving parts around on a flat plane, but a poor fit for tasks needing complex 3D orientation.

## Delta robots

Instantly recognizable by their spider-like arrangement of three arms suspended from a fixed overhead frame, converging on a single moving platform below. Extremely fast for light payloads over a small work area — the classic application is high-speed pick-and-place on a food packaging or electronics line, sorting items off a moving conveyor at very high cycle rates.

## Cartesian (gantry) robots

Move along straight, linear axes (X, Y, Z) rather than rotating joints — essentially a 3D printer's motion system scaled up to industrial size and payload. Simple to program and highly rigid, well suited to large work envelopes like palletizing or CNC-style material handling where straight-line motion is all that's needed.

## Matching robot type to task

The underlying question is always: what shape is the actual work envelope, and does the task need complex orientation or just fast, repetitive positional motion? A SCARA forced into a task needing full 3D orientation control will underperform an articulated robot badly, and an articulated robot used for simple flat pick-and-place is usually needlessly slow and expensive compared to a SCARA or delta doing the same job.`,
  },
  {
    track: "robotics",
    slug: "robot-axes-degrees-of-freedom",
    title: "Understanding robot axes and degrees of freedom",
    summary: "What '6-axis' actually means, and why some tasks need all six while others need far fewer.",
    difficulty: "beginner",
    estimatedMinutes: 8,
    order: 2,
    tags: ["axes", "fundamentals"],
    content: `A robot's "degrees of freedom" (DOF) describes the number of independent ways it can move — and it's the single most important spec for understanding what a given robot can and can't do, more useful upfront than brand or payload rating alone.

## Position vs orientation

Fully describing where something is in 3D space and how it's oriented takes **6 degrees of freedom**:
- 3 for position — X, Y, Z coordinates
- 3 for orientation — commonly described as roll, pitch, and yaw (rotation around each of three axes)

This is exactly why the common "6-axis articulated robot" is such a standard configuration — six independently controlled joints give exactly enough freedom to place a tool at any position, in any orientation, within its reach.

## Why fewer axes is often the smarter choice, not a limitation

A 4-axis SCARA robot deliberately gives up some of that orientation freedom (it typically can't tilt its end effector, only rotate it around a vertical axis) in exchange for speed and mechanical simplicity. For a task like placing a flat component onto a flat surface, full 6-DOF orientation control is unnecessary complexity — the SCARA's 4 axes do the actual job just as well, faster, and cheaper.

## Redundant axes

Some applications add a 7th axis — often a linear track the entire robot base rides along — which isn't needed to reach any single point, but extends the robot's total working range across a wider area, or lets it avoid an obstacle by taking a different path to the same final position.

## The practical takeaway

Before specifying a robot for a project, describe the actual task in terms of what orientation control it genuinely needs, not just its physical reach. Many real assembly and packaging tasks need far less than full 6-DOF freedom, and matching the robot's axis count to the real requirement — rather than defaulting to "get the most flexible one" — is usually the more cost-effective engineering decision.`,
  },
  {
    track: "robotics",
    slug: "robot-plc-integration",
    title: "Robot-PLC integration: I/O vs fieldbus communication",
    summary: "Two ways a robot controller talks to the line's PLC, and when each makes sense.",
    difficulty: "intermediate",
    estimatedMinutes: 10,
    order: 3,
    tags: ["integration", "PLC"],
    content: `A robot rarely operates in isolation — it needs to coordinate with the surrounding line's PLC: knowing when a part has arrived, signaling when it's finished, and often receiving which of several programs to run next. There are two common ways to build that connection.

## Discrete I/O handshaking

The simplest method — a set of dedicated digital signals wired directly between the robot controller and the PLC:
- PLC → Robot: "Part present," "Start cycle," "Program select bits"
- Robot → PLC: "Cycle complete," "Robot fault," "Robot in home position"

This is simple to wire, easy to troubleshoot with a multimeter, and doesn't depend on a network being healthy — but it's limited to simple boolean handshakes and doesn't scale well if the amount of information that needs to pass between robot and PLC grows.

## Fieldbus communication

The robot controller and PLC communicate over a shared industrial network (Profinet, EtherNet/IP, or similar), exchanging structured data — not just individual bits but whole blocks of information: exact part coordinates, quality data, detailed status words, recipe parameters — all over the same physical cable.

- Scales far better as integration complexity grows, and reduces the amount of physical wiring between panels
- Requires the network itself to be configured correctly and adds a layer of complexity (network troubleshooting skills, not just multimeter continuity checks) if something goes wrong

## A pattern used in practice

Many real integrations use both together deliberately: fieldbus for the bulk of structured data exchange, plus a small number of hardwired discrete I/O points reserved specifically for safety-related signals like an e-stop chain — because a hardwired safety circuit doesn't depend on network communication staying healthy to remain functional, which matters when the failure mode being protected against is exactly a communication or software fault.

## Choosing for a given project

For a single robot with simple start/stop coordination, discrete I/O alone is often genuinely sufficient and simpler to maintain. For a cell with multiple robots exchanging detailed part and quality data with a line controller, fieldbus becomes close to essential — the amount of information needed would require an impractical number of discrete wires otherwise.`,
  },
];

export const networkingLessons = [
  {
    track: "networking",
    slug: "modbus-rtu-vs-modbus-tcp",
    title: "Modbus RTU vs Modbus TCP: what's the difference",
    summary: "Same data model, two very different physical layers — serial vs Ethernet.",
    difficulty: "beginner",
    estimatedMinutes: 9,
    order: 1,
    tags: ["Modbus", "fundamentals"],
    content: `Modbus is one of the oldest and most widely supported industrial communication protocols, and it exists in two common forms that share the same underlying data model but run over completely different physical media.

## Modbus RTU: serial

Runs over RS-485 (most commonly) as a serial protocol. A single master polls multiple slave devices, each identified by a unique address (1–247), over a shared two-wire cable in a multi-drop bus topology.

- Simple, cheap wiring — just a twisted pair, no networking hardware required beyond basic RS-485 transceivers
- Relatively slow by modern standards, and strictly single-master — only one device on the bus can initiate a request at a time
- Still extremely common for connecting simple field devices — VFDs, meters, sensors — to a PLC over reasonably short distances

## Modbus TCP: Ethernet

The same Modbus data model (function codes, register addressing) wrapped in a TCP/IP packet and sent over standard Ethernet. Devices are addressed by IP address instead of a serial address number.

- Much faster, and Ethernet infrastructure (switches, cabling) is standard, well-understood, and widely available
- Not limited to a single master the way RTU is — multiple clients can query the same device, subject to the device's own connection limits
- Easier to integrate with SCADA, IT infrastructure, and remote access than a dedicated serial bus

## Why RTU hasn't disappeared

Despite TCP's advantages, RTU remains common because enormous numbers of existing field devices — especially older VFDs, energy meters, and simple sensors — were built with only a serial Modbus interface, and replacing functioning hardware just to gain Ethernet connectivity is rarely worth the cost. **Modbus RTU-to-TCP gateways** are a common practical solution: they let legacy serial devices join a modern Ethernet-based SCADA system without replacing the field device itself.

## The practical takeaway

Same data model, different transport. If you understand Modbus register addressing and function codes on one, you already understand the other — the difference that matters day-to-day is purely how you physically wire and address the devices.`,
  },
  {
    track: "networking",
    slug: "ethernet-ip-and-profinet",
    title: "EtherNet/IP and Profinet: the two dominant industrial Ethernet protocols",
    summary: "Different vendor ecosystems, similar goals — real-time deterministic communication over standard Ethernet.",
    difficulty: "intermediate",
    estimatedMinutes: 11,
    order: 2,
    tags: ["EtherNet/IP", "Profinet"],
    content: `Standard office Ethernet (TCP/IP) wasn't originally designed for the tight, predictable timing that motion control and safety systems need. EtherNet/IP and Profinet are the two most common industrial answers to that problem, each built around a different vendor ecosystem.

## EtherNet/IP

Developed around the **CIP (Common Industrial Protocol)** and strongly associated with the Rockwell Automation / Allen-Bradley ecosystem, though it's an open standard used well beyond just Rockwell products. Runs standard Ethernet hardware, using CIP to layer real-time, deterministic communication (for things like drive control) on top of it, alongside standard messaging for less time-critical data.

- Widely used in North America, especially anywhere Allen-Bradley PLCs (ControlLogix, CompactLogix) are the platform
- Uses standard, unmodified Ethernet switches and infrastructure — no special hardware required at the network layer

## Profinet

Developed by **PROFIBUS & PROFINET International**, strongly associated with the Siemens ecosystem, and dominant in Europe and in many global operations using Siemens PLC platforms (S7 series).

- Offers different performance classes, including a version (IRT — Isochronous Real-Time) that achieves very tight timing precision suitable for demanding motion control applications, going beyond what standard Ethernet switching alone can guarantee
- Typically requires Profinet-aware switches for its higher-performance real-time classes, rather than working over completely generic Ethernet hardware

## Why the choice usually isn't really a choice

In practice, engineers rarely pick a protocol from scratch — the decision is almost always determined by which PLC platform a plant has already standardized on. A Siemens-based plant uses Profinet because that's what the S7 platform speaks natively; a Rockwell-based plant uses EtherNet/IP for the same reason. Mixing platforms deliberately, without a clear reason, usually just adds integration complexity most projects don't need.

## What they have in common

Both exist to solve the same fundamental problem: giving real-time, deterministic industrial communication a path to run over modern, cost-effective standard Ethernet infrastructure instead of older proprietary fieldbus wiring — the specific implementation differs, but the goal and the general approach are the same.`,
  },
  {
    track: "networking",
    slug: "industrial-network-topology-basics",
    title: "Building a simple industrial network topology",
    summary: "Star, ring, and line topologies — and why redundancy matters more on the plant floor than in an office.",
    difficulty: "intermediate",
    estimatedMinutes: 9,
    order: 3,
    tags: ["topology", "network design"],
    content: `How devices are physically connected on an industrial network — the topology — directly affects both performance and resilience, and the right choice depends heavily on how critical continuous uptime is for the equipment involved.

## Star topology

Every device connects individually to a central switch, the same pattern most office networks use.

- Simple to troubleshoot — a single cable fault only takes down the one device connected to it, not the whole network
- Creates a single point of failure at the central switch itself, and requires more total cable length than some alternatives for spread-out equipment

## Line (daisy-chain) topology

Devices connect in a sequential chain, each one passing traffic through to the next.

- Efficient cabling for equipment spread out along a physical line, like a series of machines down a conveyor
- A single cable break or device failure anywhere in the chain can disconnect every device downstream of that point — a real vulnerability for continuous production

## Ring topology

Similar to a line, but the last device connects back to the first, closing the loop, and using switches with ring-aware protocols (like Media Redundancy Protocol) that detect a break and automatically reroute traffic the other way around the ring.

- Provides genuine redundancy — a single cable break doesn't take any device offline, since traffic simply reroutes around the ring in the other direction
- More complex to configure correctly than a simple star or line, and requires ring-capable switches rather than generic ones

## Why plant floor networks lean toward ring topology more than office networks do

An office network losing connectivity for a few minutes during a cable fault is an inconvenience. A production line losing its PLC-to-SCADA or robot-to-PLC communication mid-cycle can mean a safety event, scrapped product, or a costly unplanned stop. That difference in consequence is exactly why ring topologies with automatic failover, while more complex and expensive to configure than a simple star, are common in industrial settings for the equipment connections that genuinely can't tolerate any communication gap.

## A practical starting point

Not every device needs ring-level redundancy — a star topology feeding non-critical monitoring devices is often perfectly adequate. Reserve the added cost and complexity of a redundant ring for the network segments actually carrying safety or real-time control traffic where a gap has real consequences.`,
  },
];
