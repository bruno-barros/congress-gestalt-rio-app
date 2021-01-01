import {AbstractType, Status} from "../../components/abstract/abstract.d";

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
  abstract_tags?: string
  bibliography?: string
  synopsis?: string
  content?: string
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
  authors?: {
    id: number
    name: string
    email: string
    active: number
    bio: string
    is_speaker: number
    order: number
  }[]

  constructor(data: any) {
    Object.assign(this, data)
  }

  static make(data: any) {
    return new Abstract(data)
  }

  statusColorName(): 'warning' | 'success' | 'danger' {
    if (['pending', 'revision', 'waiting_update', 'synopsis_waiting_update', 'final_revision'].indexOf(this.status) !== -1) return 'warning'
    if (['synopsis_approved', 'pre_approved', 'approved'].indexOf(this.status) !== -1) return 'success'
    if (['synopsis_rejected', 'rejected'].indexOf(this.status) !== -1) return 'danger'
  }

  isLockedToEdition() {
    if (['revision', 'final_revision', 'pre_approved', 'approved', 'synopsis_rejected', 'rejected'].indexOf(this.status) !== -1) {
      return true
    }

    return false
  }
}
