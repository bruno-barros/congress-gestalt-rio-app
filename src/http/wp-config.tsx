import {AxiosResponse} from "axios";
import { httpApi, restApi, RESTVersion } from './axios';
import { WpRestResponse } from "../types/restapi";

export default class WpConfig {

  static load(): Promise<AxiosResponse<WpRestResponse<any>>> {
    return restApi.get(`${RESTVersion.default().namespace}/settings`);
  }

  static pushNotificationSend(data: any){
    return httpApi.post('/wp-admin/admin-ajax.php?action=ev_push_notification_send', {...data});
  }


  static pushNotificationApp(): Promise<AxiosResponse> {
    return httpApi.post('/index.php?graphql&pushNotificationApp', {
      query: `query pushNotificationApp {
   evPushNotification {
    app_id
    last_messages
    messageable_players
    name
    players
    rate_limit
  }
}`
    });
  }
}
