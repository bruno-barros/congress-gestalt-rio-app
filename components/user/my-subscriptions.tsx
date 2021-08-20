import {User} from "../../src/resources/user";
import useUserOrders from "../hooks/useUserOrders";
import OrderLine from "../order/order-line";
import {Loading} from "@brunobarros/react-components";
import Link from "next/link";
import useTrans from "../hooks/useTrans";
import useEvent from "../hooks/useEvent";


export default function MySubscriptions({user}: { user: User }) {

  const {data, error, isLoading} = useUserOrders(user.getId())
  const collection = data && data.getOrders() || null
  const t = useTrans()
  const {data: event} = useEvent()
  const edition = event && event.currentEdition()
  const isSubscribed = data?.hasValidSubscription(edition)

  if (isLoading) {
    return <Loading vspace={80}/>
  }

  return (<div className="">


    <div className="px-5 py-3">
      {edition.isOpenToSubscribe()
        ? (<>{!isSubscribed
          && <Link href="/register2" passHref><a className="btn btn-primary">{t('fazer-inscricao')}</a></Link>}</>)
        : (<div className="alert alert-warning">As inscrições ainda não estão abertas</div>)}

    </div>

    {(collection && collection.length > 0) ? collection.map(order => {
      return (<OrderLine key={order.getId()} order={order}/>)
    }) : <div className="px-5"><p>{t('voce-nao-tem-inscricoes')}</p></div>}

  </div>)
}
