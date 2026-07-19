import { api } from "@/lib/api";

export interface SearchResult {
  type: string;
  title: string;
  snippet: string;
  path: string;
}

export const search = async (query: string): Promise<SearchResult[]> => {
  const { data } = await api.get("/search", { params: { q: query } });
  return data.results;
};
