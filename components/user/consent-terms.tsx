import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap/cjs";
import { Form, Formik } from "formik";
import Switch from "../ui/form/formik/switch";
import useEvent from "../hooks/useEvent";
import { useRouter } from "next/router";
import useTrans from "../hooks/useTrans";
import useCurrentUser from "../hooks/useCurrentUser";
import useConsent from "../hooks/useConsent";
import WpUser from "../../src/http/wp-user";
import { toast } from "react-toastify";
import { useQueryClient } from "react-query";
import LoadingButton from "../ui/loading-button";
import Loading from "../ui/loading";

interface ConsentTermsProps {}

export default function ConsentTerms(props: ConsentTermsProps) {
  const t = useTrans();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useCurrentUser();
  const consentQuery = useConsent();
  const lang = router.locale || "pt";
  const [show, setShow] = useState(false);
  const [submiting, setSubmiting] = useState(false);
  const [consent, setConsent] = useState(null);
  const { data: event, isLoading } = useEvent();
  const edition = event?.currentEdition();
  const [initValues, setInitValues] = useState({});

  useEffect(() => {
    // consent configurations
    setConsent({
      text: edition?.consentText(lang),
      consents: edition?.consentTerms(lang),
    });

    let showConsent = false;
    // find user consent status
    showConsent = updateFormData();

    if (showConsent && !consentQuery.dirty) {
      consentQuery.show();
    }
  }, []);


  useEffect(() => {
    if (consentQuery.visible) {
      updateFormData();
    }
    setShow(consentQuery.visible);
  }, [consentQuery.visible]);

  function updateFormData() {
    // find user consent status
    let userConsents = user.getConsents();
    let showConsent = false;
    let initValues = {};

    if(!edition?.hasConsent()){
      return;
    }
    edition.consentTerms(lang).map((c) => {
      initValues[c.id] = userConsents[c.id];
      if (initValues[c.id] === false && c.required) {
        showConsent = true;
      }
    });

    setInitValues(initValues);

    return showConsent;
  }

  function handleClose() {
    setShow(false);
    consentQuery.hide();
  }
  function handleSubmit(values) {
    setSubmiting(true);
    WpUser.consent({
      userId: user.getId(),
      consents: values,
    })
      .then(
        (resp) => {
          queryClient.invalidateQueries(["auth"]);
          toast.success(t("atualizado-com-sucesso"));
        },
        (err) => {
          toast.error(t("erro-generico"));
        }
      )
      .finally(() => {
        setSubmiting(false);
        handleClose();
      });
  }

  function validate(v) {
    let error: any = {};
    let errMsg = t ? t("validacao.obrigatorio") : "";

    Object.keys(v).map((k) => {
      const key = consent.consents.find((c) => c.id === k);
      if (key.required && v[k] === false) {
        error[k] = errMsg;
      }
    });

    return error;
  }

  if (!user) {
    return null;
  }

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" centered>
      <Modal.Header>
        <Modal.Title>{t('termos-uso')}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="" style={{ minHeight: 100 }}>
        {isLoading && <Loading />}

        <Formik
          initialValues={initValues}
          onSubmit={handleSubmit}
          validate={validate}
          enableReinitialize={true}
        >
          {({ values, errors, isValid, handleChange }) => (
            <Form>
              {consent && (
                <div
                  className="mb-3"
                  dangerouslySetInnerHTML={{ __html: consent.text }}
                ></div>
              )}

              {consent &&
                consent.consents.map((c) => (
                  <Switch key={c.id} name={c.id} label={c.label} />
                ))}

              <div className="row">
                <div className="col-12 col-md">
                  <LoadingButton
                    block
                    loading={isLoading || submiting}
                    disable={!isValid}
                  >
                   {t('atualizar-consentimento')}
                  </LoadingButton>
                </div>
                <div className="col-auto">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={handleClose}
                  >
                    {t('agora-nao')}
                  </button>
                </div>
              </div>
              {/* <pre>{JSON.stringify(values, null, 2)}</pre> */}
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
}
