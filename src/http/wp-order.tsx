import {AxiosResponse} from "axios";
import {httpApi} from "./axios";
export default class WpOrder {

  static byUser(input: {user_id: number}): Promise<AxiosResponse> {
    return httpApi.post('/index.php?graphql&orders', {
      query: `query byUser {
  orders(where: {customerId: ${input.user_id}, orderby: {field: DATE, order: DESC}}) {
    nodes {
      databaseId
      currency
      date
      dateCompleted
      paymentMethodTitle
      total
      status
      lineItems {
        nodes {
          product {
            databaseId
            name
            productCategories {
              nodes {
                databaseId
                name
                slug
              }
            }
          }
        }
      }
    }
  }
 }`
    });
  }

}
