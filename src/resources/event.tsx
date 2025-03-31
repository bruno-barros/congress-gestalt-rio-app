import { StringBoolean } from "../types/general";
import { KeyValueItem } from "../types/abstracts";
import Edition from "./edition";
import { ItemLanguageWithId } from "../types/settings";

export default class Event {
  name: string;
  logo: { primary: string; secondary: string };
  url: { pt: string; en: string };
  app: { pt: string; en: string };
  description?: string;
  global: {
    languages: string[];
    name: string;
    description_pt: string;
    description_en: string;
    description_es: string;
    phone: string;
    phone_country: "55";
    email_general: string;
    email_financial: string;
    email_abstracts: string;
    editions: string[];
    rate_send_now: number | string;
    rate_limit_per_minute: number | string;
    notification_sender_name: string;
    notification_sender_email: string;
    notification_copy: string;
    page: {
      checkout: {
        pt: string; // url=[PRODUCT_ID]
        en: string;
      };
      lgpd: {
        pt: string;
        en: string;
      };
    };
  };// global
  page: {
    checkout: {
      pt: string; // url=[PRODUCT_ID]
      en: string;
    };
    lgpd: {
      pt: string;
      en: string;
    };
  };
  edition: {
    id: string;
    name: string;
    logo: string;
    logo_sm: string;
    start_at: string;
    end_at: string;
    lgpd_url_pt: string;
    lgpd_url_en: string;
    lgpd_url_es: string;
    welcome_email_allowed: StringBoolean;
    welcome_email_content_pt: string;
    welcome_email_content_en: string;
    welcome_email_content_es: string
  };// edition
  abstract: {
    abstract_allowed: StringBoolean;
    only_subscribed: StringBoolean;
    test_mode: StringBoolean;
    status_model: "sinopse_abstract" | "abstract";
    statuses: any[];
    limit_per_user: number;
    attachments: number;
    attachments_max_size: number;
    start_at: string;
    end_at: string;
    required_fields: any;
    fields: any;
    topics: KeyValueItem[];
    modalities: KeyValueItem[];
    rules_pt: string;
    rules_en: string;
    rules_es: string;
  };// abstract
  subscription?: {
    allowed: StringBoolean;
    start_at: string;
    end_at: string;
    category_id: number | string;
    plans_description_pt: string;
    plans_description_en: string;
    plans_description_es: string;
    produts_excluded_for_foreign: string[];
  };// subscription
  review?: {
    evaluators_final_approvement: StringBoolean;
    days_to_evaluate: number;
    days_for_corrections: number;
    questions: ItemLanguageWithId[];
    evaluators_text_pt: string;
    evaluators_text_en: string;
    evaluators_text_es: string;
  };// review
  certificate?: any;
  activity?: any;

  constructor(data: any) {
    Object.assign(this, data);
  }

  static make(data: any) {
    return new Event(data);
  }

  debug() {
    return this.global?.name;
  }
  get eventName() {
    return this.global?.name || this.name;
  }

  get logoPrimary() {
    return this.edition?.logo;
  }

  /**
   * Logo reduzida
   */
  get logoSecondary() {
    return this.edition?.logo_sm || this.edition?.logo;
  }

  getEdition(editionId: string) {
    return this.getEditions().find((edition) => edition.getId() === editionId);
  }

  getEditions() {
    let keys = this.getEditionsKeys();
    // debugger;
    return keys.map((k) => {
      // debugger;
      if (typeof this.global.editions[k] === "undefined") return null;
      return Edition.make(this.global.editions[k], {
        id: k,
        url: this.url,
        logo: this.logo,
      });
    });
  }

  getEditionsKeys(): string[] {
    return this.global?.editions || [];
  }

  currentEdition(): Edition {
    // console.log(this.global, this.abstract);
    const data = {
      ...this.global,
      edition: this.edition,
      abstract: this.abstract,
      subscription: this.subscription,
      review: this.review,
      certificate: this.certificate,
      activity: this.activity,
    };
    return Edition.make(data, {});
  }

  buildUrlCheckout(cart, token) {
    let url = this.global.page.checkout[cart.locale || "pt"];
    url = url.replace("[PRODUCT_ID]", cart.product);
    return url + `&lang=${cart.locale}&sso=${token}`;
  }

  getLanguages(){
    return this.global.languages || [];
  }
}