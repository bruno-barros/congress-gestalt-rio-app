import {AxiosResponse} from "axios";
import {httpApi} from "./axios";

export default class WpEcommerce {

  static categories(args?: {  }): Promise<AxiosResponse> {
    return httpApi.post('/index.php?graphql&productCategories', {
      query: `query productCategories {
        productCategories {
            nodes {
                databaseId
                description
                id
                image {
                    url: sourceUrl
                }
                name
                parentId
                parentDatabaseId
                slug
            }
        }
 }`
    });
  }


  static products(args?: { categoryId: number }): Promise<AxiosResponse> {
    return httpApi.post('/index.php?graphql&products', {
      query: `query products {
        products(where: {categoryId: ${args?.categoryId}}) {
          nodes {
            databaseId
            description(format: RENDERED)
            shortDescription(format: RENDERED)
            featured
            id
            image {
              url: sourceUrl
            }
            link
            name
            status
            type
            ... on SimpleProduct {
              id
              name
              price(format: RAW)
              salePrice(format: RAW)
              regularPrice(format: RAW)
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
