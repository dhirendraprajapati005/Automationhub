export type FieldType = "number" | "select";

export interface SelectOption {
  value: string;
  label: string;
}

export interface CalculatorField {
  key: string;
  label: string;
  type: FieldType;
  unit?: string;
  defaultValue: number | string;
  options?: SelectOption[];
  step?: number;
  min?: number;
  max?: number;
  /** Only render this field when the predicate over current values is true. */
  showIf?: (values: Record<string, number | string>) => boolean;
  helpText?: string;
}

export interface CalculatorResult {
  label: string;
  value: string;
  highlight?: boolean;
}

export interface CalculatorDefinition {
  slug: string;
  title: string;
  category: string;
  description: string;
  fields: CalculatorField[];
  compute: (values: Record<string, number | string>) => CalculatorResult[];
  note?: string;
}
