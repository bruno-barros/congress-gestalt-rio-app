import {User} from "../../src/resources/user";
import useUserOrders from "../hooks/useUserOrders";
import OrderLine from "../order/order-line";
import {Loading} from "@brunobarros/react-components";


export default function MySubscriptions({user}: { user: User }) {

  const {data, error, isLoading} = useUserOrders(user.getId())
  const collection = data && data.getOrders() || null

  if (isLoading) {
    return <Loading vspace={80}/>
  }

  return (<div className="">

    {(collection && collection.length > 0) && collection.map(order => {
      return (<OrderLine key={order.getId()} order={order}/>)
    })}

  </div>)
}
