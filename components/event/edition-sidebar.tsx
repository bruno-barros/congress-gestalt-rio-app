import { Edition } from '../../src/resources/event';
import Image from "next/image";
import moment from "moment";
import useTrans from "../hooks/useTrans";
import useCurrentUser from "../hooks/useCurrentUser";
import useUserOrders from "../hooks/useUserOrders";
import useEvent from "../hooks/useEvent";
import BadgeSubscribed from "../ui/badge-subscribed";
import Link from "next/link";

interface EditionSidebarProps {
  edition: Edition
}

export default function EditionSidebar(props: EditionSidebarProps) {

  const {edition: ed} = props
  const edition = Edition.make(ed, {})
  const t = useTrans()
  const {user} = useCurrentUser()
  const {data: event, isLoading} = useEvent()
  const {data: orders, isLoading: ordersLoading} = useUserOrders(user?.getId())
  const isCurrent = event?.currentEdition()?.id === edition.id
  const isSubscribed = orders?.hasValidSubscription(edition)

  return (<div className="p-4">
    <figure className="figure-img bg-white p-3">
      {edition?.logoPrimary &&
      <Image src={edition?.logoPrimary} objectFit="contain" width={300} height={250} className="img-fluid"/>}

    </figure>
    <div className="">
      {isSubscribed && <BadgeSubscribed/>}
      <p>{edition.name}</p>
      <p>{moment(edition.start_at).format('DD/MM/YYYY')} — {moment(edition.end_at).format('DD/MM/YYYY')}</p>
      {edition.isOpenToSubscribe()
      ? (<>
      {(isCurrent && user.canPublishAbstracts() && !isSubscribed) &&
      <p><Link href={`/register2`} passHref>
        <a className="btn btn-block btn-outline-primary">{t('fazer-inscricao')}</a>
      </Link></p>}
      </>)
      : (``)}
      <p><Link href={`/profile?tab=subscriptions`} passHref><a className="text-sm">{t('gerenciar-inscricoes')}</a></Link></p>


    </div>
  </div>)
}
