import { TaxonomySchema } from "./taxonomy.type";

export interface ActivitySchema {
    id: number;
    edition: string;
    group_id: null | number;
    title: string;
    title_pt: string;
    title_es: string;
    title_en: string;
    start_at: string;
    end_at: string;
    description: string;
    description_pt: string;
    description_es: string;
    description_en: string;
    workload: number;
    vacancies: number;
    certificate: boolean;
    venue_id: null | number;
    room_id: null | number;
    type_id: null | string;
    topic_id: null | string;
    active: boolean;
    created_at: string;
    updated_at: string;
    group?: TaxonomySchema;
  }
  
  