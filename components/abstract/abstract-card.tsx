import {Icon} from "@brunobarros/react-components";

interface AbstractCardProps {

}

export default function AbstractCard(props: AbstractCardProps) {

  return (<div className="abstract-card">
    <div className="abs-header">
      <div className="abs-text">
        <div className="abs-title">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Lorem ipsum dolor sit amet, consectetur adipisicing elit.</div>
        <div className="abs-desc">Consequatur doloremque doloribus eligendi error ex facilis</div>
      </div>
      <div className="abs-status"></div>
    </div>
    <div className="abs-footer">
      <div className="btn-group start">
        <div  className="btn bg-success">Rejeitado</div>
        <button className="btn border"><Icon name={`chatbox-outline`}/> Comentários (2)</button>
        <button className="btn border"><Icon name={`folder-outline`}/> Anexos (1)</button>
      </div>
      <div className="abs-info mr-3">
        00/00/0000
      </div>
    </div>
  </div>)
}
