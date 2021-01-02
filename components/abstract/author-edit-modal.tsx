import {useRouter} from "next/router";
import {useEffect, useRef, useState} from "react";
import useTrans from "../hooks/useTrans";
import {Field, Form, Formik, FormikProps} from "formik";
import * as Yup from "yup";
import WpUser from "../../src/http/wp-user";
import Modal from "react-bootstrap/cjs/Modal";
import {motion} from "framer-motion";
import {inputFloatClass} from "../../src/helpers";
import FieldError from "../ui/form/field-error";
import Curtain from "../ui/curtain";
import {toast} from "react-toastify";
import Button from "react-bootstrap/cjs/Button";
import {LoadingButton} from "@brunobarros/react-components";
import Text from "../ui/form/formik/text";
import Textarea from "../ui/form/formik/textarea";
import CurtainDelayed from "../ui/curtain-delayed";
import {WpAbstract} from "../../src/http/wp-abstract";

interface AuthorEditModalProps {
  show: boolean
  author: any
  metadata?: any

  onDismiss(): void
  onUpdate?(author: any): void
}

export default function AuthorEditModal(props: AuthorEditModalProps) {

  const router = useRouter()
  const {onDismiss, author, metadata, onUpdate} = props
  const [show, setShow] = useState(props.show)
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState({success: null, msg: ''})
  const t = useTrans()
  let formRef = useRef<FormikProps<any>>()

  const FormSchema = Yup.object().shape({
    name: Yup.string().required('validacao.obrigatorio'),
    email: Yup.string().email('validacao.email').required('validacao.obrigatorio'),
    bio: Yup.string().required('validacao.obrigatorio'),
  });

  useEffect(() => {
    setShow(props.show)
  }, [props.show])


  async function handleSubmit(values) {
    setLoading(true)
    setResponse({success: null, msg: ''})

    try {
      values.locale = router.locale
      values.abstract_id = metadata.abstract_id
      const resp = await WpAbstract.editAuthor(values)
      const success = resp.data.success
      const data = resp.data?.data
      setLoading(false)
      setResponse({success, msg: (data?.msg ? data.msg : t('atualizado-com-sucesso'))})
      if(success) {
        onUpdate && onUpdate(data)
        setTimeout(()=> handleClose(), 2000)
      }

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
      <Modal.Title>{t('cadastro.editando-autor')}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <CurtainDelayed>
        <Formik innerRef={formRef}
                initialValues={author}
                onSubmit={handleSubmit}
                validationSchema={FormSchema}
        >
          {({errors, touched, values, isValid}) => (<Form>
            <Text name="name" label={t('cadastro.nome')} required/>
            <Text type="email" name="email" label="E-mail" required/>
            <Textarea name="bio" label="Bio" required/>
            <LoadingButton disable={!isValid} loading={loading}>{t('atualizar')}</LoadingButton>
          </Form>)}
        </Formik>

        <Curtain isOpened={response.msg?.length > 0}>
          <div className={`alert ${response.success ? 'alert-success' : 'alert-warning'} mb-0 mt-3`}>
            {response.msg}
          </div>
        </Curtain>

      </CurtainDelayed>
    </Modal.Body>
  </Modal>)
}
