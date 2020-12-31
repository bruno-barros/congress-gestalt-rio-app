import {Edition} from "../../src/resources/event";
import Image from "next/image";
import moment from "moment";
import useTrans from "../hooks/useTrans";

interface EditionSidebarProps {
  edition: Edition
}

export default function EditionSidebar(props: EditionSidebarProps) {

  const {edition} = props
  const t = useTrans()

  return (<div className="p-4">
    <figure className="figure-img bg-white p-3">
      <Image src={edition.logoPrimary} objectFit="contain" width={300} height={250} className="img-fluid"/>
    </figure>
    <div className="">
      <p>{edition.name}</p>
      <p>{moment(edition.start_at).format('DD/MM/YYYY')} — {moment(edition.end_at).format('DD/MM/YYYY')}</p>
      <p><button className="btn btn-outline-primary">{t('fazer-inscricao')}</button></p>
    </div>
  </div>)
}
