import {AbstractType} from "./abstract.d";
import useTrans from "../hooks/useTrans";
import moment from "moment";
import Abstract from "../../src/resources/abstract";
import Link from "next/link";
import useEvent from "../hooks/useEvent";
import {useRouter} from "next/router";
import Icon from "../ui/ionicon";

interface AbstractCardProps {
  abstract: AbstractType
}

export default function AbstractCard(props: AbstractCardProps) {

  const router = useRouter()
  const {abstract: data} = props
  const abstract: Abstract = Abstract.make(data)
  const t = useTrans()
  const {data: event} = useEvent()
  const edition = event.getEdition(abstract.edition_id)

  function statusColor(){
    let color = abstract.statusColorName()
    if(color === 'warning') return 'bg-secondary text-white'
    if(color === 'secondary') return 'bg-warning'
    if(color === 'success') return 'bg-success text-white'
    if(color === 'danger') return 'bg-danger text-white'
    if(color === 'info') return 'bg-info text-white'
  }

  return (<div className="abstract-card">
    <div className="abs-header">
      <Link href={`/abstracts/${abstract.databaseId}`} passHref><a className="abs-text">
        <div className="abs-title">({abstract.databaseId}) {abstract.title}</div>
        <div className="abs-desc mb-1">{abstract.subtitle}</div>
        <small className="d-block font-italic">({abstract.type}) {edition.abstract.topics.find(top => top.id === abstract.topic)?.[router.locale] || ''}</small>
      </a></Link>
      <div className="abs-status">
        {abstract.isLockedToEdition() ? <Icon name={`lock-closed-outline`}/> : <Icon name={`pencil-outline`}/>}
      </div>
    </div>
    <div className="abs-footer">
      <div className="btn-group start">
        <div className={`btn ${statusColor()}`} style={{cursor: 'default'}}>{t(`status.${abstract.status}`)}</div>
        <Link href={`/abstracts/${abstract.databaseId}`} passHref><a className="btn border d-none d-md-block">
          <Icon name={`chatbox-outline`}/> {t('comentarios')} {`(${abstract.evaluations_count})`}
        </a></Link>
        <Link href={`/abstracts/${abstract.databaseId}`} passHref><a className="btn border d-none d-md-block">
          <Icon name={`folder-outline`}/> {t('anexos')} {`(${abstract.attachments_count})`}
        </a></Link>
      </div>
      <div className="abs-info mr-3">
        {moment(abstract.date).format('DD/MM/YYYY')}
      </div>
    </div>
  </div>)
}
