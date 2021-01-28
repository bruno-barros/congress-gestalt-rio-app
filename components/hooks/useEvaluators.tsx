import {useQuery} from "react-query";
import WpUser from "../../src/http/wp-user";


export default function useEvaluators({enabled}: {enabled: boolean}) {

  function queryEvaluations(): Promise<any[] | null> {
    return new Promise((resolve) => {
      WpUser.searchUser({
        role: 'contributor',
        limit: 500
      })
        .then(resp => {
          if (resp.data.data?.evUserSearch?.nodes) {
            resolve(resp.data.data.evUserSearch.nodes)
          } else {
            resolve(null)
          }
        }, err => {

        })
    })
  }

  return useQuery<any[]>(['evaluators'], queryEvaluations, {
    enabled: !!enabled
  })
}
