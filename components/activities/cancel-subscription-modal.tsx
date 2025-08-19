import React, { cloneElement, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";
import WpActivity from "../../src/http/wp-activity";
import { toast } from "react-toastify";
import { set } from "lodash";
import Loading from "../ui/loading";
import LoadingButton from "../ui/loading-button";

interface CancelSubscriptionProps {
  activityId: number;
  userId: number;
  callable: JSX.Element;
  onUpdate?: () => void;
}

export default function CancelSubscriptionModal({
  activityId,
    userId,
  callable,
  onUpdate = () => {},
}: CancelSubscriptionProps) {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    // console.log(`Canceling check-in for activity ID: ${activityId}`);
    setLoading(true);
    const axios = await WpActivity.unsubscribe({
        activity_id: activityId,
        user_id: userId,
    });
    const resp = axios.data;
    setLoading(false);
    if (resp.success) {
      // Exibir mensagem de sucesso
      onUpdate?.();
      setShow(false);
      toast.success("Inscrição cancelada!");
    } else {
      toast.error(`Erro ao cancelar inscrição: ${resp.message}`);
    }
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      {cloneElement(callable, { onClick: handleShow })}

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Cancelar inscrição</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Tem certeza que deseja cancelar a inscrição na atividade{" "}
          {activityId}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Fechar
          </Button>
          <LoadingButton
            loading={loading}
            variant="success"
            onClick={handleSubmit}
          >
            Cancelar inscrição
          </LoadingButton>
        </Modal.Footer>
      </Modal>
    </>
  );
}
