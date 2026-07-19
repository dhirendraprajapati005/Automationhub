import { pulseToGram, pulseToLiter, tankVolume, flowRate } from "./flow";
import { motorCurrent, cableSize, rpmCalculator, conveyorSpeed } from "./electrical-mechanical";
import { pressureConverter, temperatureConverter, unitConverter, productionCalculator } from "./converters";
import type { CalculatorDefinition } from "./types";

export const CALCULATORS: CalculatorDefinition[] = [
  pulseToGram,
  pulseToLiter,
  tankVolume,
  flowRate,
  motorCurrent,
  cableSize,
  rpmCalculator,
  conveyorSpeed,
  pressureConverter,
  temperatureConverter,
  unitConverter,
  productionCalculator,
];

export const getCalculator = (slug: string): CalculatorDefinition | undefined =>
  CALCULATORS.find((c) => c.slug === slug);

export const CALCULATOR_CATEGORIES = Array.from(new Set(CALCULATORS.map((c) => c.category)));
