import {Status, Statuses} from "../../components/abstract/abstract.d";
import Abstract from "./abstract";

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
  status: Status
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
    status: Status
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

  isEditable(){
    // 'pending' | 'revision' | 'synopsis_rejected' | 'synopsis_waiting_upd' |
    // 'synopsis_approved' | 'final_revision' | 'rejected' | 'waiting_update' | 'pre_approved' | 'approved';
    return ['revision', 'final_revision'].indexOf(this.status) !== -1
  }

  statusPassed(desiredStatus: string){
    const desiredPosition: number = Statuses.indexOf(desiredStatus)
    const currentPosition: number = Statuses.indexOf(this.status)
    return currentPosition > desiredPosition
  }

}
