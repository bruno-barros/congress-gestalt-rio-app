import { Status } from "../../components/abstract/abstract.d";
import moment from "moment";
import { StringBoolean } from "../types/general";

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
  };
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
    start_at: string;
    end_at: string;
    lgpd_url_pt: string;
    lgpd_url_en: string;
    lgpd_url_es: string;
  };
  abstract: {
    abstract_allowed: StringBoolean;
    only_subscribed: StringBoolean;
    status_model: "sinopse_abstract" | "abstract";
    statuses: any[];
    limit_per_user: number;
    attachments: number;
    attachments_max_size: number;
    start_at: string;
    end_at: string;
    required_fields: any;
    fields: any;
    topics: any[];
  };
  subscription?: {
    allowed: StringBoolean;
    start_at: string;
    end_at: string;
    category_id: number | string;
    plans_description_pt: string;
    plans_description_en: string;
    plans_description_es: string;
  };
  review?: any;

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
   * @deprecated
   */
  get logoSecondary() {
    return this.edition?.logo;
  }

  getEdition(editionId: string) {
    return this.getEditions().find((edition) => edition.id === editionId);
  }

  getEditions() {
    let keys = this.getEditionsKeys();
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

export class Edition {
  defaults: any;
  locale: string = "pt";
  name: string;
  start_at: string;
  end_at: string;
  logo: { primary: string; secondary: string };
  url: { pt: string; en: string };
  app: { pt: string; en: string };
  // -----daqui para cima será removido
  id: string;
  edition: {
    // nova api
    id: string;
    name: string;
    logo: string;
    start_at: string;
    end_at: string;
    lgpd_url_pt: string;
    lgpd_url_en: string;
    lgpd_url_es: string;
  };
  subscription: {
    allowed: StringBoolean;
    start_at: string;
    end_at: string;
    category_id: number;
    plans_description_pt: string;
    plans_description_en: string;
    plans_description_es: string;
    // origem na configuração estática
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
    abstract_allowed: StringBoolean;
    only_subscribed: StringBoolean;
    rules: { pt: string; en: string };
    statuses: Status[];
    attachments: number;
    topics: { id: string; pt: string; en: string; es: string }[];
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
    fields: any;
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
    assessment?: {
      quantitative: boolean;
      qualitative: boolean;
    };
    questions?: object;
  };

  constructor(data: any, def: any) {
    Object.assign(this, data);
    this.defaults = def;
    // console.log({def})
    if (def?.id) this.id = def.id;
  }

  static make(data: any, defaults: any) {
    return new Edition(data, defaults);
  }

  Subscription() {
    return Edition_Subscription.make(this.subscription);
  }

  getId() {
    return this.edition?.id || this.id;
  }

  setLocale(locale) {
    this.locale = locale;
  }

  get year() {
    return this.edition?.start_at?.substr(0, 4);
  }

  get logoPrimary() {
    return this.logo?.primary || this.defaults?.logo?.primary;
  }

  get logoSecondary() {
    return this.logo?.secondary || this.defaults?.logo?.secondary;
  }

  isSubscriptionAllowed() {
    return this.subscription?.allowed === "1";
  }

  isAbstractAllowed() {
    return this.abstract?.abstract_allowed === "1";
  }

  getName() {
    return this.edition?.name || "desconhecido";
  }

  getLogo() {
    return this.edition?.logo || "";
  }

  getStartDate(): moment.Moment | null {
    return this.edition?.start_at ? moment(this.edition.start_at) : null;
  }

  getEndDate(): moment.Moment | null {
    return this.edition?.end_at ? moment(this.edition.end_at) : null;
  }

  getLgpdUrl(lang: string = "pt") {
    return this.edition[`lgpd_url_${lang}`] || "";
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
    if (!this.isSubscriptionAllowed()) {
      return false;
    }
    const start = this.subscription?.start_at
      ? moment(this.subscription.start_at)
      : null;
    const end = this.subscription?.end_at
      ? moment(this.subscription.end_at)
      : null;
    // console.log({ after: today.isSameOrAfter(start), before: today.isSameOrBefore(end) });
    if (!start || !end) return false;
    if (today.isSameOrAfter(start) && today.isSameOrBefore(end)) return true;
    return false;
  }

  isOpenToAbstracts() {
    // correção emergencial. No iPhone o calculo de datas não está correto.
    // return this.abstract.allowed;
    const today = moment();
    if (!this.isAbstractAllowed()) {
      return false;
    }
    const start = this.abstract?.start_at
      ? moment(this.abstract.start_at)
      : null;
    const end = this.abstract?.end_at ? moment(this.abstract.end_at) : null;
    if (!start || !end) return false;
    if (today.isSameOrAfter(start) && today.isSameOrBefore(end)) return true;
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
    return !!this.abstract?.consent;
  }

  consentText(lang: string = "pt") {
    return (this.abstract?.consent && this.abstract?.consent?.text[lang]) || "";
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
    return (
      (this.abstract.per_abstract_consent &&
        this.abstract.per_abstract_consent?.text[lang]) ||
      ""
    );
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

class Edition_Subscription {
  allowed: StringBoolean;
  start_at: string;
  end_at: string;
  category_id: number;
  plans_description_pt: string;
  plans_description_en: string;
  plans_description_es: string;

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

  constructor(data: any) {
    Object.assign(this, data);
  }

  static make(data: any) {
    return new Edition_Subscription(data);
  }

  isAllowed() {
    return this.allowed === "1";
  }

  getCategoryId() {
    return Number(this.category_id || 0);
  }

  getPlansDescription(lang: string = "pt") {
    return this[`plans_description_${lang}`] || "";
  }
}
