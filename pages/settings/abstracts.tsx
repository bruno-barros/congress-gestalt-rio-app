'use client';
import { useQueryClient } from "react-query";
import useSettings, {
  invalidateSettings,
} from "../../components/hooks/useSettings";
import LangSelector from "../../components/settings/lang-selector";
import useSettingsContext, {
  SettingsContextProvider,
} from "../../components/settings/settings-context";
import Switch from "../../components/ui/form/formik/switch";
import { dump } from "../../src/helpers";

import Layout from "./layout";
import s from "./settings.module.scss";
import { useState } from "react";
import * as Yup from "yup";
import { WpSettings } from "../../src/http/wp-settings";
import { toast } from "react-toastify";
import { Field as FormikField, Form, Formik } from "formik";
import { Field } from "../../components/settings/settings-helpers";
import Select from "../../components/ui/form/formik/select";
import LoadingButton from "../../components/ui/loading-button";
import DateRange from "../../components/ui/form/formik/date-range";

export default function Context() {
  return (
    <SettingsContextProvider>
      <Global />
    </SettingsContextProvider>
  );
}



function Global() {
  const { lang, setLang, currentEdition } = useSettingsContext();
  const { data: evt, isLoading, isFetching } = useSettings();
  const [Loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  

  const initialValues = {
    abstract_allowed: evt?.abstract.abstract_allowed === "1",
    status_model: evt?.abstract.status_model || 'sinopse_abstract',
    start_at: evt?.abstract.start_at,
    end_at: evt?.abstract.end_at,
  };
  const validationSchema = Yup.object({
    // name: Yup.string().required("Obrigatório"),
    // email_general: Yup.string().email('Inválido').required('Obrigatório'),
    // email_financial: Yup.string().email('Inválido').required('Obrigatório'),
  });

  function handleSubmit(values) {
    // console.log(values);
    setLoading(true);
    WpSettings.save({
      group: "abstract",
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
        Trabalhos
        <LangSelector />
      </h2>
      {dump({ lang, currentEdition })}

      <Formik
        enableReinitialize
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        {({ values, errors, isValid }) => (
          <Form>
            <Switch
              name="abstract_allowed"
              label="Permitir submissão de trabalhos"
            />
            <DateRange label="Período de submissão dos trabalhos" startDateName="start_at" endDateName="end_at" dateFormat="YYYY-MM-DD" />
            <Field infos="Se o sistema de avaliação for somente por trabalho, a sinopse será ignorada.">
              <Select name="status_model" label="Sistema de avaliação">
                <option value="sinopse_abstract">Sinopse e Trabalho</option>
                <option value="abstract">Somente trabalho</option>
              </Select>
            </Field>
            
            <fieldset>
              <legend>Status dos trabalhos</legend>
              <Field infos="Não pode ser alterado." noLabel>
                <Switch
                  name="statuses.pending"
                  disabled
                  value="1"
                  label="Trabalho em edição pelo autor."
                />
              </Field>
            </fieldset>
            
            <div className={s.limit_field}>
              <LoadingButton loading={Loading} disable={!isValid} block>
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
