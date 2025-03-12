import Modal from "react-bootstrap/Modal";
import { EvaluationSchema } from "../../src/types/review";
import { useEffect, useState } from "react";
import { dump } from "../../src/helpers";
import { Evaluation } from "../../src/resources/evaluation";
import useSettings from "../hooks/useSettings";
import { useRouter } from "next/router";
import Button from "react-bootstrap/Button";
import Icon from "../ui/ionicon";
import Link from "next/link";
import AbstractAnswers from "./abstract-answers";

interface EvaluationDetailsModalProps {
  evaluation: EvaluationSchema;
  show: boolean;
  onDismiss(): void;
}
export default function EvaluationDetailsModal(
  props: EvaluationDetailsModalProps
) {
  const route = useRouter();
  const lang = route.locale;
  const { evaluation: data, show: parent_show, onDismiss } = props;
  const evaluation = Evaluation.make(data);
  const { data: event, currentEdition: edition } = useSettings();
  const ReviewCnf = edition?.Review();
  const [show, setShow] = useState(false);
  function handleClose() {
    setShow(false);
    onDismiss();
  }

  useEffect(() => {
    setShow(parent_show)
  }, [parent_show]);

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton className="d-flex align-items-center gap-3">
        <div>Avaliação</div>
        <Link href={`/abstracts/${evaluation?.abstract?.databaseId}`} passHref>
        <Button target="_blank" as="a" size="sm" variant="outline-primary">ver trabalho <Icon name="arrow-redo-outline" /></Button>
        </Link>
      </Modal.Header>
      <Modal.Body>
        <div className="form-group border-bottom pb-2">
          <label className="text-uppercase mb-0">Título</label>
          <div>{evaluation?.abstract?.title}</div>
        </div>
        <div className="form-group border-bottom pb-2">
          <label className="text-uppercase mb-0">Comentário aos pareceristas</label>
          <div>{evaluation?.private_comment}</div>
        </div>
        <div className="form-group border-bottom_ pb-2">
          <label className="text-uppercase mb-0">Avaliações por critério</label>
          <table className="table table-sm ">
            <tbody>
            {ReviewCnf.getCriteriasArray().map((c, i) => {
                return (
                <tr key={i}>
                    <th>{c.title[lang]}</th>
                    <td>{evaluation[c.id]}</td>
                </tr>
                );
            })}
            </tbody>
          </table>
        
          {/* <label className="text-uppercase mb-0">Avaliações</label> */}
            <AbstractAnswers className="mt-3 text-sm" answers={evaluation.getAnswers()} edition_id={evaluation.edition_id}/>         
        </div>


        {/* {dump(evaluation)} */}
      </Modal.Body>
    </Modal>
  );
}
