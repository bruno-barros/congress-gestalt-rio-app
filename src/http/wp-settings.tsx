import { AxiosResponse } from "axios";
import { restApi, RESTVersion } from "./axios";
import { WpRestResponse } from "../types/restapi";
import { EditionsResponse } from "../types/settings";

export class WpSettings {

  static all(args?: {
    edition: string;
  }): Promise<AxiosResponse<WpRestResponse<any>>> {
    const params = [];
    if (args?.edition) params.push(`edition=${args.edition}`);
    return restApi.get(`${RESTVersion.default().namespace}/settings?${params.join("&")}`);
  }

  static editions(): Promise<AxiosResponse<WpRestResponse<EditionsResponse>>> {
    return restApi.get(`${RESTVersion.default().namespace}/editions`);
  }

  static save(args: {
    group: string;
    fields: object;
    edition?: string;
  }): Promise<AxiosResponse<WpRestResponse<any>>> {
    return restApi.post(`${RESTVersion.default().namespace}/settings`, args);
  }
}
