import React, { cloneElement, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";
import WpActivity from "../../../src/http/wp-activity";
import { toast } from "react-toastify";
import { set } from "lodash";
import Loading from "../../ui/loading";
import LoadingButton from "../../ui/loading-button";

interface DoCheckinModalProps {
  activityId: number;
  callable: JSX.Element;
  onUpdate?: () => void;
}

export default function DoCheckinModal({
  activityId,
  callable,
  onUpdate = () => {},
}: DoCheckinModalProps) {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    // console.log(`Canceling check-in for activity ID: ${activityId}`);
    setLoading(true);
    const axios = await WpActivity.adminDoCheckin(activityId);
    const resp = axios.data;
    setLoading(false);
    if (resp.success) {
      // Exibir mensagem de sucesso
      onUpdate?.();
      setShow(false);
      toast.success("Check-in realizado com sucesso!");
    } else {
      toast.error(`Erro ao fazer check-in: ${resp.message}`);
    }
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      {cloneElement(callable, { onClick: handleShow })}

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Fazer Check-in</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Tem certeza que deseja fazer o check-in para a inscrição{" "}
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
            Fazer Checkin
          </LoadingButton>
        </Modal.Footer>
      </Modal>
    </>
  );
}
