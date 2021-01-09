import React, {useEffect, useState} from "react";
import Modal from "react-bootstrap/cjs/Modal";
import CurtainDelayed from "../ui/curtain-delayed";
import {Loading} from "@brunobarros/react-components";
import Accordion from "react-bootstrap/cjs/Accordion";
import useEvaluation from "../hooks/useEvaluation";
import {Button, Card} from "react-bootstrap/cjs";
import {Icon} from "@brunobarros/react-components";
import {useQuery} from "react-query";
import WpEvaluation from "../../src/http/wp-evaluation";
import {statusColorName} from "../../src/helpers";
import useTrans from "../hooks/useTrans";
import AbstractRating from "./abstract-rating";
import moment from "moment";

interface AbstractEvaluationsModalProps {
  show: boolean
  abstract_id: any

  onDismiss(): void

  onUpdate?(): void
}

export default function AbstractEvaluationsModal(props: AbstractEvaluationsModalProps) {

  const t = useTrans()
  const {onDismiss, abstract_id, onUpdate} = props
  const [show, setShow] = useState(props.show)
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

  return (<Modal show={show} onHide={handleClose} size="lg">
    <Modal.Header closeButton>
      <Modal.Title>Avaliações do trabalho #{abstract_id}</Modal.Title>
    </Modal.Header>
    <Modal.Body className="p-0" style={{minHeight: 100}}>
      {(isLoading || isFetching) && <Loading vspace={15}/>}
      {(data && data?.length > 0)
      && <CurtainDelayed delay={1}>
        <Accordion>
          {data.map((eva, i) => {
            return (<Card key={i}>
              <Card.Header className="d-flex align-items-center justify-content-between py-1">
                <Accordion.Toggle as={Button} variant="link" eventKey={`${eva.databaseId}`}
                                  className="flex-grow-1 text-left">
                  {eva.evaluator.name}
                </Accordion.Toggle>
                <div className="d-flex align-items-center">
                  <div className="d-flex align-items-center">
                    <div className={`text-${statusColorName(eva.status)}`}>{t(`status.${eva.status}`)}</div>
                    <div className={`ml-2 bullet bg-${statusColorName(eva.status)}`}/>
                  </div>
                  <div className="mx-2 text-sm">{moment(eva.updated_at).format('DD/MM/YYYY')}</div>
                  <Icon name={`trash-outline`} style={{fontSize: 20}}/>
                </div>
              </Card.Header>
              <Accordion.Collapse eventKey={`${eva.databaseId}`}>
                <Card.Body>
                  <div className="d-flex align-items-center mb-2">
                    <div className="mb-1 mr-1">Relevância</div>
                    <AbstractRating value={eva.relevance} disabled={true}/>
                    <div className="ml-4 mb-1 mr-1">Qualidade</div>
                    <AbstractRating value={eva.quality} disabled={true}/>
                  </div>
                  {eva.comment}
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
