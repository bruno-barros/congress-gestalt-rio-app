import {AxiosResponse} from "axios";
import {httpApi} from "./axios";
import isFinite from 'lodash/isFinite'
import {GraphQlStatuses} from "../../components/abstract/abstract.d";

export class WpAbstract {

  static update(data: any): Promise<AxiosResponse> {
    return httpApi.post('/wp-admin/admin-ajax.php?action=ev_abstract_update', {...data});
  }

  static addAuthor(data: any): Promise<AxiosResponse> {
    return httpApi.post('/wp-admin/admin-ajax.php?action=ev_author_add', {...data});
  }

  static editAuthor(data: any): Promise<AxiosResponse> {
    return httpApi.post('/wp-admin/admin-ajax.php?action=ev_author_edit', {...data});
  }

  static deleteAuthor(data: any): Promise<AxiosResponse> {
    return httpApi.post('/wp-admin/admin-ajax.php?action=ev_author_delete', {...data});
  }

  static find(id: number): Promise<AxiosResponse> {
    return httpApi.post('/index.php?graphql&abstract', {
      query: `query find {
  abstract(id: "${id}", idType: DATABASE_ID) {
    databaseId
    date
    excerpt
    abstract_tags
    bibliography
    subtitle
    status
    synopsis
    title
    topic
    content
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
    }
    authors {
      name
      email
      active
      bio
      id
      is_speaker
      order
    }
  }
}`
    });
  }

  static collection(args: { edition: string, authorId?: number, authorName?: string, statuses?: GraphQlStatuses[] }): Promise<AxiosResponse> {

    let filters = []
    filters.push(`edition: "${args.edition}"`)
    if (args?.authorId) filters.push(`author_id: ${args.authorId}`)
    if (args?.authorName) filters.push(`author_name: "${args.authorName}"`)
    if (args.statuses) filters.push(`status: [${args.statuses.join(',')}]`)

    return httpApi.post('/index.php?graphql&abstractFilters', {
      query: `query collection {
  abstractFilters(where: {${filters.join(', ')}}) {
    nodes {
      databaseId
      title
      subtitle
      topic
      status
      date
      edition_id
      authors_count
      evaluations_count
      attachments_count
      authorDatabaseId
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
