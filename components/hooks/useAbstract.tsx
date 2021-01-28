import {useQuery} from "react-query";
import Abstract from "../../src/resources/abstract";
import {WpAbstract} from "../../src/http/wp-abstract";
import useCurrentUser from "./useCurrentUser";


export default function useAbstract(id: number|null) {

  const {user} = useCurrentUser()

  function queryAbstract(): Promise<Abstract>{
    return new Promise((resolve, reject)=>{
      WpAbstract.find(id)
        .then(resp => {
          if(resp.data?.data?.abstract){
            resolve(Abstract.make(resp.data.data.abstract))
          } else {
            reject(null)
          }
        }, err => {
          reject(err)
        })
    })
  }

  return useQuery(['abstract', id], queryAbstract, {
    enabled: !!id
  })
}
