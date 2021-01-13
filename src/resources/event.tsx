import {Status} from "../../components/abstract/abstract.d";
import moment from "moment";

export default class Event {
  name: string
  logo: { primary: string; secondary: string }
  url: { pt: string; en: string }
  app: { pt: string; en: string }
  page: {
    checkout: {
      pt: string, // url=[PRODUCT_ID]
      en: string,
    },
  }
  editions: any[]
  abstract: {
    statuses: any[]
    limit_per_user: number
    attachments: number
    attachments_max_size: number
  }

  constructor(data: any) {
    Object.assign(this, data)
  }

  static make(data: any) {
    return new Event(data)
  }

  get eventName() {
    return this.name
  }

  get logoPrimary() {
    return this.logo?.primary
  }

  get logoSecondary() {
    return this.logo?.secondary
  }

  getEdition(editionId: string) {
    return this.getEditions().find(edition => edition.id === editionId)
  }

  getEditions() {
    let keys = Object.keys(this.editions);
    return keys.map(k => Edition.make(this.editions[k], {
      url: this.url,
      logo: this.logo,
    }))
  }

  currentEdition(): Edition {
    return this.getEditions()[0]
  }


  buildUrlCheckout(cart, token) {
    let url = this.page.checkout[cart.locale || 'pt']
    url = url.replace('[PRODUCT_ID]', cart.product)
    return url + `&lang=${cart.locale}&sso=${token}`
  }
}


export class Edition {
  defaults: any
  locale: string = 'pt'
  id: string
  name: string
  start_at: string
  end_at: string
  logo: { primary: string; secondary: string }
  url: { pt: string; en: string }
  app: { pt: string; en: string }
  subscription: {
    allowed: boolean
    start_at: string
    end_at: string
    products_category: {
      id: number
      slug: string
    }
    products: {
      pt: { id: number, name: string, price: number, desc: string }[]
      en: { id: number, name: string, price: number, desc: string }[]
    },
    // steps after basic data (register1)
    steps: {
      plan: { pt: string; en: string }
      address: { pt: string; en: string }
      institution: { pt: string; en: string }
      payment: { pt: string; en: string }
    }
  }
  abstract: {
    allowed: boolean
    statuses: Status[]
    attachments: number
    topics: { id: string; pt: string; en: string }[]
    start_at: string
    end_at: string
    required_fields: any[]
    limit_per_user: number
    authors: {
      max: number
    },
    tags: {
      min: number
      max: number
    }
  }
  review: {
    questions?: any[]
  }


  constructor(data: any, def: any) {
    Object.assign(this, data)
    this.defaults = def
  }

  static make(data: any, defaults: any) {
    return new Edition(data, defaults)
  }

  setLocale(locale) {
    this.locale = locale
  }

  get year() {
    return this.start_at.substr(0, 4)
  }

  get logoPrimary() {
    return this.logo.primary || this.defaults.logo.primary
  }

  get logoSecondary() {
    return this.logo.secondary || this.defaults.logo.secondary
  }

  steps() {
    return this.subscription.steps
  }

  stepsArr() {
    return Object.keys(this.subscription.steps).map(step => {
      return {...this.subscription.steps[step], id: step}
    })
  }

  isOpenToSubscribe() {
    const today = moment()
    const start = this.subscription.start_at ? moment(this.subscription.start_at) : null
    const end = this.subscription.end_at ? moment(this.subscription.end_at) : null
    if (!start || !end) return false
    if (today >= start && today <= end) return true
    return false
  }

  getProducts(lang) {
    return this.subscription.products[lang] || []
  }

  getReviewQuestions() {
    return this.review.questions || null
  }

}
