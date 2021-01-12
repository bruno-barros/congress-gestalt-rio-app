import {AxiosResponse} from "axios";
import {httpApi} from "./axios";
import {LoginInputs} from "../store/store.d";
import isFinite from 'lodash/isFinite'
import {Providers} from '../../components/social-login/social-buttons.d'
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
    return httpApi.post('/wp-admin/admin-ajax.php?action=ev_save_remote', {user_id: userId, token});
  }

  static signUpWithEmail(values: any, locale: string){
    return httpApi.post('/wp-admin/admin-ajax.php?action=ev_signup_with_email', {...values, locale});
  }

  static socialLogin(profile: any, provider: Providers, locale: string){
    return httpApi.post('/wp-admin/admin-ajax.php?action=ev_social_login', {...profile, provider, locale});
  }

  static mergeProfiles(profile: any, provider: Providers, locale: string){
    let merging_url = `${window.location.protocol}//${window.location.host}/merging`
    return httpApi.post('/wp-admin/admin-ajax.php?action=ev_merge_profiles', {...profile, provider, merging_url, locale});
  }

  static mergeApproved(uuid: any){
    return httpApi.post('/wp-admin/admin-ajax.php?action=ev_merge_approved', {uuid});
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
  static fetchUser(id: any): Promise<AxiosResponse<any>> {

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
        user(id: "${id}", idType: ${type}) {
          id
          databaseId
          phone
          name
          gender
          firstName
          email
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
          passport
          locale
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

  static fetchProfessionals(orderBy = 'name', order = 'asc', page = 1, limit = 12, filters?: any): Promise<AxiosResponse<any>> {

    let filtersQry: string[] = [];
    if (!!filters?.by_name) filtersQry.push(`by_name: "${filters?.by_name}"`)
    if (!!filters?.by_weekday) filtersQry.push(`by_weekday: "${filters?.by_weekday}"`)

    return httpApi.post('/index.php?graphql&zbUserSearch', {
      query: `query fetchProfessionals {
  __typename
  zbUserSearch(where: {pagination: {limit: ${limit}, page: ${page}}, orderby: ${orderBy}, order: ${order.toUpperCase()}, roles: professional, ${filtersQry.join(', ')}}) {
    nodes {
      id
      databaseId
      specialities
      phone
      name
      gender
      firstName
      email
      doc_prof
      description
      cpf
      user_status
      roles {
        nodes {
          name
        }
      }
      avatar {
        url
      }
      timeframes {
        wednesday
        tuesday
        thursday
        sunday
        saturday
        friday
        monday
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

  static searchUser(args: {by_name?: string, role?: 'subscriber'|'contributor'| 'editor'| 'administrator', limit?:number, filters?: any}): Promise<AxiosResponse<any>> {

    let byName = args?.by_name ? `, by_name: "${args.by_name}"` : ''
    let limit = args?.limit || 12
    let role = args.role || 'any'

    return httpApi.post('/index.php?graphql&searchUser', {
      query: `query searchUser {
  __typename
  evUserSearch(where: {pagination: {limit: ${limit}, page: 1}, orderby: name, order: ASC, roles: ${role} ${byName}}) {
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

  static all(): Promise<AxiosResponse<any>> {
    return httpApi.post('/index.php?graphql&all', {
      query: `query all {
  __typename
  users(where: {roleIn: [ADMINISTRATOR, AUTHOR, CONTRIBUTOR, SUBSCRIBER, EDITOR], orderby: {field: REGISTERED, order: DESC}}, first: 1000) {
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

  static update(data: any) {
    return httpApi.post('/wp-admin/admin-ajax.php?action=ev_update_user', {...data});
  }

  static export(args: {ids: number[]}): Promise<AxiosResponse> {
    return httpApi.post('/wp-admin/admin-ajax.php?action=ev_users_export', {abstracts: args.ids});
  }

  static sendInvitation(args: any) {
    return httpApi.post('/wp-admin/admin-ajax.php?action=ev_send_invitation', {...args});
  }

  static rememberPassword(email: string, locale: string) {
    return httpApi.post('/wp-admin/admin-ajax.php?action=ev_remember_password', {email, locale});
  }
  static updatePassword(id: number, password: string) {
    return httpApi.post('/wp-admin/admin-ajax.php?action=ev_update_password', {id, password});
  }

  static unblock(userId: number) {
    return httpApi.post('/wp-admin/admin-ajax.php?action=ev_update_user_status', {
      user_id: userId, status: 0
    });
  }
  static block(userId: number) {
    return httpApi.post('/wp-admin/admin-ajax.php?action=ev_update_user_status', {
      user_id: userId, status: 1
    });
  }


}
