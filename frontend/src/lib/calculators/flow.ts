import type { CalculatorDefinition } from "./types";

const n = (v: number | string) => (typeof v === "number" ? v : parseFloat(v) || 0);
const fmt = (v: number, digits = 3) =>
  Number.isFinite(v) ? v.toLocaleString(undefined, { maximumFractionDigits: digits }) : "—";

export const pulseToGram: CalculatorDefinition = {
  slug: "pulse-to-gram",
  title: "Pulse to Gram",
  category: "Flow & Fill",
  description: "Convert a flowmeter's accumulated pulse count into weight, using its pulses-per-gram calibration factor.",
  fields: [
    { key: "pulses", label: "Total pulses", type: "number", defaultValue: 28293, min: 0 },
    {
      key: "pulsesPerGram",
      label: "Pulses per gram",
      type: "number",
      defaultValue: 28.293,
      step: 0.001,
      min: 0.001,
      helpText: "From your flowmeter's calibration certificate or datasheet.",
    },
  ],
  compute: (v) => {
    const grams = n(v.pulses) / n(v.pulsesPerGram);
    return [
      { label: "Weight", value: `${fmt(grams)} g`, highlight: true },
      { label: "In kilograms", value: `${fmt(grams / 1000, 4)} kg` },
    ];
  },
  note: "Same scaling pattern used in ladder logic: multiply the raw pulse count up before dividing, to avoid losing precision to integer truncation.",
};

export const pulseToLiter: CalculatorDefinition = {
  slug: "pulse-to-liter",
  title: "Pulse to Liter",
  category: "Flow & Fill",
  description: "Convert a flowmeter's accumulated pulse count into volume, using its pulses-per-liter calibration factor.",
  fields: [
    { key: "pulses", label: "Total pulses", type: "number", defaultValue: 5000, min: 0 },
    {
      key: "pulsesPerLiter",
      label: "Pulses per liter",
      type: "number",
      defaultValue: 450,
      step: 0.01,
      min: 0.01,
      helpText: "From your flowmeter's calibration certificate or datasheet.",
    },
  ],
  compute: (v) => {
    const liters = n(v.pulses) / n(v.pulsesPerLiter);
    return [
      { label: "Volume", value: `${fmt(liters)} L`, highlight: true },
      { label: "In milliliters", value: `${fmt(liters * 1000, 1)} mL` },
    ];
  },
};

export const tankVolume: CalculatorDefinition = {
  slug: "tank-volume",
  title: "Tank Volume",
  category: "Flow & Fill",
  description: "Calculate liquid capacity for a cylindrical or rectangular tank.",
  fields: [
    {
      key: "shape",
      label: "Tank shape",
      type: "select",
      defaultValue: "cylindrical",
      options: [
        { value: "cylindrical", label: "Cylindrical" },
        { value: "rectangular", label: "Rectangular" },
      ],
    },
    {
      key: "diameter",
      label: "Diameter",
      type: "number",
      unit: "m",
      defaultValue: 1.2,
      step: 0.01,
      min: 0,
      showIf: (v) => v.shape === "cylindrical",
    },
    {
      key: "length",
      label: "Length",
      type: "number",
      unit: "m",
      defaultValue: 2,
      step: 0.01,
      min: 0,
      showIf: (v) => v.shape === "rectangular",
    },
    {
      key: "width",
      label: "Width",
      type: "number",
      unit: "m",
      defaultValue: 1,
      step: 0.01,
      min: 0,
      showIf: (v) => v.shape === "rectangular",
    },
    { key: "height", label: "Height / liquid level", type: "number", unit: "m", defaultValue: 1.5, step: 0.01, min: 0 },
  ],
  compute: (v) => {
    let volumeM3: number;
    if (v.shape === "cylindrical") {
      const r = n(v.diameter) / 2;
      volumeM3 = Math.PI * r * r * n(v.height);
    } else {
      volumeM3 = n(v.length) * n(v.width) * n(v.height);
    }
    const liters = volumeM3 * 1000;
    return [
      { label: "Volume", value: `${fmt(liters)} L`, highlight: true },
      { label: "In cubic meters", value: `${fmt(volumeM3, 4)} m³` },
      { label: "In US gallons", value: `${fmt(liters * 0.264172)} gal` },
    ];
  },
};

export const flowRate: CalculatorDefinition = {
  slug: "flow-rate",
  title: "Flow Rate",
  category: "Flow & Fill",
  description: "Calculate flow rate from a measured volume over a measured time.",
  fields: [
    { key: "volume", label: "Volume", type: "number", unit: "L", defaultValue: 10, min: 0, step: 0.01 },
    { key: "timeSeconds", label: "Time", type: "number", unit: "seconds", defaultValue: 30, min: 0.001, step: 0.1 },
  ],
  compute: (v) => {
    const volume = n(v.volume);
    const t = n(v.timeSeconds);
    const lpm = volume / (t / 60);
    const lph = volume / (t / 3600);
    return [
      { label: "Flow rate", value: `${fmt(lpm)} L/min`, highlight: true },
      { label: "Per hour", value: `${fmt(lph)} L/hr` },
      { label: "Per second", value: `${fmt(volume / t, 4)} L/s` },
    ];
  },
};
