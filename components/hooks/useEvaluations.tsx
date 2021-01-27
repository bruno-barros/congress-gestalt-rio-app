import {useQuery} from "react-query";
import useCurrentUser from "./useCurrentUser";
import WpEvaluation from "../../src/http/wp-evaluation";
import {Evaluation} from "../../src/resources/evaluation";
import {errorNotification} from "../../src/resources/responses";
import useEvent from "./useEvent";


export default function useEvaluations(editionId: string|null) {

  const {user} = useCurrentUser()

  function queryEvaluations(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      WpEvaluation.get({
        edition_id: editionId,
        appendEvaluator: true
      }).then(resp => {
        if (resp.data.data?.evEvaluations?.nodes) {
          resolve(resp.data.data.evEvaluations.nodes)
        } else {
          reject([])
          errorNotification({error: resp.data.errors})
        }
      }, err => {
        reject([])
        errorNotification({error: err})
      })
    })
  }

  return useQuery<any[], any>(['evaluations', 'adm', editionId], queryEvaluations, {
    enabled: !!editionId && user.canManageAbstracts(),
  })


}
