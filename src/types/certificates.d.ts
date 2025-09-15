export type Orientation = "h" | "v";

export enum CertificateType {
  PARTICIPANT = "participant",
  ABSTRACT = "abstract",
  ACTIVITY = "activity",
  SPEAKER = "speaker",
}

export interface CertificatesSchema {
  type: CertificateType;
  name: string;
  edition: string;
  url: string | null;
  created_at: string;
  entity_id?: number;
}

export interface CertificatesModelSchema {
  id: number;
  user_id: number;
  type: CertificateType;
  entity_id?: number;
  edition: string;
  description: string;
  url: string;
  created_at: string;
  updated_at: string;
}
