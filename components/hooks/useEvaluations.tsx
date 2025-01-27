import {useQuery} from "react-query";
import useCurrentUser from "./useCurrentUser";
import WpEvaluation from "../../src/http/wp-evaluation";
import {errorNotification} from "../../src/resources/responses";
import { EvaluationSchema } from "../../src/types/review";
import { REQUIREMENTS } from "../access-control/requirements";
import { ac } from "../access-control";


export default function useEvaluations(editionId: string|null) {

  const {user} = useCurrentUser()

  function queryEvaluations(): Promise<EvaluationSchema[]> {
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

  return useQuery(['evaluations', 'adm', editionId], queryEvaluations, {
    enabled: !!editionId && ac(user, [REQUIREMENTS.abstract.manage]),
  })


}
