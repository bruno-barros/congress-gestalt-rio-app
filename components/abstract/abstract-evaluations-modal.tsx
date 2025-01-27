import React, {useEffect, useState} from "react";
import Modal from "react-bootstrap/cjs/Modal";
import Accordion from "react-bootstrap/cjs/Accordion";
import {Button, Card} from "react-bootstrap/cjs";
import {useQuery, useQueryClient} from "react-query";
import WpEvaluation from "../../src/http/wp-evaluation";
import {statusColorName} from "../../src/helpers";
import useTrans from "../hooks/useTrans";
import moment from "moment";
import {Evaluation} from "../../src/resources/evaluation";
import AbstractAnswers from "./abstract-answers";
import ButtonDeleteConfirmation from "../ui/button-delete-confirmation";
import useCurrentUser from "../hooks/useCurrentUser";
import {errorNotification, successNotification} from "../../src/resources/responses";
import ToolTip from "../ui/tooltip";
import useEvent from "../hooks/useEvent";
import LoadingButton from "../ui/loading-button";
import ProgressBar from "../ui/progressbar";
import useSettings from "../hooks/useSettings";
import { useRouter } from "next/router";


interface AbstractEvaluationsModalProps {
  show: boolean
  abstract_id: any

  onDismiss(): void

  onUpdate?(): void
}

export default function AbstractEvaluationsModal(props: AbstractEvaluationsModalProps) {

  const queryClient = useQueryClient()
  const router = useRouter()
  const lang = router.locale
  const t = useTrans()
  const {onDismiss, abstract_id, onUpdate} = props
  const {user} = useCurrentUser()
  const [show, setShow] = useState(props.show)
  const [loading, setLoading] = useState(false)
  const [loadingPublic, setLoadingPublic] = useState(false)
  const {data, isLoading, isFetching, error} = useQuery<any[]>(['abstract_evaluations', abstract_id], queryEvaluations, {
    enabled: abstract_id && show
  })
  const { data: event, currentEdition: edition } = useSettings()
  const ReviewCnf = edition?.Review()
  const allowQuantitative = true

  function queryEvaluations(): Promise<any[] | null> {
    return new Promise((resolve) => {
      WpEvaluation.forAbstract(abstract_id, true)
        .then(resp => {
          if (resp.data.data?.evEvaluations?.nodes) {
            resolve(resp.data.data.evEvaluations.nodes)
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


  function handleClose() {
    setShow(false)
    onDismiss && onDismiss()
  }

  function handleDeleteEvaluation(evaluationId: number) {
    setLoading(true)
    WpEvaluation.delete(evaluationId)
      .then(resp => {
        if (resp.data.success) successNotification({message: resp.data.message})
        else errorNotification({message: resp.data.message})
      }, err => {
        errorNotification({error: err})
      }).finally(() => setLoading(false))
  }

  function handlePublic(evaluation: Evaluation) {
    setLoadingPublic(true)
    WpEvaluation.setPublic({
      evaluation_id: evaluation.databaseId,
      public: !evaluation.is_public
    })
      .then(axios => {
        const resp = axios.data
        queryClient.invalidateQueries(['abstract_evaluations', abstract_id])
        successNotification({message: resp.message})
      }, err => {
        errorNotification({error: err})
      }).finally(() => {
      setLoadingPublic(false)
    })
  }

  return (<Modal show={show} onHide={handleClose} size="lg">
    <Modal.Header closeButton>
      <Modal.Title>Avaliações do trabalho #{abstract_id}</Modal.Title>
    </Modal.Header>
    <Modal.Body className="p-0" style={{minHeight: 100}}>

      {(isLoading || isFetching) && <ProgressBar />}

      {(data && data?.length > 0)
      && <Accordion>
      {data.map((evaluation, i) => {
        let eva = Evaluation.make(evaluation)
        return (<Card key={i}>
          <Card.Header className="d-flex align-items-center justify-content-between py-1">
            <Accordion.Toggle as={Button} variant="link" eventKey={`${eva.databaseId}`}
                              className="flex-grow-1 text-left">
              {eva?.evaluator?.name}
            </Accordion.Toggle>
            <div className="d-flex align-items-center">
              <div className="d-flex align-items-center">
                <div className={`text-${statusColorName(eva.status)}`}>{t(`status.${eva.status}`)}</div>
                <div className={`ml-2 bullet bg-${statusColorName(eva.status)}`}/>
              </div>
              <div className="mx-2 text-sm">{moment(eva.created_at || eva.updated_at).format('DD/MM/YYYY')}</div>
              <div className="my-2 text-sm">{eva.is_public
                ? (<><ToolTip text="O autor tem acesso ao comentário"><span>(público)</span></ToolTip></>)
                : (<><ToolTip text="O autor NÃO tem acesso ao comentário"><span>(privado)</span></ToolTip></>)
              }</div>
              {user.canManageAbstracts() &&
              <ButtonDeleteConfirmation loading={loading} onDelete={() => {
                handleDeleteEvaluation(eva.databaseId)
              }}/>}

            </div>
          </Card.Header>
          <Accordion.Collapse eventKey={`${eva.databaseId}`}>
            <Card.Body>
              {eva.updated_at && <div>Atualizado em {moment(eva.updated_at).format('DD/MM/YYYY H:mm')}</div>}
              <div className="d-flex align-items-center justify-content-between my-2">
                {allowQuantitative &&
                <div className="d-flex align-items-center gap-1">
                  {ReviewCnf.getCriteriasArray().map(criteria => {
                    return <>
                      {/* <div className="mb-1 mr-1 text-sm">{criteria.title?.[lang]}</div> */}
                      <div className="badge badge-secondary">{criteria.title?.[lang]}: {eva?.[criteria.id]}</div>
                    </>
                  })}
                  <div className="ml-2 mr-1 badge badge-primary">{eva.getAverage()}</div>
                </div>}

              </div>

              <AbstractAnswers className="mt-3 text-sm" answers={eva.getAnswers()} edition_id={eva?.edition_id}/>

              <div className="border mb-3 pr-2 pb-2 pl-2 pt-0">
                <small className="d-block text-muted">comentários</small>
                {eva.comment}
              </div>

              
              <div className="d-flex align-items-center">
                <LoadingButton 
                  onClick={() => handlePublic(eva)} type="button" loading={loadingPublic} size="sm"
                  variant="outline-primary">{eva.is_public ? 'Tornar privado' : 'Tornar público'}</LoadingButton>
                  {!eva.is_public && <span className="ml-3 text-muted text-sm">(O autor receberá uma notificação)</span>}                
              </div>

            </Card.Body>
          </Accordion.Collapse>
        </Card>)
      })}
    </Accordion>}
      {(data?.length === 0 && !isFetching) && <div className="alert alert-info">Não há avaliações</div>}
    </Modal.Body>
  </Modal>)
}
