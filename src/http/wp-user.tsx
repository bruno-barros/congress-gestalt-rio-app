import {AxiosResponse} from "axios";
import {httpApi, restApi, RESTVersion} from "./axios";
import {LoginInputs} from "../store/store.d";
import isFinite from 'lodash/isFinite'
import {Providers} from '../../components/social-login/social-buttons.d'
import {NotificationTypes} from "../resources/notification";
import { WpRestResponse } from "../types/restapi";
import { UserInterface } from "../resources/user";
export default class WpUser {
  static FILLABLE = [
    'clientMutationId',
    'id',
    'databaseId',
    'description',
    'birthdate',
    'address',
    'cellphone',
    'city',
    'complement',
    'country',
    'cpf',
    'doc_prof',
    'email',
    'alt_email',
    'user_email',
    'name',
    'firstName',
    'lastName',
    'gender',
    'neighborhood',
    'number',
    'phone',
    'postcode',
    'specialities',
    'state',
    'partner_id',
  ];

  static saveRemoteSession(userId: number, token: string){

    return restApi.post(`${RESTVersion.default().namespace}/users/${userId}/remote_session`, {token});
  }

  static signUpWithEmail(args: {display_name: string, username: string, password: string, locale?:string}): Promise<AxiosResponse<WpRestResponse<{
    next_action: string;
    provider: string;
    login: {authToken: string, refreshToken: string}
    current_user: any
  }>>> {
    return restApi.post(`${RESTVersion.default().namespace}/auth/signup_with_email`, {...args});
  }

  static socialLogin(profile: any, provider: Providers, locale: string): Promise<AxiosResponse<WpRestResponse<{
    next_action: string;
    provider: string;
    login: {authToken: string, refreshToken: string}
    current_user: any
  }>>> {
    return restApi.post(`${RESTVersion.default().namespace}/auth/social_login`, {...profile, provider, locale});
  }

  static mergeProfiles(profile: any, provider: Providers, locale: string){
    let merging_url = `${window.location.protocol}//${window.location.host}/merging`;
    return restApi.post(`${RESTVersion.default().namespace}/auth/merge_profiles`, {...profile, provider, merging_url, locale});
  }

  static mergeApproved(uuid: any): Promise<AxiosResponse<WpRestResponse<any>>>{
    return restApi.post(`${RESTVersion.default().namespace}/auth/merge_approved`, {uuid});
  }

  /**
   * {
      "data": {
        "login": {
          "authToken": "(long string here...)",
          "user": {
            "id": "dXNlcjox",
            "databaseId": 1,
            "name": "admin",
            "email": "web@mail.com"
          }
        }
      }
    }
   * @param input
   */
  static doLogin(input: LoginInputs): Promise<AxiosResponse<any>> {
    return httpApi.post('/index.php?graphql&login', {
      query: `mutation LoginUser {
        login(input: {clientMutationId: "${input.login}", username: "${input.login}", password: "${input.password}"}) {
          authToken
          refreshToken
          user {
            databaseId
            email
            alt_email
            id
            name
            firstName
            timeframes {
              monday
              tuesday
              wednesday
              thursday
              friday
              saturday
              sunday
            }
            avatar {
              url
            }
            roles {
              nodes {
                name
              }
            }
            ms_graph {
              id
              upn
            }
          }
        }
      }`
    });
  }

  static logout() {
    return httpApi.post('/wp-admin/admin-ajax.php?action=ev_logout');
  }

  /**
   * {
      "data": {
        "__typename": "RootMutation",
        "refreshJwtAuthToken": {
          "clientMutationId": "dXNlcjox",
          "authToken": "(long string...)"
        }
      }
    }
   * @param mutationId
   * @param token
   */
  static refreshToken(mutationId: number, token: string): Promise<AxiosResponse<any>> {
    return httpApi.post('/index.php?graphql&refreshJwtAuthToken', {
      query: `mutation RefreshToken {
      refreshJwtAuthToken(input: {clientMutationId: "${mutationId}", jwtRefreshToken: "${token}"}) {
        clientMutationId
        authToken
      }
    }`
    });
  }

  /**
   * @param id
   */
  static fetchUser(id: any, appendQuery?: string): Promise<AxiosResponse<any>> {

    let type = isFinite(Number(id)) ? 'DATABASE_ID' : 'ID'

    return httpApi.post('/index.php?graphql&user', {
      query: `query FetchUser {
        __typename
        user(id: "${id}", idType: ${type}) {
          id
          databaseId
          phone
          name
          gender
          firstName
          email
          alt_email
          description
          cpf
          postcode
          lastName
          address
          birthdate
          cellphone
          city
          country
          complement
          neighborhood
          number
          state
          registeredDate
          user_status
          locale
          allow_newsletter
          institution_name
          institution_occupation
          is_pdc
          pdc_needs
          is_child_care
          is_affirmative_action
          affirmative_action
          ${appendQuery || ''}
          roles {
            nodes {
              name
            }
          }
          avatar {
            url
          }
        }
      }`
    });
  }

