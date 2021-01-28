import {useQuery} from "react-query";
import WpOrder from "../../src/http/wp-order";
import {Order, OrderCollection} from "../../src/resources/order";

export default function useUserOrders(userId: number | null){

  function queryOrders(): Promise<OrderCollection|null> {
    return new Promise((resolve, reject) => {
      WpOrder.byUser({user_id: userId})
        .then(resp => {
          if (resp.data?.data?.orders?.nodes) {
            resolve(OrderCollection.make(resp.data.data.orders.nodes))
          } else {
            resolve(null)
          }
        }, err => {
          resolve(null)
        })
    })
  }

  return useQuery<OrderCollection|null, any>(['orders', userId], queryOrders, {
    enabled: !!userId && userId > 0,
    staleTime: Infinity
  })
}
