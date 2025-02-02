import { useRouter } from "next/router";
import { dump } from "../../src/helpers";
import Abstract from "../../src/resources/abstract";
import Ac from "../access-control";
import { REQUIREMENTS } from "../access-control/requirements";
import useEvent from "../hooks/useEvent";
import useSettings from "../hooks/useSettings";
import useTrans from "../hooks/useTrans";
import Icon from "../ui/ionicon";

interface AbstractViewProps {
  abstract: Abstract
}

export default function AbstractView(props: AbstractViewProps) {

  const {abstract} = props
  const router = useRouter()
  const lang = router.locale
  const t = useTrans()
  const {data: event} = useSettings()
  const edition = abstract.edition_id && event.getEdition(abstract.edition_id) || event && event.currentEdition()
  const AbstractConf = edition?.Abstract()
  const SubtitleField = AbstractConf?.getField('subtitle')
  const TopicField = AbstractConf?.getField('topic')
  const ModalitiesField = AbstractConf?.getField('modalities')
  const TagsField = AbstractConf?.getField('tags')
  const ResumeField = AbstractConf?.getField('resume')
  const ContentField = AbstractConf?.getField('content')
  const BibliographyField = AbstractConf?.getField('bibliography')
  const AttachmentsField = AbstractConf?.getField('attachments')

  return (<div className="">

    <div className="form-group">
      <strong>TÍTULO</strong>
      <div className="border-bottom py-3">{abstract.title}</div>
    </div>
   
    {SubtitleField.allowed &&
    <div className="form-group">
      <strong>SUBTÍTULO</strong>
      <div className="border-bottom py-3">{abstract.subtitle || '-'}</div>
    </div>}

    {TopicField.allowed && 
    <div className="form-group">
      <strong>TÓPICO</strong>
      <div className="border-bottom py-3">{AbstractConf.getTopics()?.find(t => t.id === abstract.topic)[lang]}</div>
    </div>}
    
    {ModalitiesField.allowed && 
    <div className="form-group">
      <strong>MODALIDADE</strong>
      <div className="border-bottom py-3">
        {AbstractConf.getModalities()?.find(t => t.id === abstract.type)?.[lang] || '-'}
        {abstract?.type === 'WS' && <div className="text-muted">
          <div>Qnt. participantes: {Number(abstract?.workshop_participants)}</div>
          {(abstract?.professional_proof && abstract?.professional_proof.length > 0) && <div>Prova profissional: {abstract?.professional_proof.map(d => {
            return <a href={d.url} target="_blank" key={d.id} className="text-info">{d.name}</a>
          })}</div>}
        </div>}
      </div>
    </div>}

    {TagsField.allowed &&
    <div className="form-group">
      <strong>{t('trabalho.tags').toUpperCase()}</strong>
      <div className="py-1">PT: {abstract.abstract_tags?.map((tag, i) => {
        return <div key={i} className="border d-inline-block  px-2 py-0 mr-1 mb-1">{tag}</div>
      })}</div>
      <div className="py-1">ES: {abstract.abstract_tags_es?.map((tag, i) => {
        return <div key={i} className="border d-inline-block  px-2 py-0 mr-1 mb-1">{tag}</div>
      })}</div>
    </div>}

    {ResumeField.allowed && 
    <div className="form-group">
      <strong>{t('trabalho.sinopse').toUpperCase()}</strong>
      <div className="border-bottom py-3" dangerouslySetInnerHTML={{__html: abstract.excerpt}}/>
    </div>}    

    {ContentField.allowed &&
    <div className="form-group">
      <strong>CONTEÚDO</strong>
      <div className="border-bottom py-3" dangerouslySetInnerHTML={{__html: abstract.content}}/>
    </div>}

    {BibliographyField.allowed &&
    <div className="form-group">
      <strong>BIBLIOGRAFIA</strong>
      <div className="border-bottom py-3" dangerouslySetInnerHTML={{__html: abstract.bibliography}}/>
    </div>}

    {AttachmentsField.allowed && 
    <Ac requires={[REQUIREMENTS.abstract.readAttachments]}>
      <div className="form-group">
        <strong>ANEXOS</strong>
        <div className="border-bottom py-3">
          {abstract.attachments?.length > 0 ? abstract.attachments.map(file => (
            <a key={file.id} href={file.url} target="_blank" className="btn btn-outline-info btn-block"><Icon
              name={`download-outline`}/> {file.name}</a>
          )) : 'Nenhum anexo enviado'}
        </div>
      </div>
    </Ac>}   


  </div>)
}
