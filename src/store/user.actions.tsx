import AuthToken from "../http/auth-token";
import {ErrorMessage, LoginInputs} from "./store.d";
import {Dispatch} from "redux";
import {AxiosResponse} from "axios";
import pickBy from 'lodash/pickBy'
import Wordpress from "../http/api/wordpress";
import {UI_ACTYPE} from "./ui.actions";

export const USER_ACTYPE = {
  LOGIN: 'LOGIN_SUCCESS',
  LOGIN_ERR: 'LOGIN_ERROR',
  LOGOUT: 'LOGOUT_SUCCESS',
  UPDATED: 'USER_UPDATED',
  CREATED: 'USER_CREATED',
  CREATED_ERR: 'USER_CREATED_ERROR'
}

// export const exampleAction = () => {
//   return (dispatch, getState) => {
//     dispatch({type: USER_ACTYPE.LOGOUT, payload: {}})
//   }
// }

/**
 * Login user
 * @param inputs
 * @param callback
 */
export const postLogin = (
  inputs: LoginInputs,
  callback: (user: any, error: ErrorMessage | boolean) => void
) => {
  return async (dispatch: Dispatch, getState: any) => {

    dispatch({type: UI_ACTYPE.BLOCKUI, payload: true})
    const resp: AxiosResponse<any> = await Wordpress.doLogin(inputs);

    if (resp.data.data && resp.data.data.login?.authToken) {
      await AuthToken.storeToken(resp.data.data.login.authToken, null);
      if (resp.data.data.login.refreshToken) {
        AuthToken.storeRefreshToken(resp.data.data.login.refreshToken);
      }
      // setup user
      const resp2 = await _fetchUserData();
      dispatch({type: UI_ACTYPE.BLOCKUI, payload: false})
      if (!resp2.data.errors) {
        dispatch({type: USER_ACTYPE.LOGIN, payload: resp2.data.data.user})
      }
      // dispatch({type: USER_ACTYPE.LOGIN, payload: resp.data.data.login.user});
      callback(resp.data.data.login.user, false);
    } else {
      // some error here
      /**
       * {
          "errors": [
            {
              "message": "incorrect_password",
              "extensions": {
                "category": "user"
              },
              "locations": [ ],
              "path": [ "login" ]
            }
          ],
          "data": {
            "login": null
          }
        }
       */
      dispatch({type: UI_ACTYPE.BLOCKUI, payload: false})
      const error = {
        code: resp.data.errors[0].message, msg: resp.data.errors[0].message
      }

      dispatch({type: USER_ACTYPE.LOGIN_ERR, payload: error});
      callback(null, error);
    }
  }
}

export const setUpUser = (input : {user: any, tokens: { access: string, refresh?: string }, locale: string}, callback: () => void) => {
  return async (dispatch, getState) => {

    await AuthToken.storeToken(input.tokens.access, null);
    if (input.tokens.refresh) {
      AuthToken.storeRefreshToken(input.tokens.refresh);
    }

    dispatch({type: USER_ACTYPE.LOGIN, payload: pickBy(input.user, (value, key)=> {
      return ['ID', 'id', 'user_login', 'user_email', 'display_name', 'first_name', 'last_name', 'locale', 'avatar', '_profile_completed', '_revalidate_password', 'google_social_id', 'facebook_social_id'].indexOf(key) !== -1
      })})

    callback();
  }
}

/**
 * Refresh JWT session
 */
export const renewAuthToken = () => {
  return async (dispatch, getState) => {
    const auth = AuthToken.factory();
    const resp = await Wordpress.refreshToken(auth.decodedToken.id, AuthToken.getToken());

    if (resp.data?.data?.refreshJwtAuthToken?.authToken) {
      await AuthToken.storeToken(resp.data.data.refreshJwtAuthToken.authToken, null);
    } else {
      AuthToken.deleteToken()
    }
  }
}

export const fetchUserData = () => {
  return async (dispatch: Dispatch, getState: any) => {
    dispatch({type: UI_ACTYPE.BLOCKUI, payload: true})

    const resp = await _fetchUserData();

    dispatch({type: UI_ACTYPE.BLOCKUI, payload: false})
    if (!resp.data.errors) {
      dispatch({type: USER_ACTYPE.UPDATED, payload: resp.data.data.user})
    }
  }
}


async function _fetchUserData(): Promise<AxiosResponse<any>> {
  console.log('FETCHING USER DATA');
  const auth = AuthToken.factory();
  return await Wordpress.fetchUser(auth.decodedToken.id);
}
