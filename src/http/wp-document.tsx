import { AxiosResponse } from "axios";
import { httpApi, restApi, RESTVersion } from "./axios";
import { WpRestResponse } from "../types/restapi";
import { DocumentSchema } from "../types/document";

export default class WpDocument {

  static listFromUser(args: { userId: number }): Promise<AxiosResponse<WpRestResponse<DocumentSchema[]>>> {
    return restApi.get(`${RESTVersion.default().namespace}/documents/${args.userId}` );
  }

  static delete(id: number): Promise<AxiosResponse<WpRestResponse<any>>> {
    return restApi.delete(`${RESTVersion.default().namespace}/documents/${id}`)
    // return httpApi.post("/wp-admin/admin-ajax.php?action=ev_document_delete", {
    //   ...data,
    // });
  }
}
