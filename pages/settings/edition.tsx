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
                <Image name="logo" label="Logo do evento" />
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
