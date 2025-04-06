import {
  TaxonomySchema,
  TaxonomyType,
  TaxonomyTypeSchema,
} from "../types/taxonomy.type";

export const TAXONOMY_TYPES: TaxonomyTypeSchema[] = [
  {
    id: TaxonomyType.GROUP,
    label_pt: "Grupo",
    label_en: "Group",
    label_es: "Grupo",
    plural_pt: "Grupos",
    plural_en: "Groups",
    plural_es: "Grupos",
  },
  {
    id: TaxonomyType.SPEAKER,
    label_pt: "Palestrante",
    label_en: "Speaker",
    label_es: "Ponente",
    plural_pt: "Palestrantes",
    plural_en: "Speakers",
    plural_es: "Ponentes",
  },
  {
    id: TaxonomyType.VENUE,
    label_pt: "Local",
    label_en: "Venue",
    label_es: "Lugar",
    plural_pt: "Locais",
    plural_en: "Venues",
    plural_es: "Lugares",
  },
  {
    id: TaxonomyType.ROOM,
    label_pt: "Sala",
    label_en: "Room",
    label_es: "Sala",
    plural_pt: "Salas",
    plural_en: "Rooms",
    plural_es: "Salas",
  },
];

export function getTaxonomyTypeLabel(
  type: TaxonomyType,
  lang: string,
  plural: boolean = false
): string | null {
  const tax = TAXONOMY_TYPES.find((t) => t.id === type);
  if (!tax) return null;
  switch (lang) {
    case "pt":
      return plural ? tax.plural_pt : tax.label_pt;
    case "en":
      return plural ? tax.plural_en : tax.label_en;
    case "es":
      return plural ? tax.plural_es : tax.label_es;
    default:
      return null;
  }
}

export class Taxonomy {
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

  constructor(data: TaxonomySchema) {
    Object.assign(this, data);
  }

  static make(data: TaxonomySchema) {
    return new Taxonomy(data);
  }

  exists() {
    return !!this.id;
  }

  getLabel(lang: string) {
    switch (lang) {
      case "pt":
        return this.label_pt;
      case "es":
        return this.label_es || this.label;
      case "en":
        return this.label_en || this.label;
      default:
        return this.label;
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

  isActive() {
    return !!this.active;
  }
}
