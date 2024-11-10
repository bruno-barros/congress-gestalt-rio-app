import Document from "next/document";
export interface DocumentSchema {
  id: number;
  owner_id: number | null;
  user_id: number;
  abstract_id: number | null;
  name: string;
  note: string | null;
  mimetype: string;
  size: number;
  url: string;
  context: string;
  uuid: string;
  version: number;
  created_at: string;
  updated_at: string;
}

export interface DocumentContext {
  id: string;
  name: string;
  translationKey: string | null;
}
