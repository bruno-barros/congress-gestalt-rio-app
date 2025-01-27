import {Query, QueryClient, useQuery} from "react-query";
import WpEvaluation from "../../src/http/wp-evaluation";
import useCurrentUser from "./useCurrentUser";


export default function usePendingReview() {

  const {user} = useCurrentUser()

  function queryCount(): Promise<number> {
    return new Promise((resolve) => {
      if(!user.canEvaluateAbstracts()) {
        resolve(0)
        return
      }
      WpEvaluation.countInReview(user.getId())
        .then(resp => {
         if(resp.data.data?.evEvaluations?.pageInfo?.offsetPagination?.total){
           resolve(resp.data.data.evEvaluations.pageInfo.offsetPagination.total)
         }
        })
    })
  }

  return useQuery(['pending_review', user.getId()], queryCount, {
    // staleTime: Infinity
  })
}

export function invalidatePendingReview(client: QueryClient, userId: number) {
  client.refetchQueries(['pending_review', userId])
}