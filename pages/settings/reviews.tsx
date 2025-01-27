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

export default function Context() {
  return (
    <SettingsContextProvider>
      <ReviewsPage />
    </SettingsContextProvider>
  );
}

function ReviewsPage() {
  const { lang, setLang, currentEdition } = useSettingsContext();
  const { data: evt, isLoading, isFetching } = useSettings(currentEdition);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const initialValues = {
    evaluators_final_approvement: evt?.review?.evaluators_final_approvement === "1",
    days_to_evaluate: evt?.review?.days_to_evaluate || 15,
    days_for_corrections: evt?.review?.days_for_corrections || 15,
    questions: evt?.review?.questions || [],
    evaluators_text_pt: evt?.review?.evaluators_text_pt || "",
    evaluators_text_en: evt?.review?.evaluators_text_en || "",
    evaluators_text_es: evt?.review?.evaluators_text_es || "",
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
      group: "review",
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
        Revisão
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

            <Field infos="Se habilitado, os pareceristas poderão dar a aprovação final sem precisar de moderação.">
                <br />
                <Switch
                name="evaluators_final_approvement"
                label="Pareceristas podem aprovar trabalhos"
                />
            </Field>
            <Field infos="Após este prazo, a avaliação será arquivada.">
              <Text
                name="days_to_evaluate"
                label="Dias para fazer a avaliação"
                type="number"
                min={0}
              />
            </Field>
            <Field infos="Após este prazo, o trabalho voltará para status 'pendente'.">
              <Text
                name="days_for_corrections"
                label="Dias para autor fazer correções"
                type="number"
                min={0}
              />
            </Field>
            <Field infos="Texto que será exibido na tela de avaliação. Pode conter instruções, dicas, etc.">
                <Wysiwyg
                name={`evaluators_text_${lang}`}
                label={<LangIndicator lang={lang}>Texto de ajuda ao avaliador</LangIndicator>}
                charsMin={0}  charsMax={500}
                    />
            </Field>
            
            {/* 
            //region Questões
            */}
            <fieldset>
                <legend>Questões</legend>
                <div className="text-sm">Perguntas com respostas Sim/Não que os pareceristas deverão responder:</div>               
                <Topics name="questions" />
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
