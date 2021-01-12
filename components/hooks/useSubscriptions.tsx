import {useQuery, useQueryClient} from "react-query";
import {errorNotification} from "../../src/resources/responses";
import useCurrentUser from "./useCurrentUser";
import WpOrder from "../../src/http/wp-order";
import {OrderCollection} from "../../src/resources/order";

export default function useSubscriptions(editionId: string) {

  const {user} = useCurrentUser()
  const queryClient = useQueryClient()

  function queryData(): Promise<OrderCollection|null> {
    return new Promise((resolve, reject) => {
      WpOrder.subscriptions({
        date: {
          start: '',
          end: ''
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

  const subscriptions = useQuery<OrderCollection|null, any>(['subscriptions', editionId], queryData, {
    enabled: user.canManageAbstracts() && !! editionId,
    staleTime: Infinity
  })

  return {...subscriptions, methods}

}
