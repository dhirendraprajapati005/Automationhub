import { api } from "@/lib/api";

export interface SiteSettings {
  siteName: string;
  defaultMetaDescription: string;
  defaultOgImageUrl: string;
  twitterHandle: string;
  googleSiteVerification: string;
  allowSearchIndexing: boolean;
}

export const fetchSettings = async (): Promise<SiteSettings> => {
  const { data } = await api.get("/settings");
  return data.settings;
};

export const updateSettings = async (payload: Partial<SiteSettings>): Promise<SiteSettings> => {
  const { data } = await api.put("/settings", payload);
  return data.settings;
};
