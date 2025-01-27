import { average } from "../helpers";
import { StatusType } from "../types/abstracts";
import Abstract from "./abstract";
import { STATUSES_SINOPSIS_ABSTRACT_MODEL } from "./abstract-statuses";
import { Order } from './order';

export class Evaluation {
  id: number | string
  databaseId: number
  abstract_id: number
  user_id: number
  answers: any
  comment: string
  edition_id: string
  created_at: string
  updated_at: string
  relevance: number
  quality: number
  clarity: number
  contributions: number
  bibliography: number
  research: number
  methodology: number
  status: StatusType
  is_public: boolean
  evaluator?: {
    databaseId: number
    email: string
    firstName: string
    name: string
  }
  abstract: {
    databaseId: number
    authorDatabaseId: number
    date: string
    excerpt: string
    abstract_tags: string[]
    bibliography: string
    subtitle: string
    status: StatusType
    synopsis: string
    title: string
    topic: string
    content: string
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
    }
  }

  constructor(data: any) {
    Object.assign(this, data)
  }

  static make(data: any) {
    return new Evaluation(data)
  }

  getAbstract(): Abstract{
    return Abstract.make(this.abstract)
  }

  getAnswers(){
    return this.answers && JSON.parse(this.answers) || null
  }

  getAverage(){
    const values = []
    if(this.relevance >= 0) values.push(this.relevance)
    if(this.quality >= 0) values.push(this.quality)
    if(this.clarity >= 0) values.push(this.clarity)
    if(this.contributions >= 0) values.push(this.contributions)
    if(this.bibliography >= 0) values.push(this.bibliography)
    if(this.research >= 0) values.push(this.research)
    if(this.methodology >= 0) values.push(this.methodology)

    return average(values, 1)
  }

  isEditable(){
    return ['synopsis_evaluating', 'evaluating'].indexOf(this.status) !== -1
  }

  statusPassed(desiredStatus: StatusType){
    const desiredPosition: number = STATUSES_SINOPSIS_ABSTRACT_MODEL.indexOf(desiredStatus)
    const currentPosition: number = STATUSES_SINOPSIS_ABSTRACT_MODEL.indexOf(this.status)
    return currentPosition > desiredPosition
  }

}
