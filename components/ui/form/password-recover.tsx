import Modal from "react-bootstrap/cjs/Modal";
import {useEffect, useRef, useState} from "react";
import Button from "react-bootstrap/cjs/Button";
import {LoadingButton} from "@brunobarros/react-components";
import {motion} from 'framer-motion';
import useTrans from "../../hooks/useTrans";
import {toast} from "react-toastify";
import {Field, Form, Formik, FormikProps} from "formik";
import * as Yup from "yup";
import FieldError from "./field-error";
import {inputFloatClass} from "../../../src/helpers";
import WpUser from "../../../src/http/wp-user";
import {useRouter} from "next/router";
import Curtain from "../curtain";
import CurtainDelayed from "../curtain-delayed";

interface PasswordRecoverProps {
  show: boolean

  onDismiss(): void
}

export default function PasswordRecover(props: PasswordRecoverProps) {

  const router = useRouter()
  const {onDismiss} = props
  const [show, setShow] = useState(props.show)
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState({success: null, msg: ''})
  const t = useTrans()
  let formRef = useRef<FormikProps<any>>()

  const FormSchema = Yup.object().shape({
    email: Yup.string().email('validacao.email').required('validacao.obrigatorio'),
  });

  useEffect(() => {
    setShow(props.show)
    if (props.show) {
      setTimeout(() => {
        let emailInput = document.getElementById('email')
          emailInput && emailInput.focus()
      }, 3000)
    }
  }, [props.show])


  async function handleSubmit(values) {
    setLoading(true)
      setResponse({success: null, msg: ''})

    try {
      const resp = await WpUser.rememberPassword(values.email, router.locale)
      const success = resp.data.success
      const data = resp.data?.data
      setLoading(false)
      setResponse({success, msg: data?.msg})
      formRef.current.resetForm()
    }catch (err) {
      setLoading(false)
      setResponse({success: false, msg: t('erro-generico')})
    }
  }

  function handleClose() {
    setShow(false)
    setLoading(false)
    setResponse({success: null, msg: ''})
    onDismiss && onDismiss()
  }

  return (<Modal show={show} onHide={handleClose}>
    <Modal.Header closeButton>
      <Modal.Title>{t('cadastro.recuperacao-senha')}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <p>{t('cadastro.envio-de-link')}</p>
      <CurtainDelayed>
        <Formik innerRef={formRef}
          initialValues={{email: ''}}
          onSubmit={handleSubmit}
          validationSchema={FormSchema}
        >
          {({errors, touched, values, isValid}) => (<Form>
            <div className="form-group">
              <Field autoFocus id="email" name="email" className={inputFloatClass(values.email)}
                     placeholder={t('cadastro.email-cadastro')}
                     type="email"/>
              <FieldError message={touched?.email && errors?.email} fieldId="email"/>
            </div>
            <LoadingButton disable={!isValid} loading={loading}>{t('cadastro.solicitar-senha')}</LoadingButton>

          </Form>)}
        </Formik>

        <Curtain isOpened={response.msg.length > 0}>
          <div className={`alert ${response.success ? 'alert-success' : 'alert-warning'} mb-0 mt-3`}>
            {response.msg}
          </div>
        </Curtain>

      </CurtainDelayed>
    </Modal.Body>
    <Modal.Footer>
      <div className="d-flex justify-content-between align-items-center w-100">
        <a href="#" onClick={(e) => {
          e.preventDefault()
          // TODO
          toast.warn('Em desenvolvimento...')
        }} className="d-inline-block text-sm">{t('cadastro.nao-lembro-email')}</a>
        <div className="d-flex">
          <Button variant="outline-secondary" onClick={handleClose}>{t('fechar')}</Button>

        </div>
      </div>
    </Modal.Footer>
  </Modal>)
}
