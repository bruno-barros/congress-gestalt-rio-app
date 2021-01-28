import {useEffect, useState} from "react";
import {WpAbstract} from "../../src/http/wp-abstract";
import Modal from "react-bootstrap/cjs/Modal";
import CurtainDelayed from "../ui/curtain-delayed";
import {useQuery} from "react-query";
import {Loading} from "@brunobarros/react-components";
import {errorNotification} from "../../src/resources/responses";
import Card from "react-bootstrap/cjs/Card";
import {Icon} from "@brunobarros/react-components";
import moment from "moment";

interface AbstractAttachmentsModalProps {
  show: boolean
  abstract_id: any

  onDismiss(): void

  onUpdate?(): void
}

export default function AbstractAttachmentsModal(props: AbstractAttachmentsModalProps) {

  const {onDismiss, abstract_id, onUpdate} = props
  const [show, setShow] = useState(props.show)
  const {data, error, isLoading, isFetching} = useQuery(['abstract_attachments', abstract_id], queryAttachments, {
    enabled: show
  })

  function queryAttachments(): Promise<{
    databaseId: number;
    title: string;
    attachments: {
      abstract_id: number;
      context: string;
      created_at: string;
      id: number;
      name: string;
      mimetype: string;
      note: string;
      size: number;
      url: string;
      user_id: number;
      version: number;
    }[]
  }> {
    return new Promise((resolve, reject) => {
      WpAbstract.attachments(abstract_id)
        .then(resp => {
          if (resp.data?.data?.abstract) {
            resolve(resp.data.data.abstract)
          }
        }, err => {
          errorNotification({error: err})
          reject([])
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
      <Modal.Title>Anexos do trabalho #{abstract_id}</Modal.Title>
    </Modal.Header>
    <Modal.Body className="p-0" style={{minHeight: 100}}>
      {(isLoading || isFetching) && <Loading vspace={15}/>}
      {(data?.attachments && data.attachments.length > 0)
      && <CurtainDelayed delay={1}>
        {data.attachments.map((attach) => {
          const ext = attach.name.substr(-4).replace('.', '').toUpperCase()
          return (<Card key={attach.id}>
            <Card.Header className="d-flex">
              <a href={attach.url} target="_blank" className="d-flex align-items-center flex-grow-1  text-truncate">
                <Icon name={`download-outline`} style={{fontSize: 20}}/>
                <div style={{minWidth: 70}} className="px-2">{ext}</div>
                <div className=" text-truncate">{attach.name} lkj lk jlç lkj lk jlkj çlkj l jljl kj</div>
              </a>
              <div className="text-nowrap d-flex">
              <div className="mx-3">{moment(attach.created_at).format('DD/MM/YYYY')}</div>
              <div>VER {attach.version}</div>
              </div>
            </Card.Header>
          </Card>)
        })}
      </CurtainDelayed>}
      {(!data?.attachments && !isFetching) && <div className="alert alert-info">Não há anexos neste trabalho</div>}
    </Modal.Body>
  </Modal>)
}
