import {AxiosResponse} from "axios";
import {httpApi} from "./axios";

export default class WpConfig {

  static load(){
    return httpApi.post('/wp-admin/admin-ajax.php?action=ev_configurations');
  }
}
