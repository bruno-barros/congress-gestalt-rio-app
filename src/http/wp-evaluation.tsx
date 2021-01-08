import {AxiosResponse} from "axios";
import {httpApi} from "./axios";

export default class WpEvaluation {

  static get(args: {edition_id?:string; user_id?: number; abstract_id?: number}): Promise<AxiosResponse> {

    let filters = []
    if (args?.edition_id) filters.push(`edition_id: "${args.edition_id}"`)
    if (args?.user_id) filters.push(`user_id: ${args.user_id}`)
    if (args?.abstract_id) filters.push(`abstract_id: "${args.abstract_id}"`)

    return httpApi.post('/index.php?graphql&evaluations', {
      query: `query WpEvaluation {
  __typename
  evEvaluations(where: {${filters.join(', ')}}) {
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


  static find(id: number|string): Promise<AxiosResponse> {

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
}
