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

export interface AttachmentSchema {
  id: number
  user_id: number
  owner_id?: number
  abstract_id: number
  name: string
  note: string
  mimetype: string
  size: number
  url: string
  context: string
  uuid?: string
  version?: number
  created_at: string
}