import {AxiosResponse} from "axios";
import {httpApi, restApi, RESTVersion} from "./axios";
import {Notification, NotificationTypes} from "../resources/notification";

export default class WpNotification {

  static setAsRead(notifications: Notification[]){
    return restApi.post(`${RESTVersion.default().namespace}/notifications/read`, {notifications});
  }

  static get(args: { context: NotificationTypes, recipient_id?: number, read?:boolean; limit?: number }): Promise<AxiosResponse> {

    let filters = []
    if(args?.recipient_id) filters.push(`recipient_id: ${args.recipient_id}`)
    if(args?.read) filters.push(`read: ${args.read}`)
    let where = filters.join(', ')
    let lmt = args?.limit || 50

    return httpApi.post('/index.php?graphql&notifications', {
      query: `query WpNotification {
  __typename
  evNotifications(where: {context: "${args.context}", ${where}}, first: ${lmt}) {
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
