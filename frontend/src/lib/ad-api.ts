import { api } from "@/lib/api";

export const AD_PLACEMENTS = ["homepage-banner", "sidebar", "in-content", "footer"] as const;
export type AdPlacement = (typeof AD_PLACEMENTS)[number];

export interface Ad {
  _id: string;
  placement: AdPlacement;
  title: string;
  imageUrl: string;
  linkUrl: string;
  altText: string;
  sponsorName: string;
  isActive?: boolean;
  startsAt?: string | null;
  endsAt?: string | null;
  impressionCount?: number;
  clickCount?: number;
}

export const fetchAdForPlacement = async (placement: AdPlacement): Promise<Ad | null> => {
  const { data } = await api.get(`/ads/${placement}`);
  return data.ad;
};

export const recordAdClick = (id: string) => {
  // Fire-and-forget — a failed click ping shouldn't block navigation to the ad's link
  api.post(`/ads/${id}/click`).catch(() => {});
};

export const fetchAllAdsAdmin = async (): Promise<Ad[]> => {
  const { data } = await api.get("/ads/admin/all");
  return data.ads;
};

export const createAd = async (payload: Partial<Ad>): Promise<Ad> => {
  const { data } = await api.post("/ads", payload);
  return data.ad;
};

export const updateAd = async (id: string, payload: Partial<Ad>): Promise<Ad> => {
  const { data } = await api.put(`/ads/${id}`, payload);
  return data.ad;
};

export const deleteAd = async (id: string) => {
  await api.delete(`/ads/${id}`);
};
