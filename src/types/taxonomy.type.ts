export enum TaxonomyType {
  GROUP = "group",
  SPEAKER = "speaker",
  VENUE = "venue",
  ROOM = "room",
}
export interface TaxonomySchema {
  id: number;
  edition: string;
  type: TaxonomyType;
  label: string;
  label_pt: string;
  label_es: string;
  label_en: string;
  external_id: null | number;
  description: string;
  description_pt: string;
  description_es: string;
  description_en: string;
  img: string;
  active: boolean;
}
