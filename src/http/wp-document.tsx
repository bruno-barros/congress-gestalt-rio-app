import {AxiosResponse} from "axios";
import {httpApi} from "./axios";

export default class WpDocument {

  static delete(data: any): Promise<AxiosResponse> {
    return httpApi.post('/wp-admin/admin-ajax.php?action=ev_document_delete', {...data});
  }
}
