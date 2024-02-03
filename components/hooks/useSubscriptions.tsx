import {useQuery, useQueryClient} from "react-query";
import {errorNotification} from "../../src/resources/responses";
import useCurrentUser from "./useCurrentUser";
import WpOrder from "../../src/http/wp-order";
import {OrderCollection} from "../../src/resources/order";
import useEvent from "./useEvent";
import {Edition} from "../../src/resources/event";
import moment from "moment";

export default function useSubscriptions(edition?: Edition) {

  const {user} = useCurrentUser()
  const queryClient = useQueryClient()

  const s = moment(edition?.subscription.start_at)
  const e = moment(edition?.subscription.end_at)

  function queryData(): Promise<OrderCollection|null> {
    return new Promise((resolve, reject) => {
      WpOrder.subscriptions({
        metadata: ["is_pdc","pdc_needs","is_child_care", "allow_newsletter", "badge_name"],
        dateStart: {
          day: Number(s.format('DD')),
          month: Number(s.format('MM')),
          year: Number(s.format('YYYY')),
        },
        dateEnd: {
          day: Number(e.format('DD')),
          month: Number(e.format('MM')),
          year: Number(e.format('YYYY')),
        }
      }).then(resp => {
        if (resp.data.data?.orders?.nodes) {
          queryClient.setQueryData('payment_methods', resp.data.data.paymentGateways.nodes)
          // queryMethods(resp.data.data.paymentGateways.nodes)
          resolve(OrderCollection.make(resp.data.data.orders.nodes))
        } else {
          reject(null)
          errorNotification({error: resp.data.errors})
        }
      }, err => {
        reject(null)
        errorNotification({error: err})
      })
    })
  }

  function queryMethods(){
      return new Promise((resolve)=>{
        resolve([])
      })
  }

  const methods = useQuery('payment_methods', queryMethods, {staleTime: Infinity})

  const subscriptions = useQuery<OrderCollection|null, any>(['subscriptions', edition?.id], queryData, {
    enabled: user.canManageAbstracts() && !! edition?.id,
    staleTime: Infinity
  })

  return {...subscriptions, methods}

}
