import { AxiosResponse } from "axios";
import { httpApi, restApi } from "./axios";
import { WpRestResponse } from "../types/restapi";
import { DocumentSchema } from "../types/document";

export default class WpDocument {
  static namespace = "/event/v1";

  static listFromUser(args: { userId: number }): Promise<AxiosResponse<WpRestResponse<DocumentSchema[]>>> {
    return restApi.get(`${this.namespace}/documents/${args.userId}` );
  }

  static delete(data: any): Promise<AxiosResponse> {
    return httpApi.post("/wp-admin/admin-ajax.php?action=ev_document_delete", {
      ...data,
    });
  }
}
