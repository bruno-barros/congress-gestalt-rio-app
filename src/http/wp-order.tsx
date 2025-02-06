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
                translation(language: PT) {
                  databaseId
                  slug
                }
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


  static subscriptions(args: {
    dateStart: { day: number; month: number; year: number },
    dateEnd: { day: number; month: number; year: number },
    metadata?: string[]
  }): Promise<AxiosResponse> {

    const afd = args.dateStart.day
    const afm = args.dateStart.month
    const afy = args.dateStart.year
    const bed = args.dateEnd.day
    const bem = args.dateEnd.month
    const bey = args.dateEnd.year
    const metas = args.metadata ? args.metadata.join('","') : ''

    return httpApi.post('/index.php?graphql&subscriptions', {
      query: `query subscriptions {
    orders(where: {dateQuery: {after: {day: ${afd}, month: ${afm}, year: ${afy}},
        before: {day: ${bed}, month: ${bem}, year: ${bey}}, inclusive: true}}, first: 2000) {
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
        metaData(keysIn: ["${metas}"], multiple: false) {
          key
          value
        }
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
                translation(language: PT) {
                  databaseId
                  slug
                }
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
