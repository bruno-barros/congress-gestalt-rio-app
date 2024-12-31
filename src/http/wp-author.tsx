import { AxiosResponse } from "axios";
import { restApi, RESTVersion } from "./axios";
import { WpRestResponse } from "../types/restapi";
import { AuthorSchema, SearchAuthorSchema } from "../types/authors-panel";

export default class WpAuthor {
  static createUpdate(args: {
    id?: number;// se ausente, cria um novo autor
    wp_user_id: number;
    abstract_id: number;
    name: string;
    email: string;
    bio?: string;
    company?: string;
    is_speaker?: 0 | 1;
    url?: string;
    active?: 0 | 1;
  }): Promise<AxiosResponse<WpRestResponse<AuthorSchema>>> {
    return restApi.post(`${RESTVersion.default().namespace}/authors/`, args);
  }

  static update(id: number, data: any): Promise<AxiosResponse<WpRestResponse<AuthorSchema>>> {
    return restApi.put(
      `${RESTVersion.default().namespace}/authors/${id}`,
      data
    );
  }

  static delete(
    id: number | string
  ): Promise<AxiosResponse<WpRestResponse<string>>> {
    return restApi.delete(`${RESTVersion.default().namespace}/authors/${id}`);
  }

  static search(args: {
    search: string;
    field?: "email";
    abstractId?: number;
  }): Promise<AxiosResponse<WpRestResponse<SearchAuthorSchema[]>>> {
    const qs = [];
    qs.push(`${args?.field || "email"}=${args.search}`);
    if (args?.abstractId) qs.push(`abstract_id=${args.abstractId}`);
    return restApi.get(
      `${RESTVersion.default().namespace}/authors/search?${qs.join("&")}`
    );
  }

  
}
