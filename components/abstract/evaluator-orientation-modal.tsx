import { useState } from "react";
import Button from "react-bootstrap/Button";
import useSettings from "../hooks/useSettings";
import { useRouter } from "next/router";
import Modal from "react-bootstrap/Modal";

export default function EvaluatorOrientationModal(){
    const router = useRouter();
    const lang = router.locale;
    const [show, setShow] = useState(false);
    const {currentEdition: edition } = useSettings();
    const ReviewCnf = edition?.Review();
    const txt = ReviewCnf?.[`evaluators_text_${lang}`];

    function handleClose(){
        setShow(false);
    }

    if(!txt || txt.length < 12){
        return null;
    }

    return (<>
        <div className="alert alert-warning d-flex justify-content-between align-items-center">
          <b>Atenção revisor!</b>
          <Button size="sm" variant="warning" onClick={()=> setShow(true)}>Leia as orientações</Button>
        </div>
        <Modal
            show={show}
            onHide={handleClose}
        >
            <Modal.Header closeButton>Ao avaliador</Modal.Header>
            <Modal.Body>
                <div dangerouslySetInnerHTML={{__html: txt}}></div>
            </Modal.Body>            
        </Modal>
    </>)
}