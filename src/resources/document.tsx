
export interface Document {
  id: number;
  owner_id: number | null;
  user_id: number;
  partner_id?: number | null;
  name: string;
  note: string;
  mimetype: string;
  size: number;
  url: string;
  context: string|null;
  created_at: Date;
  updated_at: Date;
}
