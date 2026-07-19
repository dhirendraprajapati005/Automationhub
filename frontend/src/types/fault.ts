export type Likelihood = "most likely" | "possible" | "less common";

export interface FaultCause {
  cause: string;
  likelihood: Likelihood;
  checkSteps: string[];
  fix: string;
}

export interface FaultSummary {
  slug: string;
  symptom: string;
  category: string;
  description: string;
  tags: string[];
}

export interface Fault extends FaultSummary {
  causes: FaultCause[];
}
