import {AxiosResponse} from "axios";
import {httpApi} from "./axios";
import {Notification, NotificationTypes} from "../resources/notification";

export default class WpNotification {

  static setAsRead(notifications: Notification[]){
    return httpApi.post('/wp-admin/admin-ajax.php?action=ev_notification_read', {notifications});
  }

  static get(args: { context: NotificationTypes, recipient_id?: number, read?:boolean }): Promise<AxiosResponse> {

    let filters = []
    if(args?.recipient_id) filters.push(`recipient_id: ${args.recipient_id}`)
    if(args?.read) filters.push(`read: ${args.read}`)
    let where = filters.join(', ')


    return httpApi.post('/index.php?graphql&notifications', {
      query: `query WpNotification {
  __typename
  evNotifications(where: {context: "${args.context}", ${where}}) {
    nodes {
      id
      context
      note
      read_at
      created_at
    }
  }
}
`});
  }
}
