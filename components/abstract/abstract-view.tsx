import Abstract from "../../src/resources/abstract";
import {Status} from "./abstract.d";
import {Icon} from "@brunobarros/react-components";
import useEvent from "../hooks/useEvent";

interface AbstractViewProps {
  abstract: Abstract
}

export default function AbstractView(props: AbstractViewProps) {

  const {abstract} = props
  const {data: event} = useEvent()
  const edition = abstract.edition_id && event.getEdition(abstract.edition_id) || event && event.currentEdition()

  return (<div className="">

    <div className="form-group">
      <strong>TÍTULO</strong>
      <div className="border-bottom py-3">{abstract.title}</div>
    </div>
    <div className="form-group">
      <strong>SUBTÍTULO</strong>
      <div className="border-bottom py-3">{abstract.subtitle}</div>
    </div>
    <div className="form-group">
      <strong>TÓPICO</strong>
      <div className="border-bottom py-3">{edition.abstract.topics?.find(t => t.id === abstract.topic)['pt']}</div>
    </div>
    {abstract?.abstract_tags?.length > 0 &&
    <div className="form-group">
      <strong>TAGS</strong>
      <div className="py-3">{abstract.abstract_tags?.map((tag, i) => <div key={i}
                                                                          className="border d-inline-block  px-3 py-1 mr-1 mb-1">{tag}</div>)}</div>
    </div>}
    <div className="form-group">
      <strong>RESUMO</strong>
      <div className="border-bottom py-3" dangerouslySetInnerHTML={{__html: abstract.excerpt}}/>
    </div>
    {/*<div className="form-group">*/}
    {/*  <strong>SINOPSE</strong>*/}
    {/*  <div className="border-bottom py-3" dangerouslySetInnerHTML={{__html: abstract.synopsis}}/>*/}
    {/*</div>*/}
    {abstract.content &&
    <div className="form-group">
      <strong>CONTEÚDO</strong>
      <div className="border-bottom py-3" dangerouslySetInnerHTML={{__html: abstract.content}}/>
    </div>}

    {abstract.bibliography &&
    <div className="form-group">
      <strong>BIBLIOGRAFIA</strong>
      <div className="border-bottom py-3" dangerouslySetInnerHTML={{__html: abstract.bibliography}}/>
    </div>}

    {abstract.attachments?.length > 0 &&
    <div className="form-group">
      <strong>ANEXOS</strong>
      <div className="border-bottom py-3">
        {abstract.attachments.map(file => (
          <a key={file.id} href={file.url} target="_blank" className="btn btn-light btn-block"><Icon
            name={`download-outline`}/> {file.name}</a>
        ))}
      </div>
    </div>}


  </div>)
}
