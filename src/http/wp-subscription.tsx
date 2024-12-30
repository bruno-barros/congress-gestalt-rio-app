import { AxiosResponse } from "axios";
import { restApi, RESTVersion } from "./axios";
import { WpRestResponse } from "../types/restapi";

export default class WpSubscription {

  static affirmativeActionRegister(args: {
    attachments: any[];
    userId: number;
  }): Promise<AxiosResponse<WpRestResponse<any>>> {
    return restApi.post(
      `${RESTVersion.default().namespace}/subscription/affirmative_action`,
      {
        attachments: args.attachments,
        user_id: args.userId,
      }
    );
  }
}
