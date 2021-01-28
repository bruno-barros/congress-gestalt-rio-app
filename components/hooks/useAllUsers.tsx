import {useQuery} from "react-query";
import WpUser from "../../src/http/wp-user";
import {errorNotification} from "../../src/resources/responses";
import useCurrentUser from "./useCurrentUser";

export default function useAllUsers() {

  const {user} = useCurrentUser()

  function queryUsers(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      WpUser.all().then(resp => {
        if (resp.data.data?.users?.nodes) {
          resolve(resp.data.data.users.nodes)
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

  const query = useQuery<any[], any>(['users', 'admin'], queryUsers, {
    enabled: user.canManageAbstracts(),
    staleTime: Infinity
  })

  return {...query}

}
