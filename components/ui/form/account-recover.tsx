import Modal from "react-bootstrap/cjs/Modal";
import {useEffect, useRef, useState} from "react";
import useTrans from "../../hooks/useTrans";
import {toast} from "react-toastify";
import {Field, Form, Formik, FormikProps} from "formik";
import * as Yup from "yup";
import WpUser from "../../../src/http/wp-user";
import {useRouter} from "next/router";
import Curtain from "../curtain";
import CurtainDelayed from "../curtain-delayed";
import Text from "./formik/text";
import Textarea from "./formik/textarea";
import LoadingButton from "../loading-button";

interface AccountRecoverProps {
  show: boolean

  onDismiss(): void
}

export default function AccountRecover(props: AccountRecoverProps) {

  const router = useRouter()
  const {onDismiss} = props
  const [show, setShow] = useState(props.show)
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState({success: null, msg: ''})
  const t = useTrans()
  let formRef = useRef<FormikProps<any>>()

  const FormSchema = Yup.object().shape({
    name: Yup.string().required('validacao.obrigatorio'),
    email: Yup.string().email('validacao.email').required('validacao.obrigatorio'),
    phone: Yup.string().required('validacao.obrigatorio'),
    message: Yup.string().required('validacao.obrigatorio'),
  });

  useEffect(() => {
    setShow(props.show)
  }, [props.show])


  async function handleSubmit(values) {
    setLoading(true)
    setResponse({success: null, msg: ''})

    try {
      const resp = await WpUser.accountRecover({
        name: values.name,
        email: values.email,
        phone: values.phone,
        message: values.message,
        locale: router.locale
      })
      const success = resp.data.success
      const data = resp.data?.data
      setLoading(false)
      setResponse({success, msg: data?.msg})
      formRef.current.resetForm()
    } catch (err) {
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
      <Modal.Title>{t('cadastro.recuperacao-de-conta')}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <CurtainDelayed delay={1}>
        <Formik innerRef={formRef}
                initialValues={{name: '', email: '', phone: '', message: ''}}
                onSubmit={handleSubmit}
                validationSchema={FormSchema}
        >
          {({errors, touched, values, isValid}) => (<Form>
            <Text name="name" label={t('cadastro.nome')}/>
            <Text name="email" label="E-mail"/>
            <Text name="phone" label={t('cadastro.telefone')}/>
            <Textarea name="message" label={t('cadastro.descreva-sua-dificuldade')}/>
            <LoadingButton disable={!isValid} loading={loading}>{t('enviar-mensagem')}</LoadingButton>

          </Form>)}
        </Formik>

        <Curtain isOpened={response.msg.length > 0}>
          <div className={`alert ${response.success ? 'alert-success' : 'alert-warning'} mb-0 mt-3`}>
            {response.msg}
          </div>
        </Curtain>

      </CurtainDelayed>
    </Modal.Body>
  </Modal>)
}
