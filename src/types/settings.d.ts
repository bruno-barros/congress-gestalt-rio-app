export interface EditionsResponse {
  editions_keys: string[];
  global: object;
  editions: {[key: string]: object};
        // edition_key: {options...}
}

export interface ItemLanguageWithId {
  id: string;
  pt: string;
  en: string;
  es: string;
}