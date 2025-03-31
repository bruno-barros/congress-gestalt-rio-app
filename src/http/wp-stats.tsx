import { AxiosResponse } from "axios";
import { restApi, RESTVersion } from "./axios";
import { WpRestResponse } from "../types/restapi";
import { EditionsResponse } from "../types/settings";
import { StatsSchema } from "../types/stats.types";

export class WpStats {

  static refresh(args: {
    edition: string;
  }): Promise<AxiosResponse<WpRestResponse<null>>> {
    const params = [];
    params.push(`edition=${args.edition}`);
    return restApi.post(`${RESTVersion.default().namespace}/stats?${params.join("&")}`);
  }

  static list(args: {edition: string}): Promise<AxiosResponse<WpRestResponse<StatsSchema[]>>> {
    const params = [];
    params.push(`edition=${args.edition}`);
    return restApi.get(`${RESTVersion.default().namespace}/stats?${params.join("&")}`);
  }

 
}
