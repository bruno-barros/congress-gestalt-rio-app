import { AxiosResponse } from "axios";
import { httpApi, restApi } from "./axios";
import { WpRestResponse } from "../types/restapi";
import { DocumentSchema } from "../types/document";

export default class WpDocument {
  static namespace = "/event/v1";

  static listFromUser(args: { userId: number }): Promise<AxiosResponse<WpRestResponse<DocumentSchema[]>>> {
    return restApi.get(`${this.namespace}/documents/${args.userId}` );
  }

  static delete(id: number): Promise<AxiosResponse<WpRestResponse<any>>> {
    return restApi.delete(`${this.namespace}/documents/${id}`)
    // return httpApi.post("/wp-admin/admin-ajax.php?action=ev_document_delete", {
    //   ...data,
    // });
  }
}
