import {Icon} from "@brunobarros/react-components";
import {AbstractType} from "./abstract.d";
import useTrans from "../hooks/useTrans";
import moment from "moment";
import Abstract from "../../src/resources/abstract";
import Link from "next/link";

interface AbstractCardProps {
  abstract: AbstractType
}

export default function AbstractCard(props: AbstractCardProps) {

  const {abstract: data} = props
  const abstract: Abstract = Abstract.make(data)
  const t = useTrans()

  function statusColor(){
    let color = abstract.statusColorName()
    if(color === 'warning') return 'bg-warning'
    if(color === 'success') return 'bg-success text-white'
    if(color === 'danger') return 'bg-danger text-white'
  }

  return (<div className="abstract-card">
    <div className="abs-header">
      <Link href={`/abstracts/${abstract.databaseId}`} passHref><a className="abs-text">
        <div className="abs-title">{abstract.title}</div>
        <div className="abs-desc">{abstract.subtitle}</div>
      </a></Link>
      <div className="abs-status">
        {abstract.isLockedToEdition() ? <Icon name={`lock-closed-outline`}/> : <Icon name={`pencil-outline`}/>}
      </div>
    </div>
    <div className="abs-footer">
      <div className="btn-group start">
        <div className={`btn ${statusColor()}`} style={{cursor: 'default'}}>{t(`status.${abstract.status}`)}</div>
        <button className="btn border d-none d-md-block">
          <Icon name={`chatbox-outline`}/> {t('comentarios')} {`(${abstract.evaluations_count})`}
        </button>
        <button className="btn border d-none d-md-block">
          <Icon name={`folder-outline`}/> {t('anexos')} {`(${abstract.attachments_count})`}
        </button>
      </div>
      <div className="abs-info mr-3">
        {moment(abstract.date).format('DD/MM/YYYY')}
      </div>
    </div>
  </div>)
}
