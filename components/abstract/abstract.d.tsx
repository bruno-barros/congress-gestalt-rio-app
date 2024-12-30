import { StatusType } from "../../src/types/abstracts";
/**
 * Mover de "components/abstract/abstract.d.tsx" estes tipos para: "src/types/abstracts.d.ts"
 */
export type GraphQlStatuses = 'PENDING' | 'SYNOPSIS_REVISION' | 'SYNOPSIS_EVALUATING' | 'SYNOPSIS_REJECTED' | 'SYNOPSIS_WAITING_UPD' |  'SYNOPSIS_APPROVED' | 'FINAL_REVISION' | 'EVALUATING' | 'REJECTED' | 'WAITING_UPDATE' | 'PRE_APPROVED' | 'APPROVED';

export function StatusesPhaseSynopsis():GraphQlStatuses[]{
  return ['PENDING', 'SYNOPSIS_REVISION', 'SYNOPSIS_EVALUATING', 'SYNOPSIS_REJECTED', 'SYNOPSIS_WAITING_UPD']
}
export function StatusesPhaseAbstract():GraphQlStatuses[]{
  return ['SYNOPSIS_APPROVED', 'FINAL_REVISION', 'EVALUATING', 'REJECTED', 'WAITING_UPDATE', 'PRE_APPROVED', 'APPROVED']
}

export interface AbstractType {
  databaseId: number
  title: string
  subtitle: string
  topic: string
  status: StatusType
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
