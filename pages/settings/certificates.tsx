"use client";
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
import Text from "../../components/ui/form/formik/text";
import Textarea from "../../components/ui/form/formik/textarea";
import Image from "../../components/ui/form/formik/image";
import Layout from "../../components/settings/settings-layout";
import s from "../../components/settings/settings.module.scss";
import { useState } from "react";
import * as Yup from "yup";
import { WpSettings } from "../../src/http/wp-settings";
import { toast } from "react-toastify";
import { Field as FormikField, Form, Formik, FieldArray } from "formik";
import { Field } from "../../components/settings/settings-helpers";
import Select from "../../components/ui/form/formik/select";
import LoadingButton from "../../components/ui/loading-button";
import DateRange from "../../components/ui/form/formik/date-range";
import Loading from "../../components/ui/loading";
import Topics from "../../components/settings/fields/topics";
import LangIndicator from "../../components/settings/lang-indicator";
import { AbstractStatusModelEnum } from "../../src/types/abstracts.d";
import Wysiwyg from "../../components/ui/form/formik/wysiwyg";
import ButtonVariables from "../../components/settings/button-variables";

export default function Context() {
  return (
    <SettingsContextProvider>
      <CertificatePage />
    </SettingsContextProvider>
  );
}

function CertificatePage() {
  const { lang, setLang, currentEdition } = useSettingsContext();
  const { data: evt, isLoading, isFetching } = useSettings(currentEdition);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  //region Initial Values
  const initialValues = {
    default_image: "",
    default_orientation: "h",
    participation_allowed: "1" == "1",
    participation_text_pt: "",
    participation_text_en: "",
    participation_text_es: "",
    abstract_allowed: "1" == "1",
    abstract_text_pt: "",
    abstract_text_en: "",
    abstract_text_es: "",
    activity_allowed: "1" == "1",
    activity_text_pt: "",
    activity_text_en: "",
    activity_text_es: "",

    // days_to_evaluate: evt?.review?.days_to_evaluate || 15,
    // days_for_corrections: evt?.review?.days_for_corrections || 15,
    // questions: evt?.review?.questions || [],
    // evaluators_text_pt: evt?.review?.evaluators_text_pt || "",
    // evaluators_text_en: evt?.review?.evaluators_text_en || "",
    // evaluators_text_es: evt?.review?.evaluators_text_es || "",
  };
  //region Validation Schema
  const validationSchema = Yup.object({
    // name: Yup.string().required("Obrigatório"),
    // email_general: Yup.string().email('Inválido').required('Obrigatório'),
    // email_financial: Yup.string().email('Inválido').required('Obrigatório'),
  });

  function handleSubmit(values) {
    // console.log(values);
    setLoading(true);
    WpSettings.save({
      group: "certificate",
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
        Certificado
        <LangSelector />
        {(isLoading || isFetching) && <Loading />}
      </h2>
      {/* {dump({
        lang,
        currentEdition,
        end_at: evt?.abstract?.end_at,
        moment: moment(evt?.abstract?.end_at).format("YYYY-MM-DD"),
      })} */}

      <Formik
        enableReinitialize
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        {({ values, errors, isValid }) => (            
          <Form>
            {/*
            //region Form
            */}
            <Field infos="Imagem padrão do certificado. Atenção: a imagem deve ter a proporção A4, em pé ou deitada, em JPEG.">
                <Image name="default_image" label="Arte do certicado padrão" imgStyle={{maxHeight: 300}} />
            </Field>
            <p>Orientação: {values.default_orientation}</p>

            <Field infos="Se habilitado, libera certificado para os inscritos que confirmaram a presença no evento." 
                style={{marginBottom: 0, border: 'none'}}>
                <br />
                <Switch name="participation_allowed" label="Habilita certificado por participação" />
            </Field>
            <fieldset disabled={values.participation_allowed === false} className="border-primary pl-3 mb-4" style={{borderLeft: "solid 2px"}}>
                <legend className="text-sm text-uppercase pt-2 text-primary">Por participação</legend>
                <Field infos={<div>Texto do certificado. Use os <ButtonVariables>dados variáveis</ButtonVariables>.</div>}>
                    <Wysiwyg
                        name={`participation_text_${lang}`}
                        label={<LangIndicator lang={lang}>Texto do certificado</LangIndicator>}
                        charsMin={0}
                        charsMax={500}
                        disabled={values.participation_allowed === false}
                    />
                </Field>
            </fieldset>

            <Field infos="Se habilitado, libera certificado para os trabalhos aprovados." 
                style={{marginBottom: 0, border: 'none'}}>
                <br />
                <Switch name="abstract_allowed" label="Habilita certificado para os trabalhos" />
            </Field>
            <fieldset disabled={values.abstract_allowed === false} className="border-primary pl-3 mb-4" style={{borderLeft: "solid 2px"}}>
                <legend className="text-sm text-uppercase pt-2 text-primary">Por trabalho</legend>
                <Field infos={<div>Texto do certificado. Use os <ButtonVariables>dados variáveis</ButtonVariables>.</div>}>
                    <Wysiwyg
                        name={`abstract_text_${lang}`}
                        label={<LangIndicator lang={lang}>Texto do certificado</LangIndicator>}
                        charsMin={0}
                        charsMax={500}
                        disabled={values.abstract_allowed === false}
                    />
                </Field>
            </fieldset>
            
            <Field infos="Se habilitado, libera certificado para as atividades com presença confirmada." 
                style={{marginBottom: 0, border: 'none'}}>
                <br />
                <Switch name="activity_allowed" label="Habilita certificado para as atividades" />
            </Field>
            <fieldset disabled={values.activity_allowed === false} className="border-primary pl-3 mb-4" style={{borderLeft: "solid 2px"}}>
                <legend className="text-sm text-uppercase pt-2 text-primary">Por atividade</legend>
                <Field infos={<div>Texto do certificado. Use os <ButtonVariables>dados variáveis</ButtonVariables>.</div>}>
                    <Wysiwyg
                        name={`activity_text_${lang}`}
                        label={<LangIndicator lang={lang}>Texto do certificado</LangIndicator>}
                        charsMin={0}
                        charsMax={500}
                        disabled={values.activity_allowed === false}
                    />
                </Field>
            </fieldset>
            
            <div className={s.action_field}>
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
