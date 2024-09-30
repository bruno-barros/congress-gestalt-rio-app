export interface UploadedFileSchema<M extends Object = never> {
  url: string;
  file: string;
  type: string;
  name: string;
  original_file: string;
  original_url: string;
  size: number;
  attachment_id: number | null;
  ext: string;
  original_name: string;
  metadata: M;
  is_image: boolean;
}
