import React, {useEffect, useState} from "react";
import Modal from "react-bootstrap/cjs/Modal";
import CurtainDelayed from "../ui/curtain-delayed";
import {Loading} from "@brunobarros/react-components";
import Accordion from "react-bootstrap/cjs/Accordion";
import {Button, Card} from "react-bootstrap/cjs";
import {useQuery, useQueryClient} from "react-query";
import WpEvaluation from "../../src/http/wp-evaluation";
import {statusColorName} from "../../src/helpers";
import useTrans from "../hooks/useTrans";
import AbstractRating from "./abstract-rating";
import moment from "moment";
import {Evaluation} from "../../src/resources/evaluation";
import AbstractAnswers from "./abstract-answers";
import ButtonDeleteConfirmation from "../ui/button-delete-confirmation";
import useCurrentUser from "../hooks/useCurrentUser";
import {errorNotification, successNotification} from "../../src/resources/responses";
import {LoadingButton} from "@brunobarros/react-components";
import ToolTip from "../ui/tooltip";


interface AbstractEvaluationsModalProps {
  show: boolean
  abstract_id: any

  onDismiss(): void

  onUpdate?(): void
}

export default function AbstractEvaluationsModal(props: AbstractEvaluationsModalProps) {

  const queryClient = useQueryClient()
  const t = useTrans()
  const {onDismiss, abstract_id, onUpdate} = props
  const {user} = useCurrentUser()
  const [show, setShow] = useState(props.show)
  const [loading, setLoading] = useState(false)
  const [loadingPublic, setLoadingPublic] = useState(false)
  const {data, isLoading, isFetching, error} = useQuery<any[]>(['abstract_evaluations', abstract_id], queryEvaluations, {
    enabled: abstract_id && show
  })

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
        if (resp.data.success) successNotification({message: resp.data.data.msg})
        else errorNotification({message: resp.data.data.msg})
      }, err => {
        errorNotification({error: err})
      }).finally(() => setLoading(false))
  }

  function handlePublic(evaluation: Evaluation) {
    setLoadingPublic(true)
    WpEvaluation.setPublic({
      evaluation_id: evaluation.databaseId
    })
      .then(resp => {
        queryClient.invalidateQueries(['abstract_evaluations', abstract_id])
        successNotification({message: resp.data.data.msg})
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
      {(isLoading || isFetching) && <Loading vspace={15}/>}
      {(data && data?.length > 0)
      && <CurtainDelayed delay={.5}>
        <Accordion>
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
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <div className="d-flex align-items-center">
                      <div className="mb-1 mr-1">Relevância</div>
                      <AbstractRating value={eva.relevance} disabled={true}/>
                      <div className="ml-4 mb-1 mr-1">Qualidade</div>
                      <AbstractRating value={eva.quality} disabled={true}/>
                    </div>
                    {eva.updated_at && <div>Atualizado em {moment(eva.updated_at).format('DD/MM/YYYY H:mm')}</div>}

                  </div>
                  {eva.comment}

                  <AbstractAnswers className="mt-3 text-sm" answers={eva.getAnswers()} edition_id={eva?.edition_id}/>

                  {!eva.is_public &&
                  <div className="d-flex align-items-center">
                    <LoadingButton onClick={() => handlePublic(eva)} type="button" loading={loadingPublic} size="sm"
                                   variant="outline-primary">Tornar público</LoadingButton>
                    <span className="ml-3 text-muted text-sm">(O autor receberá uma notificação)</span>
                  </div>}

                </Card.Body>
              </Accordion.Collapse>
            </Card>)
          })}
        </Accordion>
      </CurtainDelayed>}
      {(data?.length === 0 && !isFetching) && <div className="alert alert-info">Não há avaliações</div>}
    </Modal.Body>
  </Modal>)
}
