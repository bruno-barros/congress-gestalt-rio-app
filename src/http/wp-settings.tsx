import { AxiosResponse } from "axios";
import { restApi } from "./axios";
import { WpRestResponse } from "../@types/restapi";

export class WpSettings
{
  static namespace = '/event/v1';

  static all(): Promise<AxiosResponse<WpRestResponse<any>>>{
    return restApi.get(`${WpSettings.namespace}/settings`);
  }

  static save(args: {
    group: string,
    fields: object,
    edition?: string,
  }): Promise<AxiosResponse<WpRestResponse<any>>>{
    return restApi.post(`${WpSettings.namespace}/settings`, args);
  }
}
