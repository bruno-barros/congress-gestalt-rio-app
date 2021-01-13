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
import {NotificationTypes} from "../src/resources/notification";
import WpUser from "../src/http/wp-user";

interface NotificationModalProps {
  context: NotificationTypes
  ids: number[]
  show: boolean

  onDismiss(): void

  onUpdate?(): void
}

export default function NotificationModal(props: NotificationModalProps) {

  const {context, onDismiss, ids, onUpdate} = props
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
    values.ids = ids
    console.log(values);
    setLoading(true)
    WpUser.notify({
      context: values.context,
      ids,
      message: values.message,
      subject: values.subject,
      coauthors: values.coauthors || false
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
      .finally(()=>setLoading(false))
  }


  return (<Modal show={show} onHide={handleClose} size="lg">
    <Modal.Header closeButton>
      <Modal.Title>Enviar mensagem</Modal.Title>
    </Modal.Header>
    <Modal.Body className="" style={{minHeight: 100}}>
      {isLoading && <Loading/>}
      <CurtainDelayed delay={1}>
        <Formik
          initialValues={{
            context: context,
            coauthors: false,
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
            <Wysiwyg name="message" label="Mensagem" maxHeight="md"/>

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
