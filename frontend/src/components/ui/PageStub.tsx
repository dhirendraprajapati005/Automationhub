interface PageStubProps {
  title: string;
  description?: string;
}

/**
 * Placeholder for pages whose routing/layout exists in Phase 1 but whose
 * real content lands in a later phase. Keeps the route tree navigable and
 * demonstrates the page shell (spacing, container width, typography).
 */
export const PageStub = ({ title, description }: PageStubProps) => (
  <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
    <p className="font-mono text-xs uppercase tracking-widest text-signal-500">Coming in Phase 2</p>
    <h1 className="mt-3 font-display text-3xl font-bold">{title}</h1>
    {description && <p className="mt-3 max-w-xl text-ink-400">{description}</p>}
  </div>
);
