import {User} from "../../src/resources/user";
import useUserOrders from "../hooks/useUserOrders";
import OrderLine from "../order/order-line";
import Link from "next/link";
import useTrans from "../hooks/useTrans";
import useEvent from "../hooks/useEvent";
import Loading from "../ui/loading";
import useSettings from "../hooks/useSettings";
import { dump } from "../../src/helpers";
import useUserCertificates from "../hooks/useUserCertificates";
import CertificateLine from "../certificates/certificate-line";


export default function MyCertificates({user}: { user: User }) {


    const t = useTrans()
    // const {data: event} = useEvent()
    // const edition = event && event.currentEdition()
    const { data: event, currentEdition: edition } = useSettings()
    const {data, error, isLoading} = useUserCertificates(user.getId(), edition?.getId())
    const certCnf = edition?.Certificate()
    const isCertAllowed = certCnf?.participation_allowed

//   const isSubscriptionOpened = edition?.isOpenToSubscribe()
//   const completedProfile = user.hasMinimumRegisteredFields()

  if (isLoading) {
    return <Loading vspace={80}/>
  }

  if(!isCertAllowed){
    return <div className="px-5 py-3">
        <div className="alert alert-warning">{t('certificado.nao-disponivel')}</div>
    </div>
  }

  return (<div className="">
    {/* {dump({...data})} */}

    {(data && data.length > 0) 
        ? data.map((cert, i) => {
        return (<CertificateLine key={i} certificate={cert}/>)
        }) 
    : <div className="px-5"><p>{t('voce-nao-tem-inscricoes')}</p></div>}

  </div>)
}
