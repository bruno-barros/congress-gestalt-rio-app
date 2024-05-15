import { Status } from "../../components/abstract/abstract.d";
import moment from "moment";

export default class Event {
  name: string;
  logo: { primary: string; secondary: string };
  url: { pt: string; en: string };
  app: { pt: string; en: string };
  languages: string[];
  description?: string;
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
  editions: any[];
  abstract: {
    statuses: any[];
    limit_per_user: number;
    attachments: number;
    attachments_max_size: number;
  };

  constructor(data: any) {
    Object.assign(this, data);
  }

  static make(data: any) {
    return new Event(data);
  }

  get eventName() {
    return this.name;
  }

  get logoPrimary() {
    return this.logo?.primary;
  }

  get logoSecondary() {
    return this.logo?.secondary;
  }

  getEdition(editionId: string) {
    return this.getEditions().find((edition) => edition.id === editionId);
  }

  getEditions() {
    let keys = Object.keys(this.editions);
    return keys.map((k) =>
      Edition.make(this.editions[k], {
        url: this.url,
        logo: this.logo,
      })
    );
  }

  currentEdition(): Edition {
    return this.getEditions()[0];
  }

  buildUrlCheckout(cart, token) {
    let url = this.page.checkout[cart.locale || "pt"];
    url = url.replace("[PRODUCT_ID]", cart.product);
    return url + `&lang=${cart.locale}&sso=${token}`;
  }
}

export class Edition {
  defaults: any;
  locale: string = "pt";
  id: string;
  name: string;
  start_at: string;
  end_at: string;
  logo: { primary: string; secondary: string };
  url: { pt: string; en: string };
  app: { pt: string; en: string };
  subscription: {
    allowed: boolean;
    start_at: string;
    end_at: string;
    products_category: {
      id: number;
      slug: string;
    };
    products: {
      pt: { id: number; name: string; price: number; desc: string }[];
      en: { id: number; name: string; price: number; desc: string }[];
    };
    // steps after basic data (register1)
    steps: {
      plan: { pt: string; en: string };
      address: { pt: string; en: string };
      institution: { pt: string; en: string };
      payment: { pt: string; en: string };
    };
  };
  abstract: {
    allowed: boolean;
    rules: { pt: string; en: string };
    statuses: Status[];
    attachments: number;
    topics: { id: string; pt: string; en: string }[];
    types: { id: string; pt: string; en: string }[];
    start_at: string;
    end_at: string;
    count_method: "char" | "word";
    required_fields:
      | {
          topic?: boolean;
          type?: boolean;
          title?: boolean;
          subtitle?: boolean;
          tags?: boolean | { min: number; max: number };
          resume?: boolean | { min: number; max: number };
          content?: boolean | { min: number; max: number };
          bibliography?: boolean | { min: number; max: number };
          attachments?: boolean | { min: number; max: number };
          authors?: boolean | { min: number; max: number };
        }
      | any;
    limit_per_user: number;
    authors: {
      max: number;
    };
    tags: {
      min: number;
      max: number;
    };
    consent?: Consent;
    per_abstract_consent?: Consent;
  };
  review: {
    questions?: object;
  };

  constructor(data: any, def: any) {
    Object.assign(this, data);
    this.defaults = def;
  }

  static make(data: any, defaults: any) {
    return new Edition(data, defaults);
  }

  setLocale(locale) {
    this.locale = locale;
  }

  get year() {
    return this.start_at.substr(0, 4);
  }

  get logoPrimary() {
    return this.logo.primary || this.defaults.logo?.primary;
  }

  get logoSecondary() {
    return this.logo.secondary || this.defaults.logo?.secondary;
  }

  steps() {
    return this.subscription.steps;
  }

  stepsArr() {
    return Object.keys(this.subscription.steps).map((step) => {
      return { ...this.subscription.steps[step], id: step };
    });
  }

  isOpenToSubscribe() {
    const today = moment();
    if (this.subscription.allowed === false) {
      return false;
    }
    const start = this.subscription.start_at
      ? moment(this.subscription.start_at)
      : null;
    const end = this.subscription.end_at
      ? moment(this.subscription.end_at)
      : null;
    if (!start || !end) return false;
    if (today >= start && today <= end) return true;
    return false;
  }

  isOpenToAbstracts(){
    // correção emergencial. No iPhone o calculo de datas não está correto.
    return this.abstract.allowed;
    const today = moment();
    if (this.abstract.allowed === false) {
      return false;
    }
    const start = this.abstract.start_at
      ? moment(this.abstract.start_at)
      : null;
    const end = this.abstract.end_at
      ? moment(this.abstract.end_at)
      : null;
    if (!start || !end) return false;
    if (today >= start && today <= end) return true;
    return false;
  }

  getProducts(lang) {
    return this.subscription.products[lang] || [];
  }

  getReviewQuestions(): object {
    return this.review?.questions || null;
  }

  getFieldMin(
    field:
      | "subtitle"
      | "tags"
      | "resume"
      | "content"
      | "bibliography"
      | "authors"
      | "attachments"
  ) {
    /**
     * TODO
     * Implementar regras customizadas baseadas no tipo de modalidade 'type'
     */
    return this.abstract.required_fields[field].hasOwnProperty("min")
      ? this.abstract.required_fields[field].min
      : undefined;
  }
  getFieldMax(
    field:
      | "subtitle"
      | "tags"
      | "resume"
      | "content"
      | "bibliography"
      | "authors"
      | "attachments"
  ) {
    return this.abstract.required_fields[field].hasOwnProperty("max")
      ? this.abstract.required_fields[field]?.max
      : undefined;
  }

  hasConsent() {
    return !!this.abstract.consent;
  }

  consentText(lang: string = "pt") {
    return (this.abstract.consent && this.abstract.consent?.text[lang]) || "";
  }

  consentTerms(
    lang: string = "pt"
  ): { id: string; label: string; required: boolean }[] {
    if (!this.abstract.consent) return;
    return this.abstract.consent?.consents.map((c) => {
      return { id: c.id, label: c[lang], required: c.required };
    });
  }

  hasAbstractConsent() {
    return !!this.abstract.per_abstract_consent;
  }

  abstractConsentText(lang: string = "pt") {
    return (this.abstract.per_abstract_consent && this.abstract.per_abstract_consent?.text[lang]) || "";
  }

  abstractConsentTerms(
    lang: string = "pt"
  ): { id: string; label: string; required: boolean }[] {
    if (!this.abstract.per_abstract_consent) return;
    return this.abstract.per_abstract_consent?.consents.map((c) => {
      return { id: c.id, label: c[lang], required: c.required };
    });
  }
}

interface Consent {
  text: { pt: string; en: string };
  consents: {
    id: string;
    pt: string;
    en: string;
    required: boolean;
  }[];
}
