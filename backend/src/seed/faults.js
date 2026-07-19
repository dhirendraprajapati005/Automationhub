export const faults = [
  {
    slug: "vfd-trips-overcurrent-acceleration",
    symptom: "VFD trips on overcurrent during acceleration",
    category: "VFD & Drives",
    description: "The drive faults with an overcurrent (OC) code shortly after a run command, usually while ramping up to speed.",
    order: 1,
    tags: ["VFD", "overcurrent", "acceleration"],
    causes: [
      {
        cause: "Acceleration time set too short for the load's inertia",
        likelihood: "most likely",
        checkSteps: [
          "Check the drive's acceleration time parameter against the connected load — a heavy conveyor or large fan needs a longer ramp than the drive's default",
          "Temporarily lengthen the acceleration time significantly and retest; if the trip stops, the ramp time was the cause",
        ],
        fix: "Increase the acceleration time parameter to a value the load can actually follow without excessive current draw, then fine-tune down if cycle time matters.",
      },
      {
        cause: "Mechanically jammed or overloaded load",
        likelihood: "possible",
        checkSteps: [
          "With power isolated, try rotating the motor shaft or driven load by hand to feel for binding",
          "Check for a mechanical obstruction, seized bearing, or overloaded conveyor that could explain excess starting torque demand",
        ],
        fix: "Clear the mechanical obstruction or address the bearing/mechanical fault before re-running the drive.",
      },
      {
        cause: "Motor parameters in the drive don't match the actual motor",
        likelihood: "less common",
        checkSteps: [
          "Compare the drive's motor rated current/voltage/frequency parameters against the actual motor's nameplate",
          "Check if the motor was recently swapped without updating drive parameters",
        ],
        fix: "Re-enter the correct motor nameplate parameters into the drive, or run the drive's auto-tune function if it has one.",
      },
    ],
  },
  {
    slug: "motor-wont-start",
    symptom: "Motor won't start / no rotation",
    category: "VFD & Drives",
    description: "A run command is given (from a start button, PLC, or VFD) but the motor doesn't turn at all.",
    order: 2,
    tags: ["motor", "no start", "contactor"],
    causes: [
      {
        cause: "Motor overload/thermal protection is tripped",
        likelihood: "most likely",
        checkSteps: [
          "Check the overload relay or motor protection device for a tripped indicator",
          "Check for a recent overcurrent event in the drive or motor starter's fault history",
        ],
        fix: "Investigate why the overload tripped (see the overcurrent entry above) before simply resetting it — resetting without understanding the cause just delays the same trip.",
      },
      {
        cause: "Control circuit not actually calling for a run (interlock or permissive not satisfied)",
        likelihood: "most likely",
        checkSteps: [
          "Trace the control circuit — is an e-stop pressed, a door interlock open, or a permissive condition (like a safety guard) not satisfied?",
          "On a PLC-controlled starter, check the actual output bit status on the HMI or programming software, not just the physical button",
        ],
        fix: "Satisfy the missing interlock/permissive condition; if the logic itself has an error, correct the ladder logic.",
      },
      {
        cause: "Loss of one or more supply phases",
        likelihood: "possible",
        checkSteps: [
          "With appropriate lockout/tagout and qualified personnel, check incoming line voltage on all three phases at the starter or drive input",
          "Check upstream fuses and circuit breakers for one blown fuse specifically (a classic single-phase symptom)",
        ],
        fix: "Restore the missing phase — replace a blown fuse or correct the upstream supply fault, don't just reset and retry.",
      },
    ],
  },
  {
    slug: "proximity-sensor-not-detecting",
    symptom: "Proximity sensor not detecting target",
    category: "Sensors",
    description: "A proximity sensor doesn't switch its output even when a target is clearly present within range.",
    order: 1,
    tags: ["proximity sensor", "no detection"],
    causes: [
      {
        cause: "NPN/PNP mismatch with the input card's configuration",
        likelihood: "most likely",
        checkSteps: [
          "Confirm the sensor type (NPN or PNP) against its datasheet or markings",
          "Check the PLC input card's S/S terminal wiring — should be 24V for NPN, 0V for PNP (see the wiring diagram library)",
        ],
        fix: "Correct the S/S terminal wiring to match the sensor type, or swap to a sensor type that matches the existing card configuration.",
      },
      {
        cause: "Target out of the sensor's rated sensing range for that material",
        likelihood: "possible",
        checkSteps: [
          "Check the sensor's datasheet for its rated range on the specific target material — inductive sensors have shorter range on non-ferrous metals than on mild steel",
          "Physically test by moving the target progressively closer to find the actual switching distance",
        ],
        fix: "Reposition the sensor or target within actual rated range, or switch to a sensor with adequate range for that material.",
      },
      {
        cause: "Sensor power or signal wiring fault",
        likelihood: "possible",
        checkSteps: [
          "Check for supply voltage at the sensor terminals with a multimeter",
          "Check the sensor's own status LED (most have one) — no LED activity on target presence usually points to a wiring or power fault rather than a detection range issue",
        ],
        fix: "Repair the wiring fault; replace the sensor if it fails to respond even with confirmed correct power and wiring.",
      },
    ],
  },
  {
    slug: "plc-output-energized-no-response",
    symptom: "PLC output energized but device doesn't respond",
    category: "PLC & Controls",
    description: "The output bit shows ON in the programming software or HMI, but the connected device (valve, contactor, indicator) doesn't activate.",
    order: 1,
    tags: ["PLC output", "no response"],
    causes: [
      {
        cause: "Output wiring fault or blown output fuse",
        likelihood: "most likely",
        checkSteps: [
          "Measure voltage at the physical output terminal with a multimeter while the bit is forced or naturally ON",
          "Check for a blown output fuse on that specific output group, if the PLC uses fused output commons",
        ],
        fix: "Repair the wiring fault or replace the blown fuse.",
      },
      {
        cause: "Field device itself has failed",
        likelihood: "possible",
        checkSteps: [
          "If voltage is confirmed present at the output terminal but the device still doesn't respond, test the device directly with a known-good 24V source, bypassing the PLC entirely",
        ],
        fix: "Replace the failed field device (relay, solenoid coil, indicator lamp).",
      },
      {
        cause: "Output card channel failure",
        likelihood: "less common",
        checkSteps: [
          "Test a different, known-working device on the same output channel",
          "Test the same device on a different, known-working output channel",
        ],
        fix: "Replace the output card or module if the fault follows the channel rather than the device.",
      },
    ],
  },
  {
    slug: "hmi-screen-blank",
    symptom: "HMI screen blank / not powering on",
    category: "HMI & SCADA",
    description: "The HMI touchscreen shows no display at all, even though the machine otherwise has power.",
    order: 1,
    tags: ["HMI", "blank screen", "no power"],
    causes: [
      {
        cause: "No power reaching the HMI unit",
        likelihood: "most likely",
        checkSteps: [
          "Check the HMI's dedicated power supply output voltage, separate from the PLC's supply if they're on different circuits",
          "Check for a blown fuse or tripped breaker specifically on the HMI's power feed",
        ],
        fix: "Restore power — replace a blown fuse or repair the wiring fault feeding the HMI.",
      },
      {
        cause: "Display backlight failure (unit is actually running, just not visibly)",
        likelihood: "possible",
        checkSteps: [
          "Shine a flashlight at an angle across the screen — a very dim, barely visible image suggests a backlight failure rather than a total power loss",
          "Listen/feel for the HMI's normal boot behavior (fan noise, warmth) even without a visible display",
        ],
        fix: "Backlight failures typically require unit repair or replacement — this is a hardware fault, not a wiring or logic issue.",
      },
      {
        cause: "HMI project corruption preventing boot",
        likelihood: "less common",
        checkSteps: [
          "Check whether the unit shows any boot-time diagnostic message before going blank, if briefly",
          "If accessible, try re-downloading the HMI project from a known-good backup",
        ],
        fix: "Re-download a known-good project file; if that doesn't resolve it, the unit may need a firmware-level recovery per the manufacturer's procedure.",
      },
    ],
  },
  {
    slug: "servo-wont-home",
    symptom: "Servo axis won't home",
    category: "Motion & Feedback",
    description: "A servo axis fails to complete its homing sequence, either not moving at all or moving but never confirming home position.",
    order: 1,
    tags: ["servo", "homing", "motion"],
    causes: [
      {
        cause: "Home sensor not triggering or wired incorrectly",
        likelihood: "most likely",
        checkSteps: [
          "Check the home sensor's status on the HMI or programming software while manually moving the axis past the sensor's physical location",
          "Verify sensor wiring and type (NPN/PNP) against the input card configuration, same as any other sensor",
        ],
        fix: "Correct the sensor wiring or replace a failed sensor.",
      },
      {
        cause: "Servo drive fault preventing motion entirely",
        likelihood: "possible",
        checkSteps: [
          "Check the servo drive's own fault/status display for an active alarm code",
          "Confirm the drive is actually enabled (servo-on) before the homing routine starts — some PLC logic sequences can attempt to home before the enable signal has actually taken effect",
        ],
        fix: "Clear the underlying drive fault first; homing can't succeed while the drive itself is faulted.",
      },
      {
        cause: "Homing sequence logic issue (timing or sequencing)",
        likelihood: "less common",
        checkSteps: [
          "Step through the homing ladder logic or motion sequence manually via the programming software to see exactly where it stalls",
          "Check for a missing or incorrectly ordered step, e.g. attempting to detect the home sensor before the axis has actually started moving toward it",
        ],
        fix: "Correct the logic sequencing so each step's precondition is genuinely satisfied before the next step executes.",
      },
    ],
  },
  {
    slug: "fill-valve-overfilling-underfilling",
    symptom: "Fill valve overfilling or underfilling consistently",
    category: "Machine-Specific",
    description: "A volume-based filling machine consistently delivers more or less than the target volume, in the same direction every cycle.",
    order: 1,
    tags: ["filling machine", "flowmeter", "overfill", "underfill"],
    causes: [
      {
        cause: "Flowmeter pulses-per-unit calibration factor doesn't match the flowmeter's actual calibration",
        likelihood: "most likely",
        checkSteps: [
          "Compare the scaling constant used in the ladder logic (see the Filling Machine page in the Machine Library) against the flowmeter's actual calibration certificate",
          "Run a manual test fill into a container on a scale and compare actual delivered weight against the target",
        ],
        fix: "Update the scaling constant in the ladder logic to match the flowmeter's real calibration.",
      },
      {
        cause: "Fill valve's mechanical transition time isn't accounted for",
        likelihood: "possible",
        checkSteps: [
          "Check whether the fill valve takes a meaningful amount of time to fully close, during which product still passes through a partially-closed valve",
          "Test whether overfill amount is fairly consistent cycle to cycle — a consistent small overfill often points to valve closing lag rather than calibration",
        ],
        fix: "Either adjust the target trigger point slightly early to compensate for valve closing lag, or address a slow-closing valve mechanically (worn seal, sluggish actuator).",
      },
      {
        cause: "Line pressure or product viscosity has changed",
        likelihood: "less common",
        checkSteps: [
          "Check whether the drift correlates with time of day, temperature, or other equipment drawing from the same compressed air or product supply",
        ],
        fix: "If pressure fluctuation is the cause, address the supply stability; volume-based (flowmeter) filling should be much less sensitive to this than time-based filling, so significant drift here is worth investigating at the supply level.",
      },
    ],
  },
  {
    slug: "leak-test-false-rejects",
    symptom: "Leak test giving false rejects on good containers",
    category: "Machine-Specific",
    description: "A pressure-drop leak tester rejects containers that are visually and physically intact.",
    order: 1,
    tags: ["leak testing", "false reject", "pressure drop"],
    causes: [
      {
        cause: "Test head seal is worn or misaligned, leaking around the seal itself rather than through the container",
        likelihood: "most likely",
        checkSteps: [
          "Inspect the sealing cup/gasket at the test head for visible wear, cracking, or debris",
          "Test with a known-good, previously-passed container to see if the reject rate is consistent across all containers (pointing to the machine) or specific to certain containers",
        ],
        fix: "Replace the worn sealing cup or clean debris from the sealing surface.",
      },
      {
        cause: "Dwell or stabilization timer too short for the container's actual volume",
        likelihood: "possible",
        checkSteps: [
          "Check whether false rejects increased after a product/container size changeover",
          "Compare the current dwell and stabilization timer settings against what's appropriate for the new container's volume — larger containers need more time to stabilize",
        ],
        fix: "Adjust dwell and stabilization timers appropriately for the current container size.",
      },
      {
        cause: "Pressure transducer drift or miscalibration",
        likelihood: "less common",
        checkSteps: [
          "Compare the transducer's reading against a calibrated reference gauge at a known pressure",
        ],
        fix: "Recalibrate or replace the pressure transducer if it's reading outside acceptable tolerance.",
      },
    ],
  },
  {
    slug: "conveyor-zone-wont-release",
    symptom: "Conveyor accumulation zone won't release product",
    category: "Machine-Specific",
    description: "Product backs up and stays stopped in a conveyor accumulation zone even after the downstream zone becomes clear.",
    order: 2,
    tags: ["conveyor", "accumulation", "zone logic"],
    causes: [
      {
        cause: "Downstream-clear sensor for the next zone is faulted or misaligned",
        likelihood: "most likely",
        checkSteps: [
          "Check the actual status of the downstream zone's clear sensor on the HMI or programming software",
          "Physically inspect the sensor for misalignment, dirt, or product residue blocking its view",
        ],
        fix: "Clean, realign, or replace the sensor as needed.",
      },
      {
        cause: "Zone control logic referencing the wrong sensor or zone",
        likelihood: "possible",
        checkSteps: [
          "Trace the ladder logic for that specific zone's run-permission rung and confirm it's actually referencing the correct downstream sensor address, not a copy-paste error from an adjacent zone",
        ],
        fix: "Correct the logic to reference the correct sensor address for that zone.",
      },
      {
        cause: "Zone drive (motor or VFD) itself has faulted",
        likelihood: "less common",
        checkSteps: [
          "Check the zone's drive for an active fault code, separate from the accumulation logic entirely",
        ],
        fix: "Clear the underlying drive fault — accumulation logic can't release product if the zone's own drive isn't actually able to run.",
      },
    ],
  },
  {
    slug: "analog-input-unstable-reading",
    symptom: "Analog input reading unstable or erratic",
    category: "PLC & Controls",
    description: "An analog input value jumps around noisily or spikes intermittently, rather than reading a smooth, stable value.",
    order: 2,
    tags: ["analog input", "noise", "unstable reading"],
    causes: [
      {
        cause: "Signal cable routed near motor or VFD power cables, picking up induced noise",
        likelihood: "most likely",
        checkSteps: [
          "Physically trace the analog signal cable's routing and check whether it runs parallel to or shares conduit with power cables, especially VFD output cables",
          "If possible, temporarily reroute the cable further from power wiring and observe whether the reading stabilizes",
        ],
        fix: "Reroute the analog cable with adequate separation from power cabling, and ensure it's shielded twisted-pair cable.",
      },
      {
        cause: "Cable shield grounded at both ends, creating a ground loop",
        likelihood: "possible",
        checkSteps: [
          "Check whether the signal cable's shield is connected to ground at both the transmitter end and the PLC end",
        ],
        fix: "Ground the shield at one end only — typically at the PLC/control panel end.",
      },
      {
        cause: "Faulty or marginal analog input module channel",
        likelihood: "less common",
        checkSteps: [
          "Test a known-stable signal source (or a different transmitter) on the same channel to see if instability follows the channel",
          "Test the same transmitter on a different, known-working channel",
        ],
        fix: "Replace the analog input module if the fault clearly follows the channel rather than the field wiring or transmitter.",
      },
    ],
  },
];
