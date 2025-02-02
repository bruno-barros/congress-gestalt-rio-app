import {AxiosResponse} from "axios";
import {httpApi, restApi, RESTVersion} from "./axios";
import { WpRestResponse } from '../types/restapi';
import { EvaluationSchema } from "../types/review";

export default class WpEvaluation {

  static setEvaluators(args: {user_id: number, abstracts: number[], notify:boolean, edition_id: string}): Promise<AxiosResponse<WpRestResponse<string>>> {
    return restApi.post(`${RESTVersion.default().namespace}/abstracts/set_evaluator`, args);
    // return httpApi.post('/wp-admin/admin-ajax.php?action=ev_evaluation_set', {user_id: args.user_id, abstracts: args.abstracts, notify: args.notify, edition_id: args.edition_id});
  }

  /**
   * Altera a visibilidade de uma avaliação
   * @param args 
   * @returns 
   */
  static setPublic(args: {evaluation_id: number, public?: boolean}): Promise<AxiosResponse<WpRestResponse<string>>> {
    const is_public = args?.public === false ? 0 : 1;
    return restApi.put(`${RESTVersion.default().namespace}/evaluations/${args.evaluation_id}/visibility`, {is_public});
  }


  static get(args: { edition_id?: string; user_id?: number; abstract_id?: number, limit?: number; appendEvaluator?: boolean }): Promise<AxiosResponse<{ data: { evEvaluations: { nodes: EvaluationSchema[] } } }> | any> {

    let filters = []
    if (args?.edition_id) filters.push(`edition_id: "${args.edition_id}"`)
    if (args?.user_id) filters.push(`user_id: ${args.user_id}`)
    if (args?.abstract_id) filters.push(`abstract_id: "${args.abstract_id}"`)
    let lmt = args?.limit || 2000
    let evaluator = '';
    if(args?.appendEvaluator){
      evaluator = `evaluator {
        databaseId
        name
        email
        cellphone
      }`
    }


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
      clarity
      contributions
      bibliography
      research
      methodology
      created_at
      abstract_id
      user_id
      edition_id
      is_public
      days_of_delay
      abstract {
        databaseId
        title
        subtitle
        topic
        edition_id
      }
      ${evaluator}
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
    clarity
    contributions
    bibliography
    research
    methodology
    status
    user_id
    is_public
    abstract {
      databaseId
      authorDatabaseId
      date
      excerpt
      abstract_tags
      abstract_tags_es
      bibliography
      subtitle
      status
      title
      topic
      type
      content
      workshop_participants
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
      professional_proof {
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
  }
}`
    });
  }

  static update(id: number | string, data: any): Promise<AxiosResponse<WpRestResponse<EvaluationSchema>>> {
    return restApi.put(`${RESTVersion.default().namespace}/evaluations/${id}`, data);
  }

  /**
   * @deprecated usar update()
   * @param data 
   * @returns 
   */
  static save(data: any) {
    return httpApi.post('/wp-admin/admin-ajax.php?action=ev_evaluation_save', {...data});
  }

  static delete(id: number|number[]): Promise<AxiosResponse<WpRestResponse<string>>> {
    
    let idStr = Array.isArray(id) ? id.join(',') : id.toString();
    
    return restApi.delete(`${RESTVersion.default().namespace}/evaluations/${idStr}`);
  }

  static visibility(args: {abstract_ids:number[], is_public: boolean, criteria: string|'approved_only'|'rejected_only'|'all'}):Promise<AxiosResponse<WpRestResponse<string>>> {
    return restApi.post(`${RESTVersion.default().namespace}/abstracts/evaluations_visibility`, args);
  }


  static countInReview(userId: number | string): Promise<AxiosResponse> {
    return httpApi.post('/index.php?graphql&countInReview', {
      query: `query countInReview {
  __typename
  evEvaluations(where: {status: [synopsis_evaluating, evaluating], user_id: ${userId}}) {
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
      clarity
      contributions
      bibliography
      research
      methodology
      status
      edition_id
      is_public
      ${append}
    }
  }
}`
    })
  }
}
