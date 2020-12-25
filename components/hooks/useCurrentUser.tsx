import {useDispatch, useSelector} from "react-redux";
import {RootReducers} from "../../src/store/store.d";
import {User} from "../../src/resources/user";
import {useQuery} from "react-query";
import { USER_ACTYPE} from "../../src/store/user.actions";
import WpUser from "../../src/http/wp-user";
import AuthToken from "../../src/http/auth-token";

function fetchCurrentUser(dispatch) {
  return  ():Promise<any> => {
    return new Promise((resolve, reject) => {

      const id = AuthToken.factory().decodedToken.id

      WpUser.fetchLogged(id).then((resp)=>{
        console.log({id}, 'fetching AUTH again...');
        if(resp.data?.data?.user){
          dispatch({type: USER_ACTYPE.UPDATED, payload: resp.data.data.user})
          resolve(resp.data.data.user)
        } else {
          reject(null)
        }
      });

    })
  }

}

export default function useCurrentUser():{authLoading: boolean; user: User | null} {

  const dispatch = useDispatch()

  // let authState = useSelector((state: RootReducers) => state.user);
  const queryAuth = useQuery('auth', fetchCurrentUser(dispatch), {
   cacheTime: 1000 * 60 * 10,
    retry: 1
    // enabled: !!authState.databaseId === false
  })

  return {
    authLoading: queryAuth.isLoading,
    user: User.make({...queryAuth.data})
  }
}
