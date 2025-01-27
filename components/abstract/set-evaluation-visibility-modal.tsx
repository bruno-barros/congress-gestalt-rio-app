import useTrans from "../hooks/useTrans";
import React, { FormEvent, FormEventHandler, useEffect, useState } from "react";
import Modal from "react-bootstrap/cjs/Modal";
import CurtainDelayed from "../ui/curtain-delayed";
import { Form, Formik } from "formik";
import Select from "../ui/form/formik/select";
import {
  errorNotification,
  successNotification,
} from "../../src/resources/responses";
import useEvent from "../hooks/useEvent";
import { WpAbstract } from "../../src/http/wp-abstract";
import { Spinner } from "react-bootstrap/cjs";
import WpEvaluation from '../../src/http/wp-evaluation';
import LoadingButton from "../ui/loading-button";
import Loading from "../ui/loading";

interface SetStatusModalProps {
  abstract_ids: number[];
  show: boolean;

  onDismiss(): void;

  onUpdate?(): void;
}

export default function SetEvaluationVisibilityModal(props: SetStatusModalProps) {
  const t = useTrans();
  const { onDismiss, abstract_ids, onUpdate } = props;
  const [show, setShow] = useState(props.show);
  const { data: event, isLoading } = useEvent();
  const edition = event && event.currentEdition();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setShow(props.show);
  }, [props.show]);


  function handleClose() {
    setShow(false);
    setLoading(false);
    onDismiss && onDismiss();
  }


  function handleSubmit(values) {
    setLoading(true);

    WpEvaluation.visibility({
      criteria: values.criteria,
      abstract_ids: abstract_ids,
      is_public: values.is_public,
    }).then(
      (axios) => {
        const resp = axios.data;
        if (resp.success) {
          onUpdate && onUpdate();
          successNotification({ message: resp.message });
        } else {
          errorNotification({ message: resp.message });
        }
        handleClose();
      },
      (err) => {
        errorNotification({ error: err });
        setLoading(false);
      }
    );
  }

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Visibilidade dos comentários</Modal.Title>
      </Modal.Header>
      <Modal.Body className="" style={{ minHeight: 100 }}>
        {isLoading && <Loading />}
        <CurtainDelayed delay={1}>
          <Formik
            initialValues={{
              is_public: "1",
              criteria: "",
            }}
            onSubmit={handleSubmit}
          >
            {({ values, errors, isValid }) => {
              return (
                <Form>
                  <Select name="criteria" label="Critério">
                    <option value="" selected disabled>
                      Selecione o critério
                    </option>
                    <option value="approved_only">
                      Somente avaliações de aprovação
                    </option>
                    <option value="rejected_only">
                      Somente avaliações de rejeição
                    </option>
                    <option value="made_only">
                      Avaliações realizadas (aprovando ou rejeitando)
                    </option>
                    <option value="all">
                      Todas as avaliações
                    </option>
                  </Select>

                  <Select name="is_public" label="Visibilidade">
                    <option value="1">Público</option>
                    <option value="0">Privado</option>
                  </Select>

                  <div className="row">
                    <div className="col-12 col-md">
                      <LoadingButton
                        block
                        loading={loading}
                        disable={!isValid}
                      >
                        Alterar visibilidade
                      </LoadingButton>
                    </div>
                    <div className="col-auto">
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={handleClose}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </CurtainDelayed>
      </Modal.Body>
    </Modal>
  );
}
