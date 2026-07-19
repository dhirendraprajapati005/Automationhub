import { useMemo, useState } from "react";
import type { CalculatorDefinition } from "@/lib/calculators/types";

interface Props {
  calculator: CalculatorDefinition;
}

export const CalculatorForm = ({ calculator }: Props) => {
  const initialValues = useMemo(
    () => Object.fromEntries(calculator.fields.map((f) => [f.key, f.defaultValue])),
    [calculator]
  );
  const [values, setValues] = useState<Record<string, number | string>>(initialValues);

  const setField = (key: string, raw: string, type: "number" | "select") => {
    setValues((prev) => ({ ...prev, [key]: type === "number" ? raw : raw }));
  };

  // Results recompute live on every keystroke — no submit button, since these
  // are quick lookup tools an engineer wants an instant answer from.
  const results = useMemo(() => {
    try {
      return calculator.compute(values);
    } catch {
      return [];
    }
  }, [calculator, values]);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="panel-card space-y-5">
        {calculator.fields
          .filter((field) => !field.showIf || field.showIf(values))
          .map((field) => (
            <div key={field.key}>
              <label htmlFor={field.key} className="flex items-center justify-between text-sm font-medium text-ink-200">
                {field.label}
                {field.unit && <span className="font-mono text-xs text-ink-400">{field.unit}</span>}
              </label>

              {field.type === "select" ? (
                <select
                  id={field.key}
                  value={String(values[field.key])}
                  onChange={(e) => setField(field.key, e.target.value, "select")}
                  className="mt-1.5 w-full rounded-[var(--radius-panel)] border border-panel-600 bg-panel-950 px-3 py-2.5 text-sm focus:border-signal-500 focus:outline-none"
                >
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id={field.key}
                  type="number"
                  step={field.step ?? "any"}
                  min={field.min}
                  max={field.max}
                  value={values[field.key]}
                  onChange={(e) => setField(field.key, e.target.value, "number")}
                  className="mt-1.5 w-full rounded-[var(--radius-panel)] border border-panel-600 bg-panel-950 px-3 py-2.5 font-mono text-sm focus:border-signal-500 focus:outline-none"
                />
              )}
              {field.helpText && <p className="mt-1 text-xs text-ink-400">{field.helpText}</p>}
            </div>
          ))}
      </div>

      <div className="panel-card flex flex-col">
        <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-ink-400">Result</h3>
        <div className="mt-4 flex-1 space-y-4">
          {results.map((r) => (
            <div key={r.label} className={r.highlight ? "" : "border-t border-panel-700 pt-3"}>
              <p className="text-xs text-ink-400">{r.label}</p>
              <p
                className={
                  r.highlight
                    ? "mt-1 font-mono text-3xl font-bold text-signal-500"
                    : "mt-1 font-mono text-lg text-ink-50"
                }
              >
                {r.value}
              </p>
            </div>
          ))}
        </div>

        {calculator.note && (
          <p className="mt-6 border-t border-panel-700 pt-4 text-xs text-ink-400">{calculator.note}</p>
        )}
      </div>
    </div>
  );
};
