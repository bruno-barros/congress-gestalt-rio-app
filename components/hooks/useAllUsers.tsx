import {useQuery} from "react-query";
import WpUser from "../../src/http/wp-user";
import {errorNotification} from "../../src/resources/responses";
import useCurrentUser from "./useCurrentUser";
import { UserGraphQl } from "../../src/types/users";
import { REQUIREMENTS } from '../access-control/requirements';
import { ac } from "../access-control";



export default function useAllUsers() {

  const {user} = useCurrentUser()

  function queryUsers(): Promise<UserGraphQl[]> {
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

  const query = useQuery<UserGraphQl[], any>(['users', 'admin'], queryUsers, {
    enabled: ac(user, [REQUIREMENTS.user.edit]),
    staleTime: Infinity
  })

  return {...query}

}
