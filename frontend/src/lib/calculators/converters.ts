import type { CalculatorDefinition } from "./types";

const n = (v: number | string) => (typeof v === "number" ? v : parseFloat(v) || 0);
const fmt = (v: number, digits = 4) =>
  Number.isFinite(v) ? v.toLocaleString(undefined, { maximumFractionDigits: digits }) : "—";

// --- Pressure ---------------------------------------------------------
// Conversion factors to Pascals (the common base unit)
const PRESSURE_TO_PA: Record<string, number> = {
  pa: 1,
  kpa: 1000,
  bar: 100000,
  psi: 6894.76,
  atm: 101325,
};
const PRESSURE_LABELS: Record<string, string> = { pa: "Pa", kpa: "kPa", bar: "bar", psi: "psi", atm: "atm" };

export const pressureConverter: CalculatorDefinition = {
  slug: "pressure-converter",
  title: "Pressure Converter",
  category: "Converters",
  description: "Convert between bar, PSI, kPa, Pa, and atmospheres.",
  fields: [
    { key: "value", label: "Value", type: "number", defaultValue: 6, step: 0.01 },
    {
      key: "from",
      label: "From unit",
      type: "select",
      defaultValue: "bar",
      options: Object.entries(PRESSURE_LABELS).map(([value, label]) => ({ value, label })),
    },
  ],
  compute: (v) => {
    const pa = n(v.value) * PRESSURE_TO_PA[v.from as string];
    return Object.entries(PRESSURE_TO_PA)
      .filter(([unit]) => unit !== v.from)
      .map(([unit, factor]) => ({
        label: `In ${PRESSURE_LABELS[unit]}`,
        value: fmt(pa / factor),
        highlight: unit === "bar",
      }));
  },
};

// --- Temperature --------------------------------------------------------
export const temperatureConverter: CalculatorDefinition = {
  slug: "temperature-converter",
  title: "Temperature Converter",
  category: "Converters",
  description: "Convert between Celsius, Fahrenheit, and Kelvin.",
  fields: [
    { key: "value", label: "Value", type: "number", defaultValue: 25, step: 0.1 },
    {
      key: "from",
      label: "From unit",
      type: "select",
      defaultValue: "c",
      options: [
        { value: "c", label: "Celsius (°C)" },
        { value: "f", label: "Fahrenheit (°F)" },
        { value: "k", label: "Kelvin (K)" },
      ],
    },
  ],
  compute: (v) => {
    const value = n(v.value);
    let celsius: number;
    if (v.from === "c") celsius = value;
    else if (v.from === "f") celsius = ((value - 32) * 5) / 9;
    else celsius = value - 273.15;

    const results = [
      { unit: "c", label: "Celsius", value: celsius },
      { unit: "f", label: "Fahrenheit", value: (celsius * 9) / 5 + 32 },
      { unit: "k", label: "Kelvin", value: celsius + 273.15 },
    ];
    return results
      .filter((r) => r.unit !== v.from)
      .map((r) => ({ label: r.label, value: `${fmt(r.value, 2)}°`, highlight: r.unit === "c" }));
  },
};

// --- General unit converter (length) ------------------------------------
const LENGTH_TO_M: Record<string, number> = {
  mm: 0.001,
  cm: 0.01,
  m: 1,
  km: 1000,
  in: 0.0254,
  ft: 0.3048,
};
const LENGTH_LABELS: Record<string, string> = { mm: "mm", cm: "cm", m: "m", km: "km", in: "inch", ft: "ft" };

export const unitConverter: CalculatorDefinition = {
  slug: "unit-converter",
  title: "Unit Converter (Length)",
  category: "Converters",
  description: "Convert length measurements between metric and imperial units.",
  fields: [
    { key: "value", label: "Value", type: "number", defaultValue: 1, step: 0.01 },
    {
      key: "from",
      label: "From unit",
      type: "select",
      defaultValue: "m",
      options: Object.entries(LENGTH_LABELS).map(([value, label]) => ({ value, label })),
    },
  ],
  compute: (v) => {
    const meters = n(v.value) * LENGTH_TO_M[v.from as string];
    return Object.entries(LENGTH_TO_M)
      .filter(([unit]) => unit !== v.from)
      .map(([unit, factor]) => ({
        label: LENGTH_LABELS[unit],
        value: fmt(meters / factor),
        highlight: unit === "m",
      }));
  },
};

// --- Production calculator -----------------------------------------------
export const productionCalculator: CalculatorDefinition = {
  slug: "production-calculator",
  title: "Production Calculator",
  category: "Production",
  description: "Estimate output per hour and per shift from a machine's cycle time and planned downtime.",
  fields: [
    { key: "cycleTime", label: "Cycle time per unit", type: "number", unit: "seconds", defaultValue: 4.5, min: 0.01, step: 0.01 },
    { key: "shiftHours", label: "Shift length", type: "number", unit: "hours", defaultValue: 8, min: 0.1, step: 0.5 },
    { key: "downtimeMinutes", label: "Planned downtime per shift", type: "number", unit: "minutes", defaultValue: 30, min: 0 },
  ],
  compute: (v) => {
    const cycleTime = n(v.cycleTime);
    const shiftMinutes = n(v.shiftHours) * 60 - n(v.downtimeMinutes);
    const unitsPerHour = 3600 / cycleTime;
    const unitsPerShift = (shiftMinutes * 60) / cycleTime;
    return [
      { label: "Units per hour", value: fmt(unitsPerHour, 1), highlight: true },
      { label: "Units per shift", value: fmt(unitsPerShift, 0), highlight: true },
      { label: "Effective run time", value: `${fmt(shiftMinutes, 1)} min` },
    ];
  },
  note: "Theoretical maximum based on cycle time alone — actual output will typically be lower once unplanned stops and rate losses are factored in (see OEE).",
};
