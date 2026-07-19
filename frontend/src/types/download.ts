export interface DownloadItem {
  _id: string;
  title: string;
  description: string;
  category: string;
  originalFileName: string;
  fileSizeBytes: number;
  fileExtension: string;
  downloadCount: number;
  tags: string[];
  createdAt: string;
}
