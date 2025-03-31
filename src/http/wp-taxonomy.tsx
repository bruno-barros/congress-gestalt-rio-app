import { AxiosResponse } from "axios";
import { WpRestResponse } from "../types/restapi";
import { restApi, RESTVersion } from "./axios";
import { TaxonomySchema, TaxonomyType } from "../types/taxonomy.type";

export default class WpTaxonomy {
  static find(
    id: number
  ): Promise<AxiosResponse<WpRestResponse<TaxonomySchema>>> {
    return restApi.get(`${RESTVersion.default().namespace}/taxonomies/${id}`);
  }

  static list(args: {
    edition?: string;
    type?: TaxonomyType;
  }): Promise<AxiosResponse<WpRestResponse<TaxonomySchema[]>>> {
    const qs = [];
    if (args?.edition) qs.push(`edition=${args.edition}`);
    if (args?.type) qs.push(`type=${args.type}`);
    return restApi.get(
      `${RESTVersion.default().namespace}/taxonomies/?${qs.join("&")}`
    );
  }

  static create(args: {
    edition: string;
    type: TaxonomyType;
    label_pt: string;
    label_es?: string;
    label_en?: string;
    description_pt?: string;
    description_es?: string;
    description_en?: string;
    external_id?: number;
    img?: string;
    active?: 0 | 1;
  }): Promise<AxiosResponse<WpRestResponse<TaxonomySchema>>> {
    return restApi.post(`${RESTVersion.default().namespace}/taxonomies/`, args);
  }

  static update(
    id: number,
    args: {
        label_pt?: string;
        label_es?: string;
        label_en?: string;
        description_pt?: string;
        description_es?: string;
        description_en?: string;
        external_id?: number;
        img?: string;
        active?: 0 | 1;
    }
  ): Promise<AxiosResponse<WpRestResponse<TaxonomySchema>>> {
    return restApi.put(
      `${RESTVersion.default().namespace}/taxonomies/${id}`,
      args
    );
  }

  static delete(id: number): Promise<AxiosResponse<WpRestResponse<null>>> {
    return restApi.delete(
      `${RESTVersion.default().namespace}/taxonomies/${id}`
    );
  }
}
