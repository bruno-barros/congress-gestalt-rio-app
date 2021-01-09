import useTrans from "../hooks/useTrans";
import React, {useEffect, useRef, useState} from "react";
import {useQuery} from "react-query";
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

interface SetEvaluatorsModalProps {
  abstract_ids: number[]
  show: boolean

  onDismiss(): void

  onUpdate?(): void
}

export default function SetEvaluatorsModal(props: SetEvaluatorsModalProps) {

  const t = useTrans()
  const {onDismiss, abstract_ids, onUpdate} = props
  const [show, setShow] = useState(props.show)
  const {data: event} = useEvent()
  const edition = event && event.currentEdition()
  const [evaluator, setEvaluator] = useState(null)
  const [loading, setLoading] = useState(false)
  const {data, isLoading, isFetching, error} = useQuery<any[]>(['evaluators'], queryEvaluations, {
    enabled: !!abstract_ids && show
  })
  const form: React.MutableRefObject<FormikProps<any>> = useRef<FormikProps<any>>(null)


  function queryEvaluations(): Promise<any[] | null> {
    return new Promise((resolve) => {
      WpUser.searchUser({
        role: 'contributor'
      })
        .then(resp => {
          if (resp.data.data?.evUserSearch?.nodes) {
            resolve(resp.data.data.evUserSearch.nodes)
          } else {
            resolve(null)
          }
        }, err => {

        })
    })
  }

  useEffect(() => {
    setShow(props.show)
  }, [props.show])

  const FormSchema = Yup.object().shape({
    evaluator: Yup.number().required('Selecione um avaliador')
  })

  function handleClose() {
    setShow(false)
    setEvaluator(null)
    setLoading(false)
    onDismiss && onDismiss()
  }

  function handleSubmit(values) {
    console.log({values});
    setLoading(true)
    WpEvaluation.setEvaluators({
      user_id: parseInt(values.evaluator),
      abstracts: abstract_ids,
      notify: values.notify,
      edition_id: edition.id
    })
      .then(resp => {
        if(resp.data.success){
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

  function handleEvaluatorChange(id: number) {
    let selected = data.find(user => user.databaseId === id)
    selected && setEvaluator(selected)
  }

  return (<Modal show={show} onHide={handleClose} size="lg">
    <Modal.Header closeButton>
      <Modal.Title>Designar avaliador</Modal.Title>
    </Modal.Header>
    <Modal.Body className="" style={{minHeight: 100}}>
      {(isLoading || isFetching) && <Loading vspace={15}/>}
      <CurtainDelayed delay={1}>
        <Formik
          innerRef={form}
          initialValues={{
            evaluator: '',
            notify: true,
          }}

          onSubmit={handleSubmit}
          validationSchema={FormSchema}
        >{({values, errors, isValid, handleChange}) => (
          <Form>
            <Select name="evaluator" onChange={(e) => {
              handleChange(e)
              handleEvaluatorChange(parseInt(e.target.value))
            }}>
              <option value="">Selecione o avaliador</option>
              {data && data.map(e => (<option key={e.databaseId} value={e.databaseId}>
                {e.name} {plural(e?.evaluations_pending_count, '(avaliando 1 trabalho)', '(avaliando %c trabalhos)', '(nenhuma avaliação)')}
              </option>))}
            </Select>

            <div className="form-group mt-4 mb-5" style={{opacity: !evaluator ? .2 : 1}}>
              <div className="">AVALIADOR</div>
              <div className="h4">{(data && evaluator) && <>
                {evaluator.name}
              </>}</div>
            </div>

            <Switch name="notify" label="Enviar e-mail de notificação?"/>
            <div className="row">
              <div className="col-12 col-md">
                <LoadingButton block loading={loading} disable={!isValid}>Designar avaliador
                  para {abstract_ids?.length < 2
                    ? 'o trabalho selecionado'
                    : `os ${abstract_ids?.length} trabalhos selecionados`}</LoadingButton>
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
