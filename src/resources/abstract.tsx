import {statusColorName} from "../helpers";
import { AbstractStatusModelEnum, StatusType } from "../types/abstracts.d";
import { AttachmentSchema } from "../types/files";
import { Locale } from "../types/i18next";
import { STATUSES_SINOPSIS_ABSTRACT_MODEL } from "./abstract-statuses";
import Edition from "./edition";
import {Author} from "./user";

export default class Abstract {
  databaseId: number
  main_language: Locale
  title: string
  title_es: string
  subtitle: string
  topic: string
  type: string
  status: StatusType
  date: string
  edition_id?: string
  authors_count?: number
  evaluations_count?: number
  attachments_count?: number
  authorDatabaseId?: number

  excerpt?: string
  abstract_tags?: string[]
  abstract_tags_es?: string[]
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
  attachments?: AttachmentSchema[]
  professional_proof?: AttachmentSchema[]
  authors?: Author[]
  jlp?: boolean
  edition?: Edition

  constructor(data: any) {
    Object.assign(this, data)
  }

  static make(data: any) {
    return new Abstract(data)
  }

  setEdition(edition: Edition){
    this.edition = edition
  }
  getEdition(){ return this.edition }

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

  statusPassed(desiredStatus: StatusType){
    const desiredPosition: number = STATUSES_SINOPSIS_ABSTRACT_MODEL.indexOf(desiredStatus)
    const currentPosition: number = STATUSES_SINOPSIS_ABSTRACT_MODEL.indexOf(this.status)
    return currentPosition > desiredPosition
  }

  /**
   * Se o trabalho permite anexos
   */
  isAbleToAttach(){
    if(!!this.getEdition() === false) return false;
    const model = this.getEdition().Abstract().status_model
    if(model === AbstractStatusModelEnum.ABSTRACT){
      return true
    }
    // no modo completo com sinopse, é necessário aprovar a sinopse para anexar
    return this.statusPassed('synopsis_waiting_upd')
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

  getMainLanguage(){
    return this.main_language || 'pt'
  }
}
