import useTrans from "../hooks/useTrans";
import React, { FormEvent, FormEventHandler, useEffect, useState } from "react";
import Modal from "react-bootstrap/cjs/Modal";
import CurtainDelayed from "../ui/curtain-delayed";
import { Loading } from "@brunobarros/react-components";
import { Form, Formik } from "formik";
import Select from "../ui/form/formik/select";
import { LoadingButton } from "@brunobarros/react-components";
import Switch from "../ui/form/formik/switch";
import {
  errorNotification,
  successNotification,
} from "../../src/resources/responses";
import useEvent from "../hooks/useEvent";
import { WpAbstract } from "../../src/http/wp-abstract";
import { Spinner } from "react-bootstrap/cjs";

interface SetStatusModalProps {
  abstract_ids: number[];
  show: boolean;

  onDismiss(): void;

  onUpdate?(): void;
}

export default function SetStatusByCriteriaModal(props: SetStatusModalProps) {
  const t = useTrans();
  const { onDismiss, abstract_ids, onUpdate } = props;
  const [show, setShow] = useState(props.show);
  const { data: event, isLoading } = useEvent();
  const edition = event && event.currentEdition();
  const [loading, setLoading] = useState(false);
  const [loadingCriteria, setLoadingCriteria] = useState(false);
  const [criteria, setCriteria] = useState("");
  const [selectedIds, setSelectedIds] = useState<any[] | null>(null);

  useEffect(() => {
    setShow(props.show);
  }, [props.show]);

  useEffect(() => {
    const v = criteria.split("|");
    const cri = v[0] || null;
    const stt = v[1] || null;
    const qnt = v[2] || null;
    if(cri) findByCriteria(cri, stt, qnt)
    console.log(cri, stt, qnt);
  }, [criteria]);

  function handleClose() {
    setShow(false);
    setLoading(false);
    onDismiss && onDismiss();
  }

  function findByCriteria(criteria, status, quantity) {
    setLoadingCriteria(true)
    WpAbstract.findByCriteria({
      criteria, status, quantity
    }).then((resp) => {
      if(resp.data.success){
        setSelectedIds(resp.data.data)
      }
    })
    .finally(()=>{
      setLoadingCriteria(false)
    });
  }

  function handleSubmit(values) {
    setLoading(true);

    WpAbstract.updateStatus({
      status: values.status,
      abstracts: selectedIds,
      notify: values.notify,
    }).then(
      (resp) => {
        if (resp.data.success) {
          onUpdate && onUpdate();
          successNotification({ message: resp.data.data.msg });
        } else {
          errorNotification({ message: resp.data.data.msg });
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
        <Modal.Title>Aplicar status por critério</Modal.Title>
      </Modal.Header>
      <Modal.Body className="" style={{ minHeight: 100 }}>
        {isLoading && <Loading />}
        <CurtainDelayed delay={1}>
          <Formik
            initialValues={{
              status: "pending",
              notify: false,
              criteria: "",
            }}
            onSubmit={handleSubmit}
          >
            {({ values, errors, isValid }) => {
              return (
                <Form
                  onChange={( e: any) => {
                    if (e.target.name === "criteria")
                      setCriteria(e.target.value);
                  }}
                >
                  <Select name="criteria" label="Critério">
                    <option value="" selected disabled>Selecione o critério</option>
                    <option value="evaluation_status|synopsis_approved|1">
                      (Sinopse) Uma - ou mais - avaliações de aprovação
                    </option>
                    <option value="evaluation_status|synopsis_approved|2">
                    (Sinopse) Duas - ou mais - avaliações de aprovação
                    </option>
                    <option value="evaluation_status|synopsis_rejected|1">
                    (Sinopse) Uma - ou mais - avaliações de rejeição
                    </option>
                    <option value="evaluation_status|synopsis_rejected|2">
                    (Sinopse) Duas - ou mais - avaliações de rejeição
                    </option>
                    <option value="synopsis_no_evaluated">
                      (Sinopse) Que tenham avaliações, mas nenhuma realizada
                    </option>
                    <option value="evaluation_status|pre_approved|1">
                      (Trabalho) Uma - ou mais - avaliações de aprovação
                    </option>
                    <option value="evaluation_status|pre_approved|2">
                    (Trabalho) Duas - ou mais - avaliações de aprovação
                    </option>
                    <option value="evaluation_status|rejected|1">
                    (Trabalho) Uma - ou mais - avaliações de rejeição
                    </option>
                    <option value="evaluation_status|rejected|2">
                    (Trabalho) Duas - ou mais - avaliações de rejeição
                    </option>
                    <option value="abstracts_no_evaluated">
                      (Trabalho) Que tenham avaliações, mas nenhuma realizada
                    </option>
                  </Select>
                  {loadingCriteria &&
                  <div>
                    <Loading />
                  </div>}
                  {(!loadingCriteria && selectedIds) &&
                    <div className="mb-3 pb-3 border-bottom">
                    <strong className={`${selectedIds.length > 0 ? '' : 'text-danger'}`}>{selectedIds.length}</strong> registro(s) encontrado(s) com o
                    critério acima.
                  </div>}


                  <Select name="status" label="Novo status">
                    {edition &&
                      edition.abstract.statuses
                        .filter((s) => s !== "pre_approved")
                        .map((status) => (
                          <option key={status} value={status}>
                            {t(`status.${status}`)}
                          </option>
                        ))}
                  </Select>

                  <Switch
                    name="notify"
                    label="Enviar e-mail de notificação aos autores?"
                  />
                  <div className="row">
                    <div className="col-12 col-md">
                      <LoadingButton block loading={loading} disable={!isValid || !selectedIds?.length}>
                        Alterar status
                        {abstract_ids?.length < 2
                          ? " do trabalho selecionado"
                          : ` dos ${abstract_ids?.length} trabalhos selecionados`}
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
