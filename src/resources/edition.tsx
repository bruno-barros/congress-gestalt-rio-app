import moment from "moment";
import { StringBoolean } from "../types/general";
import { AbstractStatusModelEnum, StatusType } from "../types/abstracts";
import { ItemLanguageWithId } from "../types/settings";
import { CRITERIAS, CriteriaSchema } from "../types/review.d";
import { User, UserInterface } from "./user";

//region Edition
export default class Edition {
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
    logo_sm: string;
    start_at: string;
    end_at: string;
    lgpd_url_pt: string;
    lgpd_url_en: string;
    lgpd_url_es: string;
    welcome_email_allowed: StringBoolean;
    welcome_email_content_pt: string;
    welcome_email_content_en: string;
    welcome_email_content_es: string;
  }; // edition
  subscription: {
    allowed: StringBoolean;
    start_at: string;
    end_at: string;
    category_id: number;
    plans_description_pt: string;
    plans_description_en: string;
    plans_description_es: string;
    produts_excluded_for_foreign: string[];
    // origem na configuração estática
    products_category: {
      id: number;
      slug: string;
    };
    products: {
      pt: ItemLanguageWithId[];
      en: ItemLanguageWithId[];
    };
    // steps after basic data (register1)
    steps: {
      plan: { pt: string; en: string };
      address: { pt: string; en: string };
      institution: { pt: string; en: string };
      payment: { pt: string; en: string };
    };
  }; // subscription
  abstract: {
    abstract_allowed: StringBoolean;
    only_subscribed: StringBoolean;
    test_mode: StringBoolean;
    rules: { pt: string; en: string };
    statuses: StatusType[];
    attachments: number;
    topics: ItemLanguageWithId[];
    modalities: ItemLanguageWithId[];
    start_at: string;
    end_at: string;
    count_method: "char" | "word";
    required_fields: // @deprecated atribute
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
  }; // abstract
  review: {
    evaluators_final_approvement: StringBoolean;
    days_to_evaluate: number;
    days_for_corrections: number;
    questions: ItemLanguageWithId[];
    evaluators_text_pt: string;
    evaluators_text_en: string;
    evaluators_text_es: string;
  }; // review
  certificate: any;
  activity: any;

  constructor(data: any, def: any) {
    Object.assign(this, data);
    this.defaults = def;
    // console.log({def})
    if (def?.id) this.id = def.id;
  }

  static make(data: any, defaults: any) {
    return new Edition(data, defaults);
  }

  //region Subscription factory
  Subscription(): Edition_Subscription {
    return Edition_Subscription.make(this.subscription);
  }

  //region Abstract factory
  Abstract(): Edition_Abstract {
    return Edition_Abstract.make(this.abstract);
  }

  Review(): Edition_Review {
    return new Edition_Review(this.review);
  }

  Activity(): Edition_Activity {
    return new Edition_Activity(this.activity);
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

  getReviewQuestions(): ItemLanguageWithId[] {
    return this.review?.questions || [];
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

//region Edition_Subscription
/**
 * Classe que representa a configuração de inscrição
 */
export class Edition_Subscription {
  allowed: StringBoolean;
  start_at: string;
  end_at: string;
  category_id: number;
  plans_description_pt: string;
  plans_description_en: string;
  plans_description_es: string;
  produts_excluded_for_foreign: string[];

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

//region Edition_Abstract
export class Edition_Abstract {
  abstract_allowed: StringBoolean;
  only_subscribed: StringBoolean;
  test_mode: StringBoolean;
  // rules: { pt: string; en: string };
  rules_pt: string;
  rules_en: string;
  rules_es: string;
  statuses: StatusType[];
  attachments: number;
  topics: { id: string; pt: string; en: string; es: string }[];
  modalities: { id: string; pt: string; en: string; es: string }[];
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
  fields: AField[];
  status_model: AbstractStatusModelEnum;
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

  constructor(data: any) {
    Object.assign(this, data);
  }

  static make(data: any) {
    return new Edition_Abstract(data);
  }

  getTopics() {
    return this.topics || [];
  }

  getModalities() {
    return this.modalities || [];
  }

  getField(key: string): Edition_Abstract_Field {
    return this.fields[key]
      ? Edition_Abstract_Field.make(this.fields[key])
      : Edition_Abstract_Field.make({ allowed: false, min: 0, max: 0 });
  }

  getRulesUrl(lang: string){
    return this[`rules_${lang}`] || "";
  }
}
//region Edition_Abstract_Field
class Edition_Abstract_Field {
  allowed: boolean;
  min: number;
  max: number;
  [key: string]: any;

  constructor(data: any) {
    Object.assign(this, data);
  }
  static make(data: any) {
    return new Edition_Abstract_Field(data);
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

interface AField {
  allowed: boolean;
  min: number;
  max: number;
  [key: string]: any;
}


//region Edition_Review
export class Edition_Review {
  evaluators_final_approvement: StringBoolean;
  notify_on_update: StringBoolean;
  days_to_evaluate: number;
  days_for_corrections: number;
  questions: ItemLanguageWithId[];
  evaluators_text_pt: string;
  evaluators_text_en: string;
  evaluators_text_es: string;

  criteria: {
    
  }


  constructor(data: any) {
    Object.assign(this, data);
  }

  getDaysToEvaluate() {
    return Number(this.days_to_evaluate || 0);
  }

  getCriterias(){
    return CRITERIAS
  }

  getCriteriasArray(): CriteriaSchema[]{
    return Object.keys(this.getCriterias()).map(key => {
      return { id: key, ...this.getCriterias()[key] }
    })
  }

  hasCriteria(id: string){
    const keys = Object.keys(this.getCriterias())
    return keys.includes(id)
  }

  getQuestions(){
    return this.questions || []
  }
}

//region Edition_Activity
export class Edition_Activity {
  activities_allowed: StringBoolean;
  test_mode: StringBoolean;
  start_at: string;
  end_at: string;
  limit_per_participant: number;

  constructor(data: any) {
    Object.assign(this, data);
  }

  isTestMode(){
    return this.test_mode === '1'
  }
  
 /**
  * 
   * Está aberto para inscrição em atividades.
   * Se passar o usuário, valida mode de teste
   * @param user 
   * @returns boolean
   */
  isOpenToApply(user?: User) {
    if(user && this.isTestMode() && this.activities_allowed !== '1'){
      return user.isAdmin() || user.isSupervisor() || user.isEvaluator();
    }
    if (this.activities_allowed !== '1') {
      return false;
    }
    const today = moment();
    const start = this?.start_at
      ? moment(this.start_at)
      : null;
    const end = this?.end_at
      ? moment(this.end_at)
      : null;
    // console.log({ after: today.isSameOrAfter(start), before: today.isSameOrBefore(end) });
    if (!start || !end) return false;
    if (today.isSameOrAfter(start) && today.isSameOrBefore(end)) return true;
    return false;
  }
}