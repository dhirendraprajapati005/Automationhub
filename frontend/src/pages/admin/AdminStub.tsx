interface Props {
  title: string;
  description: string;
}

export const AdminStub = ({ title, description }: Props) => (
  <div>
    <p className="font-mono text-xs uppercase tracking-widest text-signal-500">Coming in a later phase</p>
    <h1 className="mt-2 font-display text-2xl font-bold">{title}</h1>
    <p className="mt-2 max-w-xl text-ink-400">{description}</p>
  </div>
);
