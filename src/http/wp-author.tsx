import { AxiosResponse } from "axios";
import { restApi, RESTVersion } from "./axios";
import { WpRestResponse } from "../types/restapi";

export default class WpAuthor {

  static update(id: number, data: any): Promise<AxiosResponse> {
    return restApi.put(`${RESTVersion.default().namespace}/authors/${id}`, data);
  }

  static delete(
    id: number | string
  ): Promise<AxiosResponse<WpRestResponse<string>>> {
    return restApi.delete(`${RESTVersion.default().namespace}/authors/${id}`);
  }
}
