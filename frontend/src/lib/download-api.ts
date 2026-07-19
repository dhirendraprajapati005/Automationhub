import { api } from "@/lib/api";
import type { DownloadItem } from "@/types/download";

export const fetchDownloads = async (
  category?: string
): Promise<{ downloads: DownloadItem[]; categories: string[] }> => {
  const { data } = await api.get("/downloads", { params: category ? { category } : {} });
  return data;
};

// Triggers a real browser download via the file-serving endpoint (which
// also increments the server-side download counter), rather than fetching
// the bytes into memory first.
export const downloadFileUrl = (id: string) => {
  const base = api.defaults.baseURL;
  return `${base}/downloads/${id}/file`;
};

export const uploadDownload = async (formData: FormData) => {
  const { data } = await api.post("/downloads", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.download as DownloadItem;
};

export const deleteDownload = async (id: string) => {
  await api.delete(`/downloads/${id}`);
};
