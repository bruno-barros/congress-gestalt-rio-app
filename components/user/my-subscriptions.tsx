import {User} from "../../src/resources/user";
import useUserOrders from "../hooks/useUserOrders";
import OrderLine from "../order/order-line";
import {Loading} from "@brunobarros/react-components";
import Link from "next/link";
import useTrans from "../hooks/useTrans";


export default function MySubscriptions({user}: { user: User }) {

  const {data, error, isLoading} = useUserOrders(user.getId())
  const collection = data && data.getOrders() || null
  const t = useTrans()

  if (isLoading) {
    return <Loading vspace={80}/>
  }

  return (<div className="">

    {(collection && collection.length > 0) && collection.map(order => {
      return (<OrderLine key={order.getId()} order={order}/>)
    })}

    {(collection && collection.length === 0) && <div className="p-5">
      <p>{t('voce-nao-tem-inscricoes')}</p>
      <p><Link href="/register2" passHref><a className="btn btn-primary">{t('fazer-inscricao')}</a></Link></p>
    </div>}

  </div>)
}
