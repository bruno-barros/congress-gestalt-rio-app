export type NotificationTypes = 'admin' | 'evaluator' | 'author'

export interface Notification {
  id: number|string
  context: NotificationTypes
  note: string
  read_at: string|null
  created_at: string
}
