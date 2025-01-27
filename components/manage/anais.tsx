import Card from "react-bootstrap/cjs/Card";
import useEvent from "../hooks/useEvent";
import Button from "react-bootstrap/cjs/Button";
import ProgressBar from "react-bootstrap/cjs/ProgressBar";
import {useCallback, useRef, useState} from "react";
import {WpAbstract} from "../../src/http/wp-abstract";
import {errorNotification} from "../../src/resources/responses";
import isNaN from 'lodash/isNaN'
import useSettings from "../hooks/useSettings";

export default function Anais() {

  const {data: event, currentEdition: edition} = useSettings()
  const editions = event.getEditions()


  function AnaisGenerator({edition}) {

    const [state, setState] = useState<'' | 'fail' | 'generating' | 'success'|'canceled'>('')
    const [total, setTotal] = useState(0)
    const [remaining, setRemaining] = useState(0)
    const [download, setDownload] = useState(null)
    const canceled = useRef(false)

    const calcPercent = useCallback(():number => {
      if (state === 'fail') return 100
      const ttl = ((total - remaining) * 100) / total
      if (isNaN(ttl) || ttl < 5) return 5;
      return Math.round(ttl)
    }, [remaining])

    async function handleGeneration() {

      const resp = await process()

      if(canceled.current){
        errorNotification({message: 'Interrompido pelo usuário'})
        setState('fail')
        await processCancellation()
        setTimeout(()=>{
          setState('')
          canceled.current = false
        }, 4000)
        return ;
      }

      if (resp.data.total === resp.data.remaining) setTotal(resp.data.total)
      setRemaining(resp.data.remaining)

      if (resp.success === false) {
        errorNotification({message: resp.data.msg})
        setState('fail')
      } else if (resp.data.remaining > 0) {
        await handleGeneration()
      } else {
        setTimeout(() => {
          setDownload(resp.data.download)
          setState('success')
        }, 1000)
      }
    }

    async function process(): Promise<any> {
      const resp: any = await WpAbstract.anais({exportEdition: edition.getId()})
      return resp.data
    }
    async function processCancellation(): Promise<any> {
      const resp: any = await WpAbstract.anais({exportEdition: edition.getId(), cancel: true})
      return resp.data
    }

    function handleCancel() {
      canceled.current = true;
    }

    return (<div className="">
      {state === '' &&
      <div className="">
        <Button variant="outline-primary" size="sm" onClick={()=>{
          setState('generating')
          handleGeneration()
        }}>Gerar anais</Button>
      </div>}
      {(state === 'generating' || state === 'fail' || state === 'canceled') &&
      <div className="d-flex align-items-center">
        <div className="flex-grow-1 mr-3">
          <ProgressBar
            variant={`${state === 'fail' ? 'danger' : 'primary'}`} style={{height: 30}} animated
            now={Number(`${state === 'fail' ? 100 : calcPercent()}`)}
            label={`${state === 'fail' ? 'falhou' : calcPercent() + '%'}`}/>
        </div>
        <Button variant="danger" size="sm" onClick={handleCancel}>cancelar</Button>
      </div>}
      {state === 'success' &&
      <div className="">
        <a href={download} className="btn btn-primary" target="_blank">Baixar anais</a>
      </div>}
    </div>)
  }

  return (<div className="">
    <p>Ao gerar o anais as informaçãoes dos trabalhos com status <span
      className="badge badge-success">Aprovado</span> serão salvos em PDF.</p>

    {editions && editions.map(edition => {
      return (<Card key={edition.getId()} className="mb-3">
        <Card.Body>
          <Card.Title className="d-flex justify-content-between">
            <span>{edition.name}</span>
            <span>{edition.year}</span>
          </Card.Title>
          <AnaisGenerator edition={edition}/>
        </Card.Body>
      </Card>)
    })}
  </div>)

}
