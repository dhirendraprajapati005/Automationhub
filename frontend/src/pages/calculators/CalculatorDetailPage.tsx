import { Link, useParams } from "react-router-dom";
import { getCalculator } from "@/lib/calculators/registry";
import { CalculatorForm } from "@/components/calculators/CalculatorForm";
import { useSEO } from "@/hooks/useSEO";
import { buildBreadcrumbSchema } from "@/lib/structured-data";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const CalculatorDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const calculator = slug ? getCalculator(slug) : undefined;

  const breadcrumbItems = [
    { name: "Calculators", path: "/calculators" },
    { name: calculator?.title ?? "Calculator", path: `/calculators/${slug}` },
  ];

  useSEO({
    title: calculator ? calculator.title : "Calculator",
    description: calculator?.description ?? "A free industrial automation engineering calculator.",
    path: `/calculators/${slug}`,
    structuredData: calculator ? buildBreadcrumbSchema(breadcrumbItems) : undefined,
  });

  if (!calculator) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20">
        <p className="text-red-400">Calculator not found.</p>
        <Link to="/calculators" className="mt-4 inline-block text-signal-500 hover:text-signal-400">
          &larr; Back to all calculators
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <Breadcrumbs items={breadcrumbItems} />

      <Link to="/calculators" className="text-sm text-ink-400 hover:text-signal-500">
        &larr; All calculators
      </Link>

      <p className="mt-4 font-mono text-xs uppercase tracking-widest text-signal-500">{calculator.category}</p>
      <h1 className="mt-2 font-display text-3xl font-bold">{calculator.title}</h1>
      <p className="mt-2 max-w-2xl text-ink-400">{calculator.description}</p>

      <div className="mt-8">
        <CalculatorForm calculator={calculator} />
      </div>
    </div>
  );
};