  /**
   * @param id
   */
  static fetchLogged(id: any): Promise<AxiosResponse<any>> {

    let type = isFinite(Number(id)) ? 'DATABASE_ID' : 'ID'

    return httpApi.post('/index.php?graphql&fetchLogged', {
      query: `query fetchLogged {
        __typename
        viewer {
          id
          databaseId
          phone
          name
          gender
          firstName
          email
          alt_email
          description
          cpf
          postcode
          lastName
          address
          birthdate
          cellphone
          city
          country
          complement
          neighborhood
          number
          state
          registeredDate
          user_status
          badge_name
          social_name
          passport
          locale
          consents
          institution_name
          institution_occupation
          special_behaviors
          is_pdc
          pdc_needs
          is_child_care
          is_affirmative_action
          affirmative_action
          roles {
            nodes {
              name
            }
          }
          avatar {
            url
          }
        }
      }`
    });
  }

  static searchUser(args: {by_name?: string, role?: 'subscriber'|'contributor'| 'editor'| 'administrator', limit?:number, filters?: any}): Promise<AxiosResponse<any>> {

    let byName = args?.by_name ? `, by_name: "${args.by_name}"` : ''
    let limit = args?.limit || 12
    let role = args.role || 'any'

    return httpApi.post('/index.php?graphql&searchUser', {
      query: `query searchUser {
  __typename
  evUserSearch(where: {pagination: {limit: ${limit}, page: 1}, orderby: name, order: ASC, roles: ${role} ${byName}}, first: ${limit}) {
    nodes {
      id
      databaseId
      name
      firstName
      email
      ${role !== 'subscriber' ? 'evaluations_pending_count' : ''}
      avatar {
        url
      }
    }
  }
}`
    });
  }

  static all(args?: {limit?: number}): Promise<AxiosResponse<any>> {
    let lmt = args?.limit || 3000
    return httpApi.post('/index.php?graphql&all', {
      query: `query all {
  __typename
  users(where: {roleIn: [AUTHOR, CONTRIBUTOR, SUBSCRIBER, EDITOR], orderby: {field: REGISTERED, order: DESC}}, first: ${lmt}) {
    nodes {
      avatar {
        url
      }
      databaseId
      firstName
      locale
      name
      email
      cellphone
      registeredDate
      is_affirmative_action
      affirmative_action
      roles {
        nodes {
          name
        }
      }
    }
    pageInfo {
      offsetPagination {
        total
      }
    }
  }
}`
    });
  }

  static updateAvatar(userId: number, url: string) {
    return httpApi.post('/wp-admin/admin-ajax.php?action=ev_update_avatar', {userId, url});
  }

  static addCredits(userId: number, quantity: number, obs: string, isGift: boolean) {
    return httpApi.post('/wp-admin/admin-ajax.php?action=ev_add_credits', {
      user_id: userId, quantity, obs, is_gift: isGift
    });
  }

  static update(args: {
    databaseId: number;
    email: string;
    [key: string]: any;
  }) {
    return restApi.put(`${RESTVersion.default().namespace}/users/${args.databaseId}`, {...args});
  }

  static export(args: {ids: number[]}): Promise<AxiosResponse> {
    return httpApi.post('/wp-admin/admin-ajax.php?action=ev_users_export', {ids: args.ids});
  }


  static rememberPassword(email: string, locale: string): Promise<AxiosResponse<WpRestResponse<null>>> {
    return restApi.post(`${RESTVersion.default().namespace}/auth/remember_password`, {email, locale});
  }
  static accountRecover(args: {name: string, email: string, phone: string, message: string, locale: string}): Promise<AxiosResponse<WpRestResponse<null>>> {
    return restApi.post(`${RESTVersion.default().namespace}/auth/account_recover`, {...args});
  }
  static updatePassword(id: number, password: string): Promise<AxiosResponse<WpRestResponse<null>>> {
    return restApi.post(`${RESTVersion.default().namespace}/users/${id}/password_update`, {password});
  }

  static consent(args: {userId: number; consents:any[]}) {
    return restApi.post(`${RESTVersion.default().namespace}/users/${args.userId}/consents`, {consents: args.consents});
  }

  static notify(args: {context: NotificationTypes; ids: number[]; coauthors?:boolean; subject: string;
    message: string; merge: boolean; template: string}): Promise<AxiosResponse<WpRestResponse<null>>> {
      return restApi.post(`${RESTVersion.default().namespace}/notifications/send`, {
        context: args.context,
        ids: args.ids,
        coauthors: args.coauthors || false,
        subject: args.subject,
        message: args.message,
        merge: args.merge || false,
        template: args.template || '',
      });
  }

  static switchTo(args: {
    user_id: number
  }): Promise<
    AxiosResponse<
      WpRestResponse<{
        authToken?: string,
        refreshToken?: string,
        msg?: string
      }>
    >
  > {
    return restApi.post(`${RESTVersion.default().namespace}/users/switch`, {
      switch_to: args.user_id
    })
  }


  
  static activities(args: {user_id: number, edition: string}): Promise<AxiosResponse<WpRestResponse<any>>>{
    const qs = [];
    if (args.edition) {
      qs.push(`edition=${args.edition}`);
    }
    return restApi.get(`${RESTVersion.default().namespace}/users/${args.user_id}/activities?${qs.join("&")}`);
  }

}
