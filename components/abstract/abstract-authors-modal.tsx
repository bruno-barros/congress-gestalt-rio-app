import {useEffect, useState} from "react";
import {WpAbstract} from "../../src/http/wp-abstract";
import Modal from "react-bootstrap/cjs/Modal";
import CurtainDelayed from "../ui/curtain-delayed";
import {useQuery} from "react-query";
import {Loading} from "@brunobarros/react-components";
import {errorNotification} from "../../src/resources/responses";
import AbstractAuthorLine from "./abstract-author-line";
import Accordion from "react-bootstrap/cjs/Accordion";

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
    }; authors: { name: string; email: string; active: number; bio: string; id: number; is_speaker: number; order: number }[]
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

  // const FormSchema = Yup.object().shape({
  //   name: Yup.string().required('validacao.obrigatorio'),
  //   email: Yup.string().email('validacao.email').required('validacao.obrigatorio'),
  //   bio: Yup.string().required('validacao.obrigatorio'),
  // });

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
      {(isLoading || isFetching) && <Loading vspace={15}/>}
      {(data?.authors && data.authors.length > 0)
      && <CurtainDelayed delay={1}>
        <Accordion>
          {data.authors.map((author, i) => {
            return (<AbstractAuthorLine key={author.id} i={i} author={author}/>)
          })}
        </Accordion>
      </CurtainDelayed>}
      {(!data?.authors && !isFetching) && <div className="alert alert-info">Não há autores cadastrados</div>}
    </Modal.Body>
  </Modal>)
}
