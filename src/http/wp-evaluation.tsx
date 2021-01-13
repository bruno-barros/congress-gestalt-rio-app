import {AxiosResponse} from "axios";
import {httpApi} from "./axios";

export default class WpEvaluation {

  static setEvaluators(args: {user_id: number, abstracts: number[], notify:boolean, edition_id: string}) {
    return httpApi.post('/wp-admin/admin-ajax.php?action=ev_evaluation_set', {user_id: args.user_id, abstracts: args.abstracts, notify: args.notify, edition_id: args.edition_id});
  }


  static get(args: { edition_id?: string; user_id?: number; abstract_id?: number, limit?: number }): Promise<AxiosResponse> {

    let filters = []
    if (args?.edition_id) filters.push(`edition_id: "${args.edition_id}"`)
    if (args?.user_id) filters.push(`user_id: ${args.user_id}`)
    if (args?.abstract_id) filters.push(`abstract_id: "${args.abstract_id}"`)
    let lmt = args?.limit || 2000

    return httpApi.post('/index.php?graphql&evaluations', {
      query: `query WpEvaluation {
  __typename
  evEvaluations(where: {${filters.join(', ')}}, first: ${lmt}) {
    nodes {
      id
      databaseId
      answers
      comment
      status
      quality
      relevance
      created_at
      abstract_id
      user_id
      edition_id
      abstract {
        databaseId
        title
        subtitle
        topic
        edition_id
      }
    }
  }
}`
    });
  }


  static find(id: number | string): Promise<AxiosResponse> {

    return httpApi.post('/index.php?graphql&evEvaluation', {
      query: `query WpEvaluation {
  __typename
  evEvaluation(id: ${id}) {
    abstract_id
    answers
    comment
    created_at
    databaseId
    id
    relevance
    quality
    status
    user_id
    abstract {
      databaseId
      authorDatabaseId
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
    }
  }
}`
    });
  }

  static save(data: any) {
    return httpApi.post('/wp-admin/admin-ajax.php?action=ev_evaluation_save', {...data});
  }

  static delete(id: number) {
    return httpApi.post('/wp-admin/admin-ajax.php?action=ev_evaluation_delete', {id});
  }


  static countInReview(userId: number | string): Promise<AxiosResponse> {
    return httpApi.post('/index.php?graphql&countInReview', {
      query: `query countInReview {
  __typename
  evEvaluations(where: {status: [revision, final_revision], user_id: ${userId}}) {
    pageInfo {
      offsetPagination {
        total
      }
    }
  }
}`
    })
  }

  static forAbstract(abstractId: number | string, complete: boolean = false): Promise<AxiosResponse> {

    let append = '';
    if (complete) {
      append = `
    answers
      evaluator {
        databaseId
        email
        firstName
        name
      }
`
    }

    return httpApi.post('/index.php?graphql&byAbstract', {
      query: `query byAbstract {
  __typename
  evEvaluations(where: {abstract_id: ${abstractId}}) {
    nodes {
      databaseId
      created_at
      updated_at
      comment
      quality
      relevance
      status
      edition_id
      ${append}
    }
  }
}`
    })
  }
}
