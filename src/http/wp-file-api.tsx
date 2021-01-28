import {AxiosResponse} from "axios";
import {httpApi} from "./axios";
import {Document} from "../resources/document";

export default class WpFileApi {

  static updateDocument(file: Document, options?: any): Promise<AxiosResponse<any>> {
    return httpApi.post('/wp-admin/admin-ajax.php?action=document_update', {file, options});
  }

  static fetchDocuments(args: {
    user_id: number;
    page: number;
    limit?: number;
  }): Promise<AxiosResponse<any>> {

    let userId = args.user_id || null;
    let page = args.page || 1;
    let limit = args.limit || 10;

    return httpApi.post('/index.php?graphql&zbDocuments', {
      query: `query fetchDocuments {
      zbDocuments(where: {pagination: {limit: ${limit}, page: ${page}}, user_id: ${userId}}) {
        nodes {
          created_at
          id
          databaseId
          mimetype
          name
          note
          owner_id
          partner_id
          size
          url
          user_id
          context
        }
        pageInfo {
          offsetPagination {
            total
            hasMore
          }
        }
      }
    }`
    });
  }
}
