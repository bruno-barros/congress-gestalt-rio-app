import {AxiosResponse} from "axios";
import {httpApi, restApi, RESTVersion} from "./axios";
import isFinite from 'lodash/isFinite'
import {GraphQlStatuses} from "../../components/abstract/abstract.d";
import { StatusType } from "../types/abstracts";

export class WpAbstract {
  static namespace = "/event/v1";

  static updateStatus(args: { abstracts: number[], status: StatusType, notify: boolean }): Promise<AxiosResponse> {
    return httpApi.post('/wp-admin/admin-ajax.php?action=ev_abstract_set_status', {
      abstracts: args.abstracts,
      status: args.status,
      notify: args.notify
    });
  }

  static update(data: any): Promise<AxiosResponse> {
    return restApi.post(`${RESTVersion.default().namespace}/abstracts`, data);
  }

  static addAuthor(data: any): Promise<AxiosResponse> {
    return restApi.post(`${RESTVersion.default().namespace}/authors`, data);
  }

  /**
   * @deprecated WpAuthor.update()
   * @param data 
   * @returns 
   */
  static editAuthor(data: any): Promise<AxiosResponse> {
    return restApi.post(`${RESTVersion.default().namespace}/authors`, data);
  }

  static setSpeaker(args: {id: number; locale?: string}): Promise<AxiosResponse> {
    return httpApi.post('/wp-admin/admin-ajax.php?action=ev_set_speaker', {
      id: args.id, locale: args.locale || 'pt'
    });
  }

  /**
   * @deprecated WpAuthor.delete()
   * @param data 
   * @returns 
   */
  static deleteAuthor(data: any): Promise<AxiosResponse> {
    return httpApi.post('/wp-admin/admin-ajax.php?action=ev_author_delete', {...data});
  }

  static export(args: {abstracts: number[]}): Promise<AxiosResponse> {
    return httpApi.post('/wp-admin/admin-ajax.php?action=ev_abstract_export', {abstracts: args.abstracts});
  }

  static delete(args: {abstracts: number[]}): Promise<AxiosResponse> {
    return httpApi.post('/wp-admin/admin-ajax.php?action=ev_abstract_delete', {abstracts: args.abstracts});
  }

  static anais(args: {exportEdition: string, cancel?: boolean}): Promise<AxiosResponse> {
    return httpApi.post('/wp-admin/admin-ajax.php?action=ev_abstract_anais', {...args});
  }

  static consent(args: {abstract_id: number, consents: any[]}): Promise<AxiosResponse> {
    return httpApi.post('/wp-admin/admin-ajax.php?action=ev_abstract_consents', args);
  }
  // quantity: int
  // *   status: string
  // *   criteria: [abstract_status, evaluation_status,
  // *              synopsis_no_evaluated, abstracts_no_evaluated]
  // *   return: (optional) [ids, object, array, minimum]
  // *   editionId: (optional) string
  static findByCriteria(args: {
    criteria: 'abstract_status' | 'evaluation_status'|'synopsis_no_evaluated'|'abstracts_no_evaluated',
    quantity?: number,
    status?: string,
    return?: 'ids' | 'object' | 'array'| 'minimum',
    editionId?: string
  }): Promise<AxiosResponse> {
    return httpApi.post('/wp-admin/admin-ajax.php?action=ev_abstract_find_criteria', args);
  }

  static authors(id: number): Promise<AxiosResponse> {
    return httpApi.post('/index.php?graphql&authors', {
      query: `query find {
  abstract(id: "${id}", idType: DATABASE_ID) {
    databaseId
    author {
      node {
        avatar {
          url
        }
        databaseId
        email
        firstName
        locale
        name
      }
    }
    authors {
      name
      email
      active
      bio
      company
      id
      wp_user_id
      is_speaker
      order
    }
  }
}`
    });
  }


  static attachments(id: number): Promise<AxiosResponse> {
    return httpApi.post('/index.php?graphql&attachments', {
      query: `query find {
  abstract(id: "${id}", idType: DATABASE_ID) {
    databaseId
    title
    attachments {
      abstract_id
      context
      created_at
      id
      name
      mimetype
      note
      size
      url
      user_id
      version
    }
  }
}`
    });
  }


  static find(id: number): Promise<AxiosResponse> {
    return httpApi.post('/index.php?graphql&abstract', {
      query: `query find {
  abstract(id: "${id}", idType: DATABASE_ID) {
    databaseId
    date
    excerpt
    abstract_tags
    abstract_tags_es
    bibliography
    subtitle
    status
    title
    title_es
    topic
    type
    content
    ev_last_update
    consents
    authorDatabaseId
    author {
      node {
        avatar {
          url
        }
        databaseId
        email
        firstName
        locale
        name
      }
    }
    attachments {
      abstract_id
      context
      created_at
      id
      name
      mimetype
      note
      size
      url
      user_id
      version
    }
    authors {
      name
      email
      active
      bio
      id
      wp_user_id
      is_speaker
      order
      company
    }
  }
}`
    });
  }

  static collection(args: { edition: string, authorId?: number, authorName?: string, statuses?: GraphQlStatuses[], limit?:number }): Promise<AxiosResponse> {

    let filters = []
    filters.push(`edition: "${args.edition}"`)
    if (args?.authorId) filters.push(`author_id: ${args.authorId}`)
    if (args?.authorName) filters.push(`author_name: "${args.authorName}"`)
    if (args.statuses) filters.push(`status: [${args.statuses.join(',')}]`)
    let lmt = args?.limit || 1000

    return httpApi.post('/index.php?graphql&abstractFilters', {
      query: `query collection {
  abstractFilters(where: {${filters.join(', ')}}, first: ${lmt}) {
    nodes {
      databaseId
      main_language
      title
      title_es
      subtitle
      topic
      type
      status
      date
      edition_id
      authors_count
      evaluations_count
      attachments_count
      authorDatabaseId
      ev_last_update
      author {
        node {
          email
          name
        }
      }
    }
    pageInfo {
      offsetPagination {
        total
      }
    }
  }
}`
    });
  }


}
