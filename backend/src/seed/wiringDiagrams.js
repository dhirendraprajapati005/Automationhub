export const wiringDiagrams = [
  {
    slug: "npn-proximity-sensor-to-plc-input",
    title: "NPN Proximity Sensor to PLC Input",
    category: "Sensors",
    description: "3-wire NPN (sinking) inductive proximity sensor wired to a sinking-configured PLC input card.",
    deviceLabel: "NPN Proximity Sensor",
    deviceTerminals: [
      { id: "d1", label: "Brown (+V)" },
      { id: "d2", label: "Blue (0V)" },
      { id: "d3", label: "Black (Signal)" },
    ],
    controllerLabel: "PLC Input Card (Sinking)",
    controllerTerminals: [
      { id: "c1", label: "24V DC" },
      { id: "c2", label: "COM / S/S" },
      { id: "c3", label: "X0 (Input)" },
    ],
    connections: [
      { deviceTerminalId: "d1", controllerTerminalId: "c1", note: "Sensor power" },
      { deviceTerminalId: "d2", controllerTerminalId: "c2", note: "Sensor 0V ties to PLC common" },
      { deviceTerminalId: "d3", controllerTerminalId: "c3", note: "Signal switches to 0V when active" },
    ],
    notes: `An NPN sensor's black signal wire switches to 0V (sinks current) when the sensor detects a target. For this to register correctly, the PLC's input common (S/S terminal on Delta DVP-series PLCs) must be wired to 24V — this is what's meant by a "sinking" input configuration.

Confirm which configuration your input card supports before wiring — some PLC input cards are fixed sinking or sourcing, others are switchable via the S/S terminal connection.`,
    commonMistakes: [
      "Wiring S/S to 0V instead of 24V — the input never reads correctly because the current path never closes",
      "Assuming brown/blue color coding is universal — always confirm against the sensor's own datasheet, not just this general convention",
      "Mixing an NPN sensor into a card that's fixed sourcing-only, with no S/S option — the sensor simply won't work regardless of wiring",
    ],
    tags: ["NPN", "proximity sensor", "sinking"],
    order: 1,
  },
  {
    slug: "pnp-proximity-sensor-to-plc-input",
    title: "PNP Proximity Sensor to PLC Input",
    category: "Sensors",
    description: "3-wire PNP (sourcing) inductive proximity sensor wired to a sourcing-configured PLC input card.",
    deviceLabel: "PNP Proximity Sensor",
    deviceTerminals: [
      { id: "d1", label: "Brown (+V)" },
      { id: "d2", label: "Blue (0V)" },
      { id: "d3", label: "Black (Signal)" },
    ],
    controllerLabel: "PLC Input Card (Sourcing)",
    controllerTerminals: [
      { id: "c1", label: "24V DC" },
      { id: "c2", label: "COM / S/S" },
      { id: "c3", label: "X0 (Input)" },
    ],
    connections: [
      { deviceTerminalId: "d1", controllerTerminalId: "c1", note: "Sensor power" },
      { deviceTerminalId: "d2", controllerTerminalId: "c2", note: "Sensor 0V ties to PLC common" },
      { deviceTerminalId: "d3", controllerTerminalId: "c3", note: "Signal switches to +24V when active" },
    ],
    notes: `A PNP sensor's black signal wire switches to +24V (sources current) when the sensor detects a target — the opposite behavior from an NPN sensor. For this to register correctly, the PLC's input common (S/S terminal) must be wired to 0V, the "sourcing" input configuration.

PNP is the more common convention in parts of Europe and increasingly in newer installations generally, while NPN remains common in older installations and some regions — check what the rest of the panel already uses before mixing types unnecessarily.`,
    commonMistakes: [
      "Wiring S/S to 24V (the NPN configuration) with a PNP sensor — the input never registers because the sourced signal has nowhere to sink to",
      "Mixing NPN and PNP sensors on the same input card without checking whether the card even supports both — many do via the shared S/S terminal, but not all",
    ],
    tags: ["PNP", "proximity sensor", "sourcing"],
    order: 2,
  },
  {
    slug: "photoelectric-sensor-to-plc-input",
    title: "Photoelectric Sensor to PLC Input",
    category: "Sensors",
    description: "4-wire diffuse photoelectric sensor with a separate light/dark-on select wire.",
    deviceLabel: "Diffuse Photoelectric Sensor",
    deviceTerminals: [
      { id: "d1", label: "Brown (+V)" },
      { id: "d2", label: "Blue (0V)" },
      { id: "d3", label: "Black (Signal)" },
      { id: "d4", label: "White (Light/Dark select)" },
    ],
    controllerLabel: "PLC Input Card",
    controllerTerminals: [
      { id: "c1", label: "24V DC" },
      { id: "c2", label: "COM / S/S" },
      { id: "c3", label: "X1 (Input)" },
    ],
    connections: [
      { deviceTerminalId: "d1", controllerTerminalId: "c1", note: "Sensor power" },
      { deviceTerminalId: "d2", controllerTerminalId: "c2", note: "Sensor 0V ties to PLC common" },
      { deviceTerminalId: "d3", controllerTerminalId: "c3", note: "Output signal" },
    ],
    notes: `The white select wire (terminal d4) isn't wired to the PLC at all — it's tied to +V or 0V at the sensor itself (or left in its default state) to choose whether the output activates when the beam is broken ("dark-on") or when the beam is received ("light-on"). Check the sensor's datasheet for its specific wiring for each mode; this varies by manufacturer.

Getting light-on/dark-on backwards is a very common source of "the sensor works, but the logic seems inverted" confusion — the wiring can be correct while the mode selection is simply set to the opposite of what the application needs.`,
    commonMistakes: [
      "Leaving the light/dark select wire floating unintentionally, which can leave the sensor in an unpredictable default mode on some models",
      "Assuming inverted behavior means a wiring fault, when it's actually just the light/dark mode set opposite to what's needed",
    ],
    tags: ["photoelectric sensor", "diffuse", "light-dark"],
    order: 3,
  },
  {
    slug: "4-20ma-transmitter-to-analog-input",
    title: "4-20mA Transmitter to Analog Input Module",
    category: "Analog & Instrumentation",
    description: "2-wire loop-powered 4-20mA pressure/level transmitter wired to a PLC analog input card.",
    deviceLabel: "2-Wire 4-20mA Transmitter",
    deviceTerminals: [
      { id: "d1", label: "Loop (+)" },
      { id: "d2", label: "Loop (−)" },
    ],
    controllerLabel: "Analog Input Module (e.g. DVP-04AD-S2)",
    controllerTerminals: [
      { id: "c1", label: "24V DC" },
      { id: "c2", label: "AI+ (Current Input +)" },
      { id: "c3", label: "AI− / COM" },
    ],
    connections: [
      { deviceTerminalId: "d1", controllerTerminalId: "c1", note: "Loop power sourced from 24V supply" },
      { deviceTerminalId: "d2", controllerTerminalId: "c2", note: "Loop current flows through the analog input" },
      { deviceTerminalId: "d2", controllerTerminalId: "c3", note: "Return path to complete the loop" },
    ],
    notes: `A 2-wire loop-powered transmitter uses the same two wires to receive power and carry the 4-20mA signal — the loop current itself IS the measurement, not a separate voltage signal. The analog input module must be configured (via its own DIP switches or software parameters) to accept current input rather than voltage input; wiring alone doesn't set this.

Use shielded, twisted-pair cable for the loop run, and ground the shield at one end only (typically at the PLC panel end) to avoid ground loops introducing noise into the reading.`,
    commonMistakes: [
      "Leaving the analog input module set to voltage mode while wiring a current-output transmitter — the module physically accepts the wiring but the reading is meaningless",
      "Grounding the cable shield at both ends, creating a ground loop that shows up as unstable, noisy readings",
      "Running the signal cable in the same conduit as motor or VFD power cables, inducing electrical noise onto the low-level signal",
    ],
    tags: ["4-20mA", "analog input", "transmitter", "current loop"],
    order: 1,
  },
  {
    slug: "vfd-control-terminal-wiring",
    title: "VFD Control Terminal Wiring (Run/Stop + Speed Reference)",
    category: "Drives & Motors",
    description: "Basic external terminal control wiring for a VFD: run command from a PLC output, speed reference from an analog output.",
    deviceLabel: "PLC Output Card + Analog Output",
    deviceTerminals: [
      { id: "d1", label: "Y0 (Run command)" },
      { id: "d2", label: "COM (Output common)" },
      { id: "d3", label: "AO+ (Speed reference)" },
      { id: "d4", label: "AO− / COM" },
    ],
    controllerLabel: "VFD Control Terminals",
    controllerTerminals: [
      { id: "c1", label: "FWD (Forward run)" },
      { id: "c2", label: "COM (Control common)" },
      { id: "c3", label: "AI1 (Analog speed input)" },
      { id: "c4", label: "AGND (Analog ground)" },
    ],
    connections: [
      { deviceTerminalId: "d1", controllerTerminalId: "c1", note: "Closing this contact commands the drive to run forward" },
      { deviceTerminalId: "d2", controllerTerminalId: "c2", note: "Shared control common" },
      { deviceTerminalId: "d3", controllerTerminalId: "c3", note: "0-10V or 4-20mA speed reference, per drive parameter setting" },
      { deviceTerminalId: "d4", controllerTerminalId: "c4", note: "Analog signal return, kept separate from digital COM where possible" },
    ],
    notes: `This wiring alone does nothing until the VFD's own parameters are set to accept commands from external terminals rather than its keypad — this is the single most common reason a correctly wired VFD "does nothing" on first power-up (see the VFD parameter sheet lesson under Learn → VFD & Drives).

Keep the analog speed reference wiring physically separated from power/motor cables and digital I/O wiring where practical, and use shielded cable for the analog run — VFD output cables in particular are a significant noise source that can corrupt an unshielded analog reference signal.`,
    commonMistakes: [
      "Wiring terminals correctly but leaving the VFD's control source parameter set to keypad — the drive ignores the terminals entirely",
      "Running the analog speed reference cable in the same conduit as the motor power cable, causing speed instability from induced noise",
      "Assuming AI1 is always 0-10V — many drives default differently or need a parameter/DIP switch set for voltage vs current input, similar to a PLC analog input module",
    ],
    tags: ["VFD", "drive", "run command", "speed reference"],
    order: 1,
  },
  {
    slug: "rotary-encoder-to-delta-hsc-input",
    title: "Rotary Encoder to Delta PLC HSC Input",
    category: "Motion & Feedback",
    description: "Quadrature incremental encoder (NPN output) wired to a Delta DVP-series high-speed counter input.",
    deviceLabel: "Incremental Rotary Encoder (NPN)",
    deviceTerminals: [
      { id: "d1", label: "Brown (+V)" },
      { id: "d2", label: "Blue (0V)" },
      { id: "d3", label: "Black (A phase)" },
      { id: "d4", label: "White (B phase)" },
    ],
    controllerLabel: "Delta DVP-14SS2 HSC Input",
    controllerTerminals: [
      { id: "c1", label: "24V DC" },
      { id: "c2", label: "S/S (set to 24V for NPN)" },
      { id: "c3", label: "X0 (A phase / pulse)" },
      { id: "c4", label: "X1 (B phase / direction)" },
    ],
    connections: [
      { deviceTerminalId: "d1", controllerTerminalId: "c1", note: "Encoder power" },
      { deviceTerminalId: "d2", controllerTerminalId: "c2", note: "S/S must be 24V for an NPN encoder, matching the sinking convention" },
      { deviceTerminalId: "d3", controllerTerminalId: "c3", note: "A-phase pulse train" },
      { deviceTerminalId: "d4", controllerTerminalId: "c4", note: "B-phase, used for direction/quadrature counting" },
    ],
    notes: `This follows the same NPN sinking convention as a standard proximity sensor — S/S must be wired to 24V. The A and B phases together let the HSC counter track both count and direction in quadrature mode (configured in the PLC's HSC parameters, not just by wiring).

Both channels must land on HSC-capable inputs, not arbitrary standard inputs — check the PLC's datasheet for which physical input terminals support high-speed counting, since this varies by model.`,
    commonMistakes: [
      "Wiring only the A-phase and skipping B-phase, which loses direction sensing — the counter will still count pulses but can't distinguish forward from reverse rotation",
      "Landing A/B phases on standard (non-HSC) inputs, where the normal scan cycle is too slow to reliably catch encoder pulse frequency",
      "The classic S/S wiring mistake carried over from sensor wiring — 0V instead of 24V for an NPN encoder",
    ],
    tags: ["encoder", "HSC", "Delta PLC", "quadrature"],
    order: 1,
  },
  {
    slug: "solenoid-valve-to-plc-output",
    title: "Solenoid Valve to PLC Output (via Relay)",
    category: "Actuators",
    description: "24V DC solenoid valve driven through an interposing relay rather than directly from the PLC output.",
    deviceLabel: "24V DC Solenoid Valve",
    deviceTerminals: [
      { id: "d1", label: "Coil +" },
      { id: "d2", label: "Coil −" },
    ],
    controllerLabel: "PLC Output → Interposing Relay",
    controllerTerminals: [
      { id: "c1", label: "Y0 (PLC output)" },
      { id: "c2", label: "COM (Output common)" },
      { id: "c3", label: "Relay contact → 24V+" },
      { id: "c4", label: "Relay contact → Valve" },
    ],
    connections: [
      { deviceTerminalId: "d1", controllerTerminalId: "c3", note: "Relay contact switches 24V to the valve coil" },
      { deviceTerminalId: "d2", controllerTerminalId: "c4", note: "Valve coil return" },
    ],
    notes: `The PLC output (Y0/COM) drives the interposing relay's coil, not the solenoid valve directly — the relay's contacts then switch the higher-current valve coil circuit. This protects the PLC's output from the solenoid's inrush current and from inductive kickback when the coil de-energizes.

Always fit a flyback diode (for DC coils) or an RC snubber (for AC coils) across the solenoid coil itself, in addition to any protection built into the relay — this suppresses the voltage spike generated when the coil's magnetic field collapses, protecting both the relay contacts and nearby electronics from that transient.`,
    commonMistakes: [
      "Driving the solenoid directly from a PLC transistor output without a relay — works initially but shortens the output's life from repeated inductive switching, and can damage it outright on a larger coil",
      "Omitting the flyback diode/snubber, leading to premature relay contact wear or electrical noise affecting nearby sensitive circuits",
      "Undersizing the relay's contact rating for the solenoid's actual inrush current, not just its steady-state holding current",
    ],
    tags: ["solenoid valve", "relay", "output protection"],
    order: 1,
  },
  {
    slug: "estop-safety-circuit-wiring",
    title: "E-Stop / Safety Circuit Wiring",
    category: "Safety",
    description: "Basic dual-channel emergency stop circuit through a safety relay, not wired directly into PLC logic.",
    deviceLabel: "E-Stop Pushbutton (Dual NC Contacts)",
    deviceTerminals: [
      { id: "d1", label: "Channel 1 (NC)" },
      { id: "d2", label: "Channel 2 (NC)" },
    ],
    controllerLabel: "Safety Relay Module",
    controllerTerminals: [
      { id: "c1", label: "S11/S12 (Channel 1 input)" },
      { id: "c2", label: "S21/S22 (Channel 2 input)" },
      { id: "c3", label: "13/14 (Safety output to contactors)" },
    ],
    connections: [
      { deviceTerminalId: "d1", controllerTerminalId: "c1", note: "First independent contact channel" },
      { deviceTerminalId: "d2", controllerTerminalId: "c2", note: "Second independent contact channel, wired separately from channel 1" },
    ],
    notes: `A safety-rated e-stop circuit runs through a dedicated safety relay module — never through standard PLC I/O as the sole means of stopping the machine. The safety relay's own certified logic (not ladder logic) monitors both channels for consistency and drives the final safety output (typically feeding motor contactor coils directly), so a single wiring fault or PLC program bug can't defeat the stop function.

The PLC can still read the e-stop's status as a normal input for display/diagnostic purposes (e.g. showing "E-Stop Active" on the HMI), but that's informational only — it must never be the mechanism that actually removes power from hazardous motion.`,
    commonMistakes: [
      "Wiring the e-stop only into a standard PLC input and stopping motion purely through ladder logic — a program fault, a scan cycle stall, or an output stuck-on failure can leave the machine running with no independent safety layer",
      "Using only a single-channel e-stop contact where the application's risk assessment calls for dual-channel monitoring",
      "Bypassing or jumpering a safety relay's channels during commissioning and forgetting to remove the bypass before production use",
    ],
    tags: ["e-stop", "safety relay", "dual channel"],
    order: 1,
  },
];
