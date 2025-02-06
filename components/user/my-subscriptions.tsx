import {User} from "../../src/resources/user";
import useUserOrders from "../hooks/useUserOrders";
import OrderLine from "../order/order-line";
import Link from "next/link";
import useTrans from "../hooks/useTrans";
import useEvent from "../hooks/useEvent";
import Loading from "../ui/loading";
import useSettings from "../hooks/useSettings";
import { dump } from "../../src/helpers";


export default function MySubscriptions({user}: { user: User }) {

  const {data, error, isLoading} = useUserOrders(user.getId())
  const collection = data && data.getOrders() || null
  const t = useTrans()
  // const {data: event} = useEvent()
  // const edition = event && event.currentEdition()
  const { data: event, currentEdition: edition } = useSettings()
  const isSubscribed = data?.hasValidSubscription(edition)
  const isSubscriptionOpened = edition?.isOpenToSubscribe()
  const completedProfile = user.hasMinimumRegisteredFields()

  if (isLoading) {
    return <Loading vspace={80}/>
  }

  return (<div className="">
    {/* {dump({...data})} */}

    <div className="px-5 py-3">
      {!completedProfile && 
        <div className="alert alert-warning">Você só poderá se inscrever após <Link href={`/profile?tab=personal`}>completar seu perfil</Link>.</div>}
      {(isSubscriptionOpened && completedProfile && !isSubscribed) && 
        <Link href="/register2" passHref><a className="btn btn-primary" >{t('fazer-inscricao')}</a></Link>}
      {!isSubscriptionOpened && 
        <div className="alert alert-warning">As inscrições ainda não estão abertas</div>}
      {/* {isSubscriptionOpened
        ? (<>{!isSubscribed
          && <Link href="/register2" passHref><a className="btn btn-primary" >{t('fazer-inscricao')}</a></Link>}</>)
        : (<div className="alert alert-warning">As inscrições ainda não estão abertas</div>)} */}

    </div>

    {(collection && collection.length > 0) ? collection.map(order => {
      return (<OrderLine key={order.getId()} order={order}/>)
    }) : <div className="px-5"><p>{t('voce-nao-tem-inscricoes')}</p></div>}

  </div>)
}
