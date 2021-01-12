import {AxiosResponse} from "axios";
import {httpApi} from "./axios";

export default class WpOrder {

  static byUser(input: { user_id: number }): Promise<AxiosResponse> {
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


  static subscriptions(args: { date?: { start: string, end: string } }): Promise<AxiosResponse> {
    return httpApi.post('/index.php?graphql&subscriptions', {
      query: `query subscriptions {
    orders(where: {dateQuery: {after: {day: 1, month: 10, year: 2020},
        before: {day: 7, month: 1, year: 2021}, inclusive: true}}) {
    nodes {
      databaseId
      currency
      date
      dateCompleted
      paymentMethodTitle
      total
      status
      customer {
        databaseId
        email
        displayName
      }
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
   paymentGateways {
    nodes {
      id
      title
      description
    }
  }
}`
    });
  }

}
