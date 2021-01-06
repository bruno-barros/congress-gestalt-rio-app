import {useDispatch} from "react-redux";
import {User} from "../../src/resources/user";
import {QueryObserverResult, useQuery} from "react-query";
import {USER_ACTYPE} from "../../src/store/user.actions";
import WpUser from "../../src/http/wp-user";
import AuthToken from "../../src/http/auth-token";
import {useTranslation} from "react-i18next";
import {useEffect} from "react";
import {ev_locale} from "../../src/helpers";
import {useRouter} from "next/router";

function fetchCurrentUser(dispatch) {
  return (): Promise<any> => {
    return new Promise((resolve, reject) => {

      const id = AuthToken.factory().decodedToken.id

      WpUser.fetchLogged(id).then((resp) => {
        console.log({id}, 'fetching AUTH again...');
        if (resp.data?.data?.user) {
          dispatch({type: USER_ACTYPE.UPDATED, payload: resp.data.data.user})
          resolve(resp.data.data.user)
        } else {
          reject(null)
        }
      });

    })
  }

}

export default function useCurrentUser(): { authLoading: boolean; user: User | null } & QueryObserverResult<any, any> {

  const dispatch = useDispatch()
  const router = useRouter()

  // let authState = useSelector((state: RootReducers) => state.user);
  const queryAuth = useQuery('auth', fetchCurrentUser(dispatch), {
    cacheTime: 1000 * 60 * 10,
    retry: 1,
    onSettled: (value) => {
      const appLocale: string = ev_locale(value?.locale)
      if (appLocale !== router?.locale) {
        router.push({pathname: router.pathname, query: router.query}, router.asPath, {locale: appLocale})
      }
    }
    // enabled: !!authState.databaseId === false
  })

  return {
    authLoading: queryAuth.isLoading,
    user: User.make({...queryAuth.data}),
    ...queryAuth
  }
}
