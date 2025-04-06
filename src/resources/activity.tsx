import { ActivitySchema } from "../types/activity.type";
import { ItemLanguageWithId } from "../types/settings";
import { TaxonomySchema } from "../types/taxonomy.type";

export default class Activity {
  // @see src\types\activity.type.ts
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


  constructor(data: ActivitySchema) {
    Object.assign(this, data);
  }

  static make(data: ActivitySchema) {
    return new Activity(data);
  }

  getTitle(lang: string) {
    switch (lang) {
      case "pt":
        return this.title_pt;
      case "es":
        return this.title_es || this.title;
      case "en":
        return this.title_en || this.title;
      default:
        return this.title;
    }
  }

  getDescription(lang: string) {
    switch (lang) {
      case "pt":
        return this.description_pt;
      case "es":
        return this.description_es || this.description;
      case "en":
        return this.description_en || this.description;
      default:
        return this.description;
    }
  }

}
