"use client";
import { FieldArray, FieldArrayRenderProps, Form, Formik } from "formik";
import Layout from "../../components/settings/settings-layout";
import s from "../../components/settings/settings.module.scss";
import * as Yup from "yup";
import { dump } from "../../src/helpers";
import Text from "../../components/ui/form/formik/text";
import Textarea from "../../components/ui/form/formik/textarea";
import { Field } from "../../components/settings/settings-helpers";
import useSettingsContext, {
  SettingsContextProvider,
} from "../../components/settings/settings-context";
import LangSelector from "../../components/settings/lang-selector";
import useSettings, {
  invalidateSettings,
} from "../../components/hooks/useSettings";
import { useState } from "react";
import { WpSettings } from "../../src/http/wp-settings";
import { toast } from "react-toastify";
import Phone from "../../components/ui/form/formik/phone";
import { useQueryClient } from "react-query";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import LoadingButton from "../../components/ui/loading-button";
import Loading from "../../components/ui/loading";
import Image from "../../components/ui/form/formik/image";
import DateRange from "../../components/ui/form/formik/date-range";
import { start } from "repl";
import LangIndicator from "../../components/settings/lang-indicator";
import Select from "../../components/ui/form/formik/select";
import Wysiwyg from "../../components/ui/form/formik/wysiwyg";
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

  const initialValues = {
    name: evt?.edition?.name || "",
    logo: evt?.edition?.logo || "",
    start_at: evt?.edition?.start_at,
    end_at: evt?.edition?.end_at,
    lgpd_url_pt: evt?.edition?.lgpd_url_pt || "",
    lgpd_url_en: evt?.edition?.lgpd_url_en || "",
    lgpd_url_es: evt?.edition?.lgpd_url_es || "",
    welcome_email_allowed: evt?.edition?.welcome_email_allowed || "0",
    welcome_email_content_pt: evt?.edition?.welcome_email_content_pt || "",
    welcome_email_content_en: evt?.edition?.welcome_email_content_en || "",
    welcome_email_content_es: evt?.edition?.welcome_email_content_es || "",
  };
  const validationSchema = Yup.object({
    name: Yup.string().required("Nome é obrigatório"),
  });

  function handleSubmit(values) {
    // console.log(values);
    setLoading(true);
    WpSettings.save({
      group: "edition",
      edition: currentEdition,
      fields: values,
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

  return (
    <Layout>
      <h2 className={s.title}>
        Edição
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
            <Field infos="Nome usado nessa edição.">
                <Text name="name" label="Nome" />
            </Field>
            <Field infos="Tamanho recomendado: 300 px de largura.">
                <Image name="logo" label="Logo do evento" imgStyle={{maxHeight: 120}} />
            </Field>
            <DateRange
              label="Período da edição"
              startDateName="start_at"
              endDateName="end_at"
              dateFormat="YYYY-MM-DD"
              defaultValue={[values.start_at, values.end_at]}
            />
            <Field infos="Endereço da página com a Política de Privacidade.">
                <Text name={`lgpd_url_${lang}`} label={<LangIndicator lang={lang}>Link da Política de Privacidade</LangIndicator>} />
            </Field>
            <Field infos="E-mail enviado quando participante faz o cadastro.">
                <Select name="welcome_email_allowed" label="Permitir envio de email de boas-vindas">
                  <option value="1">Sim</option>
                  <option value="0">Não</option>
                </Select>
            </Field>
            <Field infos="Conteúdo do e-mail enviado quando participante faz o cadastro. Máximo de 1.500 caracteres.">
                <Wysiwyg name={`welcome_email_content_${lang}`} label={<LangIndicator lang={lang}>Mensagem de boas vindas</LangIndicator>} charsMax={1500} charsMin={0} disabled={values.welcome_email_allowed === '0'} />
            </Field>
            

         

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
