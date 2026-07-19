import { Link } from "react-router-dom";
import { Calculator, ArrowRight } from "lucide-react";
import { CALCULATORS, CALCULATOR_CATEGORIES } from "@/lib/calculators/registry";
import { useSEO } from "@/hooks/useSEO";

export const Calculators = () => {
  useSEO({
    title: "Engineering Calculators — Free PLC & Automation Tools",
    description:
      "12 free engineering calculators: pulse-to-gram, motor current, cable size, RPM, conveyor speed, pressure/temperature converters, and more. Instant results, no sign-up.",
    path: "/calculators",
  });

  return (
  <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
    <p className="font-mono text-xs uppercase tracking-widest text-signal-500">Tools</p>
    <h1 className="mt-3 font-display text-3xl font-bold sm:text-4xl">Engineering Calculators</h1>
    <p className="mt-3 max-w-2xl text-ink-400">
      12 calculators for the numbers you actually need on the floor — flow scaling, motor sizing, cable
      selection, and unit conversions. All calculate instantly, no sign-up required.
    </p>

    {CALCULATOR_CATEGORIES.map((category) => (
      <div key={category} className="mt-12">
        <h2 className="font-display text-lg font-semibold text-ink-200">{category}</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CALCULATORS.filter((c) => c.category === category).map((calc) => (
            <Link
              key={calc.slug}
              to={`/calculators/${calc.slug}`}
              className="panel-card group flex flex-col hover:border-signal-500/50 transition-colors"
            >
              <Calculator className="h-5 w-5 text-signal-500" />
              <h3 className="mt-3 font-display font-semibold">{calc.title}</h3>
              <p className="mt-1.5 flex-1 text-sm text-ink-400">{calc.description}</p>
              <span className="mt-4 flex items-center gap-1 text-xs text-signal-500 opacity-0 transition-opacity group-hover:opacity-100">
                Open calculator <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    ))}
  </div>
  );
};
