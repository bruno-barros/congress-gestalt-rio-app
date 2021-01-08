import {useQuery} from "react-query";
import useCurrentUser from "./useCurrentUser";
import WpEvaluation from "../../src/http/wp-evaluation";
import {Evaluation} from "../../src/resources/evaluation";


export default function useEvaluation(id: number|null) {

  const {user} = useCurrentUser()

  function queryEvaluation(): Promise<Evaluation|null>{
    return new Promise((resolve, reject)=>{
      WpEvaluation.find(id)
        .then(resp => {
          if(resp.data?.data?.evEvaluation){
            resolve(Evaluation.make(resp.data.data.evEvaluation))
          } else {
            reject(null)
          }
        }, err => {
          reject(err)
        })
    })
  }

  return useQuery(['evaluation', id], queryEvaluation, {
    enabled: !!id
  })
}
