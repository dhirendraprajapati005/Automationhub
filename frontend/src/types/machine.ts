export interface MachineSummary {
  slug: string;
  title: string;
  category: string;
  summary: string;
  tags: string[];
  order: number;
}

export interface Machine extends MachineSummary {
  content: string;
}
