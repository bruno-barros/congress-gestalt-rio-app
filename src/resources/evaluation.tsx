import {Status} from "../../components/abstract/abstract.d";
import Abstract from "./abstract";

export class Evaluation {
  id: number | string
  databaseId: number
  abstract_id: number
  user_id: number
  answers: any
  comment: string
  created_at: string
  relevance: 'poor' | 'good' | 'excellent'
  quality: 'poor' | 'good' | 'excellent'
  status: Status
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
    // 'pending' | 'revision' | 'synopsis_rejected' | 'synopsis_waiting_update' |
    // 'synopsis_approved' | 'final_revision' | 'rejected' | 'waiting_update' | 'pre_approved' | 'approved';
    return ['revision', 'final_revision'].indexOf(this.status) !== -1
  }

}
