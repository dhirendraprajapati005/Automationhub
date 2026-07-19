import { api } from "@/lib/api";
import type { MachineSummary, Machine } from "@/types/machine";

export const fetchMachines = async (): Promise<MachineSummary[]> => {
  const { data } = await api.get("/machines");
  return data.machines;
};

export const fetchMachine = async (slug: string): Promise<Machine> => {
  const { data } = await api.get(`/machines/${slug}`);
  return data.machine;
};
