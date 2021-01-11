import useTrans from "../hooks/useTrans";
import React, {useEffect, useRef, useState} from "react";
import {useQuery, useQueryClient} from "react-query";
import WpEvaluation from "../../src/http/wp-evaluation";
import Modal from "react-bootstrap/cjs/Modal";
import CurtainDelayed from "../ui/curtain-delayed";
import {Loading, Icon} from "@brunobarros/react-components";
import {Form, Formik, FormikProps, FormikState} from "formik";
import Select from "../ui/form/formik/select";
import {LoadingButton} from "@brunobarros/react-components";
import * as Yup from 'yup'
import Switch from "../ui/form/formik/switch";
import WpUser from "../../src/http/wp-user";
import select from "../ui/form/formik/select";
import {plural} from "../../src/helpers";
import {errorNotification, successNotification} from "../../src/resources/responses";
import useEvent from "../hooks/useEvent";
import {WpAbstract} from "../../src/http/wp-abstract";

interface SetStatusModalProps {
  abstract_ids: number[]
  show: boolean

  onDismiss(): void

  onUpdate?(): void
}

export default function SetStatusModal(props: SetStatusModalProps) {

  const t = useTrans()
  const {onDismiss, abstract_ids, onUpdate} = props
  const [show, setShow] = useState(props.show)
  const {data: event, isLoading} = useEvent()
  const edition = event && event.currentEdition()
  const [loading, setLoading] = useState(false)



  useEffect(() => {
    setShow(props.show)
  }, [props.show])


  function handleClose() {
    setShow(false)
    setLoading(false)
    onDismiss && onDismiss()
  }

  function handleSubmit(values) {

    setLoading(true)
    WpAbstract.updateStatus({
      status: values.status,
      abstracts: abstract_ids,
      notify: values.notify,
    })
      .then(resp => {
        if(resp.data.success){
          onUpdate && onUpdate()
          successNotification({message: resp.data.data.msg})
        } else {
          errorNotification({message: resp.data.data.msg})
        }
        handleClose()

      }, err => {
        errorNotification({error: err})
        setLoading(false)
      })
  }


  return (<Modal show={show} onHide={handleClose} size="lg">
    <Modal.Header closeButton>
      <Modal.Title>Aplicar status</Modal.Title>
    </Modal.Header>
    <Modal.Body className="" style={{minHeight: 100}}>
      {isLoading && <Loading/>}
      <CurtainDelayed delay={1}>
        <Formik
          initialValues={{
            status: 'pending',
            notify: true,
          }}
          onSubmit={handleSubmit}
        >{({values, errors, isValid, handleChange}) => (
          <Form>
            <Select name="status" label="Novo status">
              {edition && edition.abstract.statuses.map(status => (<option key={status} value={status}>
                {t(`status.${status}`)}
              </option>))}
            </Select>

            <Switch name="notify" label="Enviar e-mail de notificação aos autores?"/>
            <div className="row">
              <div className="col-12 col-md">
                <LoadingButton block loading={loading} disable={!isValid}>Alterar status
                   {abstract_ids?.length < 2
                    ? ' do trabalho selecionado'
                    : ` dos ${abstract_ids?.length} trabalhos selecionados`}</LoadingButton>
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
