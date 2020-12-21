import {useEffect, useState} from "react";
import useTrans from "../hooks/useTrans";
import {useRouter} from "next/router";
import Modal from "react-bootstrap/cjs/Modal";
import {Loading} from "@brunobarros/react-components";
import WpUser from "../../src/http/wp-user";

interface MergingUsersProps {
  show: boolean
  response?: any

  onDismiss(nextAction?: string): void
}

export default function MergingUsers(props: MergingUsersProps) {

  const {onDismiss, response: res} = props
  const [show, setShow] = useState(props.show)
  const [state, setState] = useState('')
  const t = useTrans()
  const router = useRouter()

  useEffect(() => {
    setShow(props.show)
  }, [props.show])


  function handleClose(e?: any) {
    e && e.hasOwnProperty('preventDefault') && e.preventDefault()
    setShow(false)
    onDismiss && onDismiss(e)
  }

  async function handleMerging(e) {
    e.preventDefault()
    setState('loading')
    const resp = await WpUser.mergeProfiles(res?.current_user, res?.provider)
    if (resp.data.success) {
      setState('done')
    } else {
      setState('error')
    }
  }

  return (<Modal show={show} onHide={handleClose}>
    <Modal.Header closeButton>
      <Modal.Title>Olá, {res?.current_user?.firstName}!</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      {state === 'loading' && <Loading message={`Aguarde...`} vspace={80}/>}
      {state === '' && <div className="">
        <p>Identificamos que já temos um cadastro com o email <strong>{res?.current_user?.email}</strong>.</p>
        <p>Você pode unificar seu login via <strong className="text-uppercase">{res?.provider}</strong> com este
          cadastro.
          (recomendável)</p>
        <p>Se não quiser unificar seu cadastro, você deverá fazer o login com e-mail e senha, ou fazer um{` `}
          <a href="#"
             onClick={(e) => {
               e.preventDefault()
               handleClose('cadastro')
             }}>novo cadastro</a> com outro e-mail. Caso não lembre, faça a <a href="#" onClick={(e) => {
            e.preventDefault()
            handleClose('password')
          }}>recuperação de senha</a>.</p>
      </div>}
      {state === 'done' && <div className="">
        <p>Quase lá!</p>
        <p>Enviamos um e-mail para <strong>{res?.current_user?.email}</strong> que contém um link para validar o
          processo de unificação das contas.</p>
        <p>Clique no link do e-mail para fazer o login via <strong
          className="text-uppercase">{res?.provider}</strong> mantendo seus dados anteriores.</p>
      </div>}
      {state === 'error' && <div className="text-danger">
        <p>Houve um erro no processo.</p>
        <p>Por favor, tente novamente mais tarde ou entre em contato com o suporte.</p>
      </div>}


    </Modal.Body>
    {state !== 'done' && <Modal.Footer>
      <button className="btn btn-outline-secondary" onClick={handleClose} type="button">Voltar</button>
      <button className="btn btn-primary" onClick={handleMerging} type="button">Unificar cadastros</button>
    </Modal.Footer>}

  </Modal>)
}
