import type { CalculatorDefinition } from "./types";

const n = (v: number | string) => (typeof v === "number" ? v : parseFloat(v) || 0);
const fmt = (v: number, digits = 3) =>
  Number.isFinite(v) ? v.toLocaleString(undefined, { maximumFractionDigits: digits }) : "—";

export const motorCurrent: CalculatorDefinition = {
  slug: "motor-current",
  title: "Motor Current",
  category: "Electrical",
  description: "Estimate full-load current (FLA) for a motor from its rated power, voltage, and phase.",
  fields: [
    { key: "power", label: "Motor power", type: "number", unit: "kW", defaultValue: 5.5, min: 0, step: 0.01 },
    { key: "voltage", label: "Supply voltage", type: "number", unit: "V", defaultValue: 415, min: 1 },
    {
      key: "phase",
      label: "Supply phase",
      type: "select",
      defaultValue: "three",
      options: [
        { value: "single", label: "Single phase" },
        { value: "three", label: "Three phase" },
      ],
    },
    { key: "powerFactor", label: "Power factor", type: "number", defaultValue: 0.85, min: 0.1, max: 1, step: 0.01 },
    { key: "efficiency", label: "Motor efficiency", type: "number", defaultValue: 0.9, min: 0.1, max: 1, step: 0.01 },
  ],
  compute: (v) => {
    const p = n(v.power) * 1000;
    const voltage = n(v.voltage);
    const pf = n(v.powerFactor);
    const eff = n(v.efficiency);
    const current =
      v.phase === "single" ? p / (voltage * pf * eff) : p / (Math.sqrt(3) * voltage * pf * eff);
    return [
      { label: "Full-load current", value: `${fmt(current)} A`, highlight: true },
      { label: "Recommended MCCB/overload setting", value: `${fmt(current * 1.15)} A (approx. +15%)` },
    ];
  },
  note: "Estimate for sizing checks only — always confirm against the motor's actual nameplate FLA before final selection.",
};

// Simplified copper conductor ampacity table (single-core, PVC insulation,
// enclosed in conduit, ambient ~30°C) — approximate values for estimation.
const AMPACITY_TABLE: { csa: number; ampacity: number }[] = [
  { csa: 1.5, ampacity: 17.5 },
  { csa: 2.5, ampacity: 24 },
  { csa: 4, ampacity: 32 },
  { csa: 6, ampacity: 41 },
  { csa: 10, ampacity: 57 },
  { csa: 16, ampacity: 76 },
  { csa: 25, ampacity: 101 },
  { csa: 35, ampacity: 125 },
  { csa: 50, ampacity: 151 },
  { csa: 70, ampacity: 192 },
  { csa: 95, ampacity: 232 },
  { csa: 120, ampacity: 269 },
];

const COPPER_RESISTIVITY = 0.0175; // Ω·mm²/m at ~20°C

export const cableSize: CalculatorDefinition = {
  slug: "cable-size",
  title: "Cable Size",
  category: "Electrical",
  description: "Suggest a minimum copper cable cross-section from load current, run length, and an allowable voltage drop.",
  fields: [
    { key: "current", label: "Load current", type: "number", unit: "A", defaultValue: 32, min: 0.1 },
    { key: "length", label: "One-way cable length", type: "number", unit: "m", defaultValue: 40, min: 0.1 },
    { key: "voltage", label: "System voltage", type: "number", unit: "V", defaultValue: 415, min: 1 },
    {
      key: "phase",
      label: "Supply phase",
      type: "select",
      defaultValue: "three",
      options: [
        { value: "single", label: "Single phase" },
        { value: "three", label: "Three phase" },
      ],
    },
    { key: "maxDropPct", label: "Max allowable voltage drop", type: "number", unit: "%", defaultValue: 3, min: 0.5, step: 0.5 },
  ],
  compute: (v) => {
    const current = n(v.current);
    const length = n(v.length);
    const voltage = n(v.voltage);
    const maxDropPct = n(v.maxDropPct);
    const maxDropVolts = (maxDropPct / 100) * voltage;
    const phaseFactor = v.phase === "single" ? 2 : Math.sqrt(3);

    // Find the smallest ampacity-adequate size, then check its voltage drop too
    let chosen = AMPACITY_TABLE[AMPACITY_TABLE.length - 1];
    for (const row of AMPACITY_TABLE) {
      if (row.ampacity >= current) {
        const dropAtThisSize = (phaseFactor * COPPER_RESISTIVITY * length * current) / row.csa;
        if (dropAtThisSize <= maxDropVolts) {
          chosen = row;
          break;
        }
      }
    }
    const actualDropV = (phaseFactor * COPPER_RESISTIVITY * length * current) / chosen.csa;
    const actualDropPct = (actualDropV / voltage) * 100;

    return [
      { label: "Suggested cable size", value: `${chosen.csa} mm²`, highlight: true },
      { label: "Estimated voltage drop", value: `${fmt(actualDropV, 2)} V (${fmt(actualDropPct, 2)}%)` },
      { label: "Cable ampacity", value: `${chosen.ampacity} A` },
    ];
  },
  note: "Simplified estimate (single-core copper, PVC insulation, ~30°C ambient) for planning only. Always verify against your local electrical code and derating factors before installation.",
};

export const rpmCalculator: CalculatorDefinition = {
  slug: "rpm",
  title: "Motor Synchronous Speed (RPM)",
  category: "Electrical",
  description: "Calculate an AC induction motor's synchronous speed from supply frequency and pole count.",
  fields: [
    { key: "frequency", label: "Supply frequency", type: "number", unit: "Hz", defaultValue: 50, min: 1 },
    {
      key: "poles",
      label: "Number of poles",
      type: "select",
      defaultValue: "4",
      options: [
        { value: "2", label: "2 poles" },
        { value: "4", label: "4 poles" },
        { value: "6", label: "6 poles" },
        { value: "8", label: "8 poles" },
      ],
    },
    { key: "slipPct", label: "Typical slip", type: "number", unit: "%", defaultValue: 3, min: 0, step: 0.1 },
  ],
  compute: (v) => {
    const freq = n(v.frequency);
    const poles = n(v.poles);
    const sync = (120 * freq) / poles;
    const actual = sync * (1 - n(v.slipPct) / 100);
    return [
      { label: "Synchronous speed", value: `${fmt(sync, 1)} RPM`, highlight: true },
      { label: "Approx. actual speed (with slip)", value: `${fmt(actual, 1)} RPM` },
    ];
  },
  note: "Actual running speed is always slightly below synchronous speed for an induction motor — the difference is called slip.",
};

export const conveyorSpeed: CalculatorDefinition = {
  slug: "conveyor-speed",
  title: "Conveyor Speed",
  category: "Mechanical",
  description: "Calculate belt speed from pulley diameter and rotational speed.",
  fields: [
    { key: "diameter", label: "Pulley diameter", type: "number", unit: "mm", defaultValue: 100, min: 1 },
    { key: "rpm", label: "Pulley speed", type: "number", unit: "RPM", defaultValue: 60, min: 0 },
  ],
  compute: (v) => {
    const diameterM = n(v.diameter) / 1000;
    const circumference = Math.PI * diameterM;
    const speedMPerMin = circumference * n(v.rpm);
    return [
      { label: "Belt speed", value: `${fmt(speedMPerMin)} m/min`, highlight: true },
      { label: "Per second", value: `${fmt(speedMPerMin / 60, 4)} m/s` },
      { label: "Per hour", value: `${fmt(speedMPerMin * 60, 1)} m/hr` },
    ];
  },
};
