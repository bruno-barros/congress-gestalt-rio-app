import {Status, Statuses} from "../../components/abstract/abstract.d";
import {statusColorName} from "../helpers";
import {Author} from "./user";

export default class Abstract {
  databaseId: number
  title: string
  subtitle: string
  topic: string
  status: Status
  date: string
  edition_id?: string
  authors_count?: number
  evaluations_count?: number
  attachments_count?: number
  authorDatabaseId?: number

  excerpt?: string
  abstract_tags?: string[]
  bibliography?: string
  synopsis?: string
  content?: string
  consents?: string
  author?: {
    node: {
      avatar: {
        url?: string
      }
      databaseId: number
      email: string
      firstName: string
      locale: string
      name: string
    }
  }
  attachments?: {
    abstract_id: number
    context: string
    created_at: string
    id: number
    name: string
    mimetype: string
    note: string
    size: number
    url: string
    user_id: number
  }[]
  authors?: Author[]
  jlp?: boolean

  constructor(data: any) {
    Object.assign(this, data)
  }

  static make(data: any) {
    return new Abstract(data)
  }

  statusColorName(): 'warning' | 'success' | 'danger' | 'secondary'|'info' {
    return  statusColorName(this.status)
  }

  isLockedToEdition() {
    if (['synopsis_revision', 'synopsis_evaluating', 'synopsis_rejected',
       'final_revision', 'evaluating', 'rejected', 'pre_approved', 'approved'].indexOf(this.status) !== -1) {
      return true
    }

    return false
  }

  statusPassed(desiredStatus: string){
    const desiredPosition: number = Statuses.indexOf(desiredStatus)
    const currentPosition: number = Statuses.indexOf(this.status)
    return currentPosition > desiredPosition
  }

  getResponsible(){
    return this.author?.node
  }

  hasConsents(){
    return this.consents ? true : false
  }

  getConsents(){
    return this.consents ? JSON.parse(this.consents) : {}
  }

  hasConsentsAgreement(){
    if(Object.keys(this.getConsents()).length === 0){
      return true;
    }
    const consents = this.getConsents();
    return Object.keys(consents).filter(k => {
      return consents[k] === false
    }).length === 0
  }

}
