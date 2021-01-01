import {Status} from "../../components/abstract/abstract.d";

export default class Event {
  name: string
  logo: { primary: string; secondary: string }
  url: { pt: string; en: string }
  app: { pt: string; en: string }
  editions: any[]
  abstracts: {
    statuses: any[]
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
  abstract: {
    required: boolean
    statuses: Status[]
    attachments: number
    topics: string[]
    start_at: string
    end_at: string
    required_fields: any[]
    authors: {
      max: number
    }
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


}
