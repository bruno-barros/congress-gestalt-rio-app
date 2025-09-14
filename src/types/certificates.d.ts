export type Orientation = "h" | "v";

export enum CertificateType {
  PARTICIPANT = "participant",
  ABSTRACT = "abstract",
  ACTIVITY = "activity",
}

export interface CertificatesSchema {
  type: CertificateType;
  name: string;
  edition: string;
  url: string | null;
  created_at: string;
}

export interface CertificatesModelSchema {
  id: number;
  user_id: number;
  type: CertificateType;
  edition: string;
  description: string;
  url: string;
  created_at: string;
  updated_at: string;
}
