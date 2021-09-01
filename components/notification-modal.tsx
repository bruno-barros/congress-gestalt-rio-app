import React, {useEffect, useState} from "react";
import Modal from "react-bootstrap/cjs/Modal";
import CurtainDelayed from "./ui/curtain-delayed";
import {Loading, Icon} from "@brunobarros/react-components";
import {Form, Formik} from "formik";
import {LoadingButton} from "@brunobarros/react-components";
import * as Yup from 'yup'
import Switch from "./ui/form/formik/switch";
import {errorNotification, successNotification} from "../src/resources/responses";
import useEvent from "./hooks/useEvent";
import Wysiwyg from "./ui/form/formik/wysiwyg";
import Text from "./ui/form/formik/text";
import {MessageTypes} from "../src/resources/notification";
import WpUser from "../src/http/wp-user";
import Select from "./ui/form/formik/select";

interface NotificationModalProps {
  context: MessageTypes
  ids: number[]
  show: boolean
  title?: string

  onDismiss(): void

  onUpdate?(): void
}

export default function NotificationModal(props: NotificationModalProps) {

  const {context, title, onDismiss, ids, onUpdate} = props
  const [show, setShow] = useState(props.show)
  const {data: event, isLoading} = useEvent()
  const edition = event && event.currentEdition()
  const [loading, setLoading] = useState(false)

  const FormSchema = Yup.object().shape({
    subject: Yup.string().required('Não esqueça do assunto'),
    message: Yup.string().required('Escreva alguma mensagem'),
  })

  useEffect(() => {
    setShow(props.show)
  }, [props.show])


  function handleClose() {
    setShow(false)
    setLoading(false)
    onDismiss && onDismiss()
  }

  function handleSubmit(values: any) {
    setLoading(true)
    WpUser.notify({
      context: values.context,
      ids,
      message: values.message,
      subject: values.subject,
      coauthors: values.coauthors || false,
      merge: values.merge,
      template: values.template
    })
      .then(resp => {
        if (resp.data.success) {
          onUpdate && onUpdate()
          successNotification({heroTitle: resp.data.data.msg})
        } else {
          errorNotification({message: resp.data.data.msg})
        }
        handleClose()

      }, err => {
        errorNotification({error: err})
      })
      .finally(() => setLoading(false))
  }


  return (<Modal show={show} onHide={handleClose} size="lg">
    <Modal.Header closeButton>
      <Modal.Title>{title || 'Enviar mensagem'}</Modal.Title>
    </Modal.Header>
    <Modal.Body className="" style={{minHeight: 100}}>
      {isLoading && <Loading/>}
      <CurtainDelayed delay={1}>
        <Formik
          initialValues={{
            context: context,
            coauthors: false,
            merge: false,
            template: '',
            subject: '',
            message: '',
          }}
          validationSchema={FormSchema}
          onSubmit={handleSubmit}
        >{({values, errors, isValid, handleChange}) => (
          <Form>
            {context === 'abstracts' &&
            <Switch name="coauthors" label="Enviar para coautores?"/>}
            <Text name="subject" label="Assunto"/>
            <Wysiwyg name="message" label={<div className="d-flex align-items-center justify-content-between">Mensagem <div className="">
              <div className="text-xs">códigos: <span className="text-muted">[abstract_name] [user_name] [user_email]</span></div>
            </div></div>} maxHeight="md"/>

            <div className="form-row">
              <div className="col-12 col-md-3">
              <Select name="template" label="Modelo de e-mail">
                <option value="default">Padrão</option>
                <option value="logos">Com marcas de patrocínio</option>
              </Select>
              </div>
              <div className="col-12 col-md-9">
                <label htmlFor="">&nbsp;</label>
                <Switch name="merge" label="Evitar envidos duplicados *"/>
                <div className="text-xs text-muted" style={{marginTop: '-1rem', marginBottom:'1rem'}}>* Use esta opção para mensagens genéricas. Com esta opção não é possível usar os códigos.</div>
              </div>
            </div>

            <div className="row">
              <div className="col-12 col-md">
                <LoadingButton block loading={loading} disable={!isValid}>Enviar</LoadingButton>
              </div>
              <div className="col-auto">
                <button type="button" className="btn btn-outline-secondary" onClick={handleClose}>Cancelar</button>
              </div>
            </div>

          </Form>
        )}</Formik>
      </CurtainDelayed>

    </Modal.Body>
  </Modal>)
}
