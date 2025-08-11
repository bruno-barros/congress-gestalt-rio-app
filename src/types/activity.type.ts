import { ItemLanguageWithId } from "./settings";
import { TaxonomySchema } from "./taxonomy.type";

export interface ActivitySchema {
  id: number;
  uuid: string;
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
  occupation: number;
  certificate: boolean;
  venue_id: null | number;
  room_id: null | number;
  type_id: null | string; // modalidade
  topic_id: null | string;
  active: boolean;
  created_at: string;
  updated_at: string;
  group?: TaxonomySchema;
  venue?: TaxonomySchema;
  room?: TaxonomySchema;
  speakers?: TaxonomySchema[];
  topic?: ItemLanguageWithId;
  type?: ItemLanguageWithId; // modalidade
  subscriptions?: ActivityUserSchema[];
  valid_subscriptions?: ActivityUserSchema[];
}

export interface ActivityUserSchema {
  id: number;
  user_id: number;
  activity_id: number;
  status: string;
  created_at: string;
  updated_at: string;
  checkin_at: string | null;
  metadata: object | null;
  obs: string | null;
  user?: {
    ID: number;
    user_login: string;
    user_nicename: string;
    user_email: string;
    user_status: number;
    display_name: string;
    metas?: {
      umeta_id: number;
      user_id: number;
      meta_key: string;
      meta_value: string;
    }[]
  };
}
