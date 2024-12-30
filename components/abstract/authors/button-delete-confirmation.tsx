import { useEffect, useState } from "react"
import useTrans from "../../hooks/useTrans"
import ToolTip from "../../ui/tooltip"
import Icon from "../../ui/ionicon"
import Loading from "../../ui/loading"
import WpAuthor from "../../../src/http/wp-author"
import { AuthorSchema } from "../../../src/types/authors-panel"


interface ButtonDeleteConfirmationProps {
  author: AuthorSchema
  loading?: boolean
  onDelete: () => void
}

export default function ButtonDeleteConfirmation(props: ButtonDeleteConfirmationProps) {

  const t = useTrans()
  const {onDelete, loading: setload, author} = props

  const [state, setState] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(()=>{
    setLoading(!!setload)
  }, [setload])

  async function doDelete() {
    setLoading(true)
    const axios = await WpAuthor.delete(author.id)
    const resp = axios.data
    if(resp.success){
      onDelete()
      setState('deleted')
    }
    setLoading(false)
  }

  return (<div className="">
    {state === '' && !loading &&
    <ToolTip text={t('apagar')}>
      <button type="button" className={`btn btn-sm px-1 py-0`} style={{lineHeight: 0}}
              onClick={() => setState('confirm')}>
        <Icon name={`trash-outline`} style={{fontSize: 20}}/>
      </button>
    </ToolTip>
    }
    {state === 'confirm' && !loading &&
    <div className="btn-group">
      <ToolTip text={t('sim-confirmar')}>
        <button type="button" className={`btn btn-sm btn-outline-success py-0`} style={{lineHeight: 0}} onClick={doDelete}>
          <Icon name={`checkmark-done-outline`} style={{fontSize: 20}}/>
        </button>
      </ToolTip>
      <ToolTip text={t('nao-cancelar')}>
        <button type="button" className={`btn btn-sm btn-outline-danger py-0`} style={{lineHeight: 0}}
                onClick={() => setState('')}>
          <Icon name={`close-outline`} style={{fontSize: 20}}/>
        </button>
      </ToolTip>
    </div>}
    {(state === 'deleted' && !loading) &&
    <div className={`btn btn-sm px-1 py-0`} style={{lineHeight: 0}}>
      <Icon name={`trash-bin-outline`} style={{fontSize: 20}}/>
    </div>}
    {loading &&
    <div className={`btn btn-sm py-0`} style={{lineHeight: 0}}>
      <Loading size="sm"/>
    </div>}

  </div>)
}
