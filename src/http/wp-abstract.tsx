import {AxiosResponse} from "axios";
import {httpApi} from "./axios";
import isFinite from 'lodash/isFinite'

export class WpAbstract {

  static update(data: any){
    return httpApi.post('/wp-admin/admin-ajax.php?action=ev_abstract_update', {...data});
  }

  static addAuthor(data: any){
    return httpApi.post('/wp-admin/admin-ajax.php?action=ev_author_add', {...data});
  }
  static editAuthor(data: any){
    return httpApi.post('/wp-admin/admin-ajax.php?action=ev_author_edit', {...data});
  }
  static deleteAuthor(id: any){
    return httpApi.post('/wp-admin/admin-ajax.php?action=ev_author_delete', {id});
  }
}
