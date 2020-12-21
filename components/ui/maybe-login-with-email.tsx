import Modal from "react-bootstrap/cjs/Modal";
import {useEffect, useState} from "react";
import useTrans from "../hooks/useTrans";
import {Trans} from "react-i18next";
import {useRouter} from "next/router";


interface MaybeLoginWithEmailProps {
  show: boolean
  originalMessage: string

  onDismiss(): void
}

export default function MaybeLoginWithEmail(props: MaybeLoginWithEmailProps) {
  const {onDismiss, originalMessage} = props
  const [show, setShow] = useState(props.show)
  const t = useTrans()
  const router = useRouter()

  useEffect(() => {
    setShow(props.show)
  }, [props.show])


  function handleClose(e?:any) {
    e && e.preventDefault()
    setShow(false)
    onDismiss && onDismiss()
  }
  function goToSignUp(e) {
    e && e.preventDefault()
    handleClose()
    router.push(`/cadastro`)
  }

  return (<Modal show={show} onHide={handleClose}>
    <Modal.Header closeButton>
      <Modal.Title>Ops!</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <p>{t('cadastro.autenticacao-social-falhou')}</p>
      <div className="alert alert-warning">{originalMessage}</div>
      <Trans as="p" i18nKey="cadastro.voce-ainda-pode-fazer-login">Não se preocupe! Você ainda pode fazer seu login com um e-mail e senha. Se ainda não fez o seu cadastro, <a href="#" onClick={goToSignUp}>clique aqui e faça agora</a>.</Trans>

    </Modal.Body>
    <Modal.Footer>
      <span className="ml-2"><button className="btn btn-primary" onClick={handleClose} type="button">OK, entendi</button></span>
    </Modal.Footer>
  </Modal>)
}
