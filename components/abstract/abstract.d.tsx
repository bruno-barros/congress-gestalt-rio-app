export type Status = 'pending' | 'revision' | 'synopsis_rejected' | 'synopsis_waiting_upd' |
  'synopsis_approved' | 'final_revision' | 'rejected' | 'waiting_update' | 'pre_approved' | 'approved';

export type GraphQlStatuses = 'PENDING' | 'REVISION' | 'SYNOPSIS_REJECTED' | 'SYNOPSIS_WAITING_UPD' |
  'SYNOPSIS_APPROVED' | 'FINAL_REVISION' | 'REJECTED' | 'WAITING_UPDATE' | 'PRE_APPROVED' | 'APPROVED';


export interface AbstractType {
  databaseId: number
  title: string
  subtitle: string
  topic: string
  status: Status
  date: string
  edition_id: string
  authors_count: number
  evaluations_count: number
  attachments_count: number
  authorDatabaseId: number
}

export class AbstractCollection {
  collection: AbstractType[]

  constructor(data: any) {
    this.collection = data;
  }

  static make(data: any) {
    return new AbstractCollection(data)
  }

  all() {
    return this.collection
  }

  count(){
    return this.collection?.length || 0
  }

  getNoRejected(){
    if(this.collection.length === 0) return  []
    return this.collection.filter(abstract => abstract.status.indexOf('rejected') === -1)
  }
}
