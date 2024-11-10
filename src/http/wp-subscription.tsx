import { AxiosResponse } from "axios";
import { restApi } from "./axios";
import { WpRestResponse } from "../types/restapi";

export default class WpSubscription {
  static namespace = "/event/v1";

  static affirmativeActionRegister(args: {
    attachments: any[];
    userId: number;
  }): Promise<AxiosResponse<WpRestResponse<any>>> {
    return restApi.post(
      `${WpSubscription.namespace}/subscription/affirmative_action`,
      {
        attachments: args.attachments,
        user_id: args.userId,
      }
    );
  }
}
