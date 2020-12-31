import {AxiosResponse} from "axios";
import {httpApi} from "../axios";
import {LoginInputs} from "../../store/store.d";

export default class Wordpress {
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
    return httpApi.post('/index.php?graphql', {
      query: `mutation LoginUser {
        login(input: {clientMutationId: "${input.login}", username: "${input.login}", password: "${input.password}"}) {
          authToken
          refreshToken
          user {
            id
            databaseId
            name
            email
            locale
            roles {
              nodes {
                name
              }
            }
          }
        }
      }`
    });
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
  static refreshToken(mutationId: number, token: string): Promise<AxiosResponse<any>>{
    return httpApi.post('/index.php?graphql', {
      query: `mutation RefreshToken {
      refreshJwtAuthToken(input: {clientMutationId: "${mutationId}", jwtRefreshToken: "${token}"}) {
        clientMutationId
        authToken
      }
    }`
    });
  }

  /**
   * {
      "data": {
        "__typename": "RootQuery",
        "user": {
          "avatar": {
            "url": "http://0.gravatar.com(...)&d=mm&r=g"
          },
          "email": "web@mail.com",
          "id": "dXNlcjox",
          "name": "admin",
          "roles": {
            "nodes": [
              {
                "name": "administrator"
              }
            ]
          }
        }
      }
    }
   * @param databaseId
   */
  static fetchUser(databaseId: number): Promise<AxiosResponse<any>>{
    return httpApi.post('/index.php?graphql', {
      query: `query FetchUser {
        __typename
        user(id: "${databaseId}", idType: DATABASE_ID) {
          avatar {
            url
          }
          databaseId
          email
          id
          name
          roles {
            nodes {
              name
            }
          }
        }
      }`
    });
  }

}
