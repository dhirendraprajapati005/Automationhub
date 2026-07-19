import { api } from "@/lib/api";
import type { FaultSummary, Fault } from "@/types/fault";

export const fetchFaults = async (category?: string): Promise<FaultSummary[]> => {
  const { data } = await api.get("/faults", { params: category ? { category } : {} });
  return data.faults;
};

export const fetchFault = async (slug: string): Promise<Fault> => {
  const { data } = await api.get(`/faults/${slug}`);
  return data.fault;
};
