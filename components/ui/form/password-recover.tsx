import Modal from "react-bootstrap/cjs/Modal";
import {useEffect, useRef, useState} from "react";
import Button from "react-bootstrap/cjs/Button";
import {LoadingButton} from "@brunobarros/react-components";
import {motion} from 'framer-motion';
import useTrans from "../../hooks/useTrans";

interface PasswordRecoverProps {
  show: boolean

  onDismiss(): void
}

export default function PasswordRecover(props: PasswordRecoverProps) {

  const {onDismiss} = props
  const [show, setShow] = useState(props.show)
  const t = useTrans()
  const inputRef = useRef();

  useEffect(() => {
    setShow(props.show)
    if (props.show) {
      setTimeout(() => {
        // @ts-ignore
        inputRef?.current?.focus()
      }, 3000)
    }
  }, [props.show])



  function handleClose() {
    setShow(false)
    onDismiss && onDismiss()
  }

  return (<Modal show={show} onHide={handleClose}>
    <Modal.Header closeButton>
      <Modal.Title>{t('cadastro.recuperacao-senha')}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <p>{t('cadastro.envio-de-link')}</p>
      <motion.div
        initial={{opacity: 0, height: 0}}
        animate={{opacity: 1, height: 'auto'}}
        transition={{opacity: {delay: 2, duration: 1}, height: {delay: 1, duration: 1}}}
      >
        <input ref={inputRef} type="text" className="form-control" placeholder={t('cadastro.email-cadastro')}/>
        <div className="alert alert-success mb-0 mt-3">
          Verifique sua caixa de e-mail.
        </div>
      </motion.div>
    </Modal.Body>
    <Modal.Footer>
      <div className="d-flex justify-content-between align-items-center w-100">
        <a href="#" className="d-inline-block text-sm">{t('cadastro.nao-lembro-email')}</a>
        <div className="d-flex">
          <Button variant="outline-secondary" onClick={handleClose}>{t('fechar')}</Button>
          <span className="ml-2"><LoadingButton loading={false}>{t('cadastro.solicitar-senha')}</LoadingButton></span>
        </div>
      </div>
    </Modal.Footer>
  </Modal>)
}
