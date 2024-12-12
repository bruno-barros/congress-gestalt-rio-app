import { useState } from "react";
import { DocumentSchema } from "../../src/types/document";
import WpDocument from "../../src/http/wp-document";
import { toast } from "react-toastify";
import PopOver from "../ui/popover";
import Button from "react-bootstrap/Button";
import Loading from "../ui/loading";
import Icon from "../ui/ionicon";

interface DeleteButtonProps {
    doc: DocumentSchema
    onDeleted: () => void
}
export default function DeleteButton(props: DeleteButtonProps) {
const {doc, onDeleted} = props
const [loading, setLoading] = useState(false);


function YesOrNo({doc}: {doc: DocumentSchema}){
    return <div className="d-flex align-items-center gap-2">
      <button className="badge badge-primary badge-pill border-0" onClick={() => handleDeletion(doc)}>Apagar</button>
      <button className="badge badge-danger badge-pill border-0" onClick={handleCancelDeletion}>Cancelar</button>
    </div>
  }
  function handleDeletion(doc: DocumentSchema){
    setLoading(true)
    WpDocument.delete(doc.id)
    .then(axios => {
      const resp = axios.data
      if(resp.success) toast.success('Documento apagado com sucesso')
      else toast.error(resp.data.msg)
    })
    .finally(() => {
      setLoading(false)
      onDeleted?.()
    })
    // console.log(doc)
  }
  function handleCancelDeletion(e: any){
    e.preventDefault();
    document.querySelector('body').click()
  }

  return <>
  <PopOver text={<YesOrNo doc={doc} />} trigger="click" position="left">
  <Button variant="outline-danger" size="sm">
    {loading ? <Loading size="sm" variant="danger" /> : <Icon name="trash" />}
  </Button>
  </PopOver>
</>

}