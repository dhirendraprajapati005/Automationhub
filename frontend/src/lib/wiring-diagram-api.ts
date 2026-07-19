import { api } from "@/lib/api";
import type { WiringDiagramSummary, WiringDiagram } from "@/types/wiringDiagram";

export const fetchWiringDiagrams = async (): Promise<WiringDiagramSummary[]> => {
  const { data } = await api.get("/wiring-diagrams");
  return data.diagrams;
};

export const fetchWiringDiagram = async (slug: string): Promise<WiringDiagram> => {
  const { data } = await api.get(`/wiring-diagrams/${slug}`);
  return data.diagram;
};
