import  Edition from "../../src/resources/edition";
import Image from "next/image";
import moment from "moment";
import useTrans from "../hooks/useTrans";
import useCurrentUser from "../hooks/useCurrentUser";
import useUserOrders from "../hooks/useUserOrders";
import useEvent from "../hooks/useEvent";
import BadgeSubscribed from "../ui/badge-subscribed";
import Link from "next/link";
import useConsent from "../../components/hooks/useConsent";
import useSettings from "../hooks/useSettings";

interface EditionSidebarProps {
  edition: Edition;
}

export default function EditionSidebar(props: EditionSidebarProps) {
  const { edition } = props;
  // const edition = Edition.make(ed, {});
  const t = useTrans();
  const { user } = useCurrentUser();
  const { data: event, isLoading, currentEdition } = useSettings();
  const { data: orders, isLoading: ordersLoading } = useUserOrders(
    user?.getId()
  );
  const isCurrent = currentEdition?.getId() === edition?.getId();
  const isSubscribed = orders?.hasValidSubscription(edition);
  const consent = useConsent();

  return (
    <div className="p-4">
      <figure className="figure-img bg-white p-3">
        {edition?.getLogo() && (<img src={edition?.getLogo()} className="img-fluid" />)}
      </figure>
      <div className="">
        {isSubscribed && <BadgeSubscribed />}
        <p>{edition?.name}</p>
        <p>
          {moment(edition?.start_at).format("DD/MM/YYYY")} —{" "}
          {moment(edition?.end_at).format("DD/MM/YYYY")}
        </p>
        {edition?.isOpenToSubscribe() ? (
          <>
            {isCurrent && user.canPublishAbstracts() && !isSubscribed && (
              <p>
                <Link href={`/register2`} passHref>
                  <a className="btn btn-block btn-outline-primary">
                    {t("fazer-inscricao")}
                  </a>
                </Link>
              </p>
            )}
          </>
        ) : (
          ``
        )}
        <p className="mb-1">
          <Link href={`/profile?tab=subscriptions`} passHref>
            <a className="text-sm">{t("gerenciar-inscricoes")}</a>
          </Link>
        </p>
        {edition?.hasConsent() &&
        <p>
            <a href="#" onClick={(e)=>{
              e.preventDefault()
              consent.show();
            }} className="text-sm">{t('gerenciar-consentimento')}</a>
        </p>}



      </div>
    </div>
  );
}
