import {useEffect, useState} from "react";
import {WpAbstract} from "../../src/http/wp-abstract";
import Modal from "react-bootstrap/cjs/Modal";
import CurtainDelayed from "../ui/curtain-delayed";
import {useQuery} from "react-query";
import {errorNotification} from "../../src/resources/responses";
import AbstractAuthorLine from "./abstract-author-line";
import Accordion from "react-bootstrap/cjs/Accordion";
import {Author} from "../../src/resources/user";
import Loading from "../ui/loading";
import ProgressBar from "../ui/progressbar";

interface AbstractAuthorsModalProps {
  show: boolean
  abstract_id: any

  onDismiss(): void

  onUpdate?(): void
}

export default function AbstractAuthorsModal(props: AbstractAuthorsModalProps) {

  const {onDismiss, abstract_id, onUpdate} = props
  const [show, setShow] = useState(props.show)
  const {data, error, isLoading, isFetching} = useQuery(['abstract_authors', abstract_id], queryAuthors, {
    enabled: show
  })

  function queryAuthors(): Promise<{
    author: {
      node: {
        avatar: { url: string }; databaseId: number; email: string; firstName: string; locale: string; name: string;
      }
    }; authors: Author[]
  }> {
    return new Promise((resolve, reject) => {
      WpAbstract.authors(abstract_id)
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
      <Modal.Title>Autores trabalho #{abstract_id}</Modal.Title>
    </Modal.Header>
    <Modal.Body className="p-0" style={{minHeight: 100}}>
      
      {(isLoading || isFetching) && <ProgressBar seconds={3}  />}

      {(data?.authors && data.authors.length > 0)
      && <Accordion>
      {data.authors.map((author, i) => {
        return (<AbstractAuthorLine key={author.id} i={i} author={author} mainAuthorId={data.author.node.databaseId}/>)
      })}
    </Accordion>}
      {(!data?.authors && !isFetching) && <div className="alert alert-info">Não há autores cadastrados</div>}
    </Modal.Body>
  </Modal>)
}
