"use client";
import { FieldArray, FieldArrayRenderProps, Form, Formik } from "formik";
import Layout from "./layout";
import s from "./settings.module.scss";
import * as Yup from "yup";
import { dump } from "../../src/helpers";
import Text from "../../components/ui/form/formik/text";
import Textarea from "../../components/ui/form/formik/textarea";
import { Field } from "../../components/settings/settings-helpers";
import useSettingsContext, {
  SettingsContextProvider,
} from "../../components/settings/settings-context";
import LangSelector from "../../components/settings/lang-selector";
import useSettings, { invalidateSettings } from "../../components/hooks/useSettings";
import { useState } from "react";
import { WpSettings } from "../../src/http/wp-settings";
import { toast } from "react-toastify";
import Phone from "../../components/ui/form/formik/phone";
import { useQueryClient } from "react-query";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import LoadingButton from "../../components/ui/loading-button";
import Loading from "../../components/ui/loading";
import LangIndicator from "../../components/settings/lang-indicator";
export default function CreateContext() {
  return (
    <SettingsContextProvider>
      <Settings />
    </SettingsContextProvider>
  );
}
function Settings() {
  const { lang, setLang, currentEdition } = useSettingsContext();
  const { data: evt, isLoading, isFetching } = useSettings(currentEdition);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  // console.log(evt);
  // const { data: event} = useEvent()
  const initialValues = {
    name: evt?.eventName || "",
    description_pt: evt?.global?.description_pt || "",
    description_en: evt?.global?.description_en || "",
    description_es: evt?.global?.description_es || "",
    phone: evt?.global?.phone || "",
    phone_country: evt?.global?.phone_country || "55",
    email_general: evt?.global?.email_general || "",
    email_financial: evt?.global?.email_financial || "",

    rate_send_now: evt?.global?.rate_send_now || 1,
    rate_limit_per_minute: evt?.global?.rate_limit_per_minute || 1,
    notification_sender_name: evt?.global?.notification_sender_name || "",
    notification_copy: evt?.global?.notification_copy || "",
  };
  const validationSchema = Yup.object({
    name: Yup.string().required("Obrigatório"),
    email_general: Yup.string().email('Inválido').required('Obrigatório'),
    email_financial: Yup.string().email('Inválido').required('Obrigatório'),
  });

  function handleSubmit(values) {
    // console.log(values);
    setLoading(true);
    WpSettings.save({
      group: "global",
      fields: values
    })
      .then((axios) => {
        const resp = axios.data;
        toast.success("Configurações salvas com sucesso");
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false);
        invalidateSettings(queryClient);
      });
  }

  function handleAddEdition(helpers: FieldArrayRenderProps){
    helpers.push({name: '', start: '', end: ''})
  }

  return (
    <Layout>
      <h2 className={s.title}>
        Geral
        <LangSelector />
        {(isLoading || isFetching) && <Loading />}
      </h2>
      {/* {dump(initialValues)} */}

      <Formik
        enableReinitialize
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        {({ values, errors, isValid }) => (
          <Form>
            <Field infos="Nome geral. Sem incluir a edição.">
              <Text name="name" label={`Nome do projeto`} />
            </Field>
            <Field infos="Breve descrição para cada idioma.">
              <Textarea
                name={`description_${lang}`}
                label={<LangIndicator lang={lang}>Descrição do projeto</LangIndicator>}
              />
            </Field>

            {/* 
            //region Dados de contato
            */}
            <fieldset className={s.fieldset}>
              <legend className={s.fieldset__legend}>Dados de contato</legend>
              <Field infos="">
                {/* <Phone name="phone" countryName="phone_country" label="Telefone"  /> */}
              </Field>
              <Field infos="Email de contato para dúvidas gerais ou suporte.">
                <Text name="email_general" label="Email para suporte" />
              </Field>
              <Field infos="Email para receber notificações de pagamento e inscrição.">
                <Text name="email_financial" label="Email do financeiro" />
              </Field>
            </fieldset>
            {/* 
            //region Sistema de notificação
            */}
            <fieldset>
              <legend>Sistema de notificação</legend>
              <Field infos="Limites para notificações por email.">
                <div className="form-row">
                  <div className="col">
                    <Text name="rate_send_now" type="number" label="Quantidade para envio imediato" min={1} />
                  </div>
                  <div className="col">
                    <Text name="rate_limit_per_minute" type="number" label="Quantidade de envio por minuto" min={1} />
                  </div>
                </div>
              </Field>
              <Field infos="Nome do remetente nas notificações por email.">
                <Text name="notification_sender_name" label="Nome remetente" />                  
              </Field>
              <Field infos="Separe os emails com vírgula.">
                <Text name="notification_copy" label="E-mails de cópia" />                  
              </Field>

            </fieldset>

            <fieldset className={s.fieldset}>
              <legend className={s.fieldset__legend}>Edições</legend>
              <Alert variant="info">Identifiadores das edições registradas.</Alert>
              {(evt?.getEditionsKeys()) && <ul>
                {evt?.getEditionsKeys().map((edi, idx) => {
                  return <li key={idx}>{edi}</li>
                })}
                </ul>}
              {/* <FieldArray name="editions" render={helpers => {
                return <div>{(values.editions && values.editions.length > 0)
                  ? (values.editions.map((edi, idx) => {
                    return (<div key={idx} className={s.edition}>
                      <Field infos="">
                        <Text name={`editions[${idx}].name`} label={`Nome da edição`} />
                      </Field>
                      <Field infos="">
                        <Text name={`editions[${idx}].start`} label={`Início`} type="date" />
                      </Field>
                      <Field infos="">
                        <Text name={`editions[${idx}].end`} label={`Fim`} type="date" />
                      </Field>
                    </div>)
                  }))
                  : <div>
                    <Button onClick={() => handleAddEdition(helpers)}>+</Button>
                  </div>
                }</div>
              }}>
              </FieldArray> */}
            </fieldset>

            <div className={s.limit_field}>
              <LoadingButton loading={loading} disable={!isValid} block>
                Salvar
              </LoadingButton>
            </div>

            {dump({ values, errors, isValid })}
          </Form>
        )}
      </Formik>
    </Layout>
  );
}
