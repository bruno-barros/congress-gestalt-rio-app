import React, { cloneElement, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import axios from 'axios';
import WpActivity from "../../../src/http/wp-activity";
import { toast } from "react-toastify";
import { set } from 'lodash';
import Loading from '../../ui/loading';
import LoadingButton from "../../ui/loading-button";

interface CancelCheckinModalProps {
  activityId: number;
  callable: JSX.Element;
  onUpdate?: () => void; 
}

export default function CancelCheckinModal({
  activityId,
  callable,
  onUpdate = () => {},
}: CancelCheckinModalProps) {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    // console.log(`Canceling check-in for activity ID: ${activityId}`);
    setLoading(true);
    const axios = await WpActivity.adminUndoCheckin(activityId);
    const resp = axios.data;
    setLoading(false);
    if (resp.success) {
      // Exibir mensagem de sucesso
      onUpdate?.();
      setShow(false);
      toast.success("Check-in cancelado com sucesso!");
    } else {
      toast.error(`Erro ao cancelar check-in: ${resp.message}`);
    }
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      {cloneElement(callable, { onClick: handleShow })}

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Cancelar Check-in</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Tem certeza que deseja cancelar o check-in para a atividade {activityId}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Fechar
          </Button>
          <LoadingButton loading={loading} variant="danger" onClick={handleCancel}>
            Confirmar Cancelamento
          </LoadingButton>
        </Modal.Footer>
      </Modal>
    </>
  );
}
