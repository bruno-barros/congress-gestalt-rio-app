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
import Layout from "./layout";
import s from "./settings.module.scss";
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

export default function Context() {
  return (
    <SettingsContextProvider>
      <Abstracts />
    </SettingsContextProvider>
  );
}

function Abstracts() {
  const { lang, setLang, currentEdition } = useSettingsContext();
  const { data: evt, isLoading, isFetching } = useSettings(currentEdition);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const initialValues = {
    abstract_allowed: evt?.abstract.abstract_allowed === "1",
    only_subscribed: evt?.abstract.only_subscribed === "1",
    status_model: evt?.abstract.status_model || "sinopse_abstract",
    start_at: evt?.abstract.start_at,
    end_at: evt?.abstract.end_at,
    limit_per_user: evt?.abstract.limit_per_user || 1,
    fn_fields: evt?.abstract.fields || [],
    topics: evt?.abstract.topics || [],
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
            <Switch
              name="abstract_allowed"
              label="Permitir submissão de trabalhos"
            />
            
            <Switch
              name="only_subscribed"
              label="Apenas inscritos podem submeter trabalhos"
            />

            <DateRange
              label="Período de submissão dos trabalhos"
              startDateName="start_at"
              endDateName="end_at"
              dateFormat="YYYY-MM-DD"
              defaultValue={[values.start_at, values.end_at]}
            />
            <Field infos="Se o sistema de avaliação for somente por trabalho, a sinopse será ignorada.">
              <Select name="status_model" label="Sistema de avaliação">
                <option value="sinopse_abstract">Sinopse e Trabalho</option>
                <option value="abstract">Somente trabalho</option>
              </Select>
            </Field>
            <Field infos="Quantidade máxima de trabalhos enviados por autor.">
              <Text
                name="limit_per_user"
                label="Limite de trabalhos por autor"
                type="number"
                min={1}
                />
            </Field>
            {/* 
            //region Campos dos trabalhos
            */}
            <fieldset>
              <legend>Campos dos trabalhos</legend>
              <Field infos="Título do trabalho." noLabel>
                <b>Título</b>
                <div className="d-flex gap-2">
                <Text name="fn_fields.title.min" label="Mínimo" min={0} type="number" />
                <Text name="fn_fields.title.max" label="Máximo" min={0} type="number" />
                </div>
              </Field>
              <Field infos="Subtítulo do trabalho." noLabel>
                <Switch
                  name="fn_fields.subtitle.allowed"
                  // value="1"
                  label={<b>Subtítulo</b>}
                />
                <div className="d-flex gap-2">
                <Text name="fn_fields.subtitle.min" label="Mínimo" min={0} type="number" disabled={!values.fn_fields?.subtitle?.allowed} />
                <Text name="fn_fields.subtitle.max" label="Máximo" min={0} type="number" disabled={!values.fn_fields?.subtitle?.allowed} />
                </div>
              </Field>
              <Field infos="Lista de tópicos ou categorias." noLabel>
                <Switch
                  name="fn_fields.topic.allowed"
                  // value="1"
                  label={<b>Tópicos</b>}
                />
                {/* <div className="d-flex gap-2">
                <Text name="fn_fields.topic.min" label="Mínimo" min={0} type="number" disabled={!values.fn_fields?.topic?.allowed} />
                <Text name="fn_fields.topic.max" label="Máximo" min={0} type="number" disabled={!values.fn_fields?.topic?.allowed} />
                </div> */}
              </Field>
              <Field infos="Palavras-chave." noLabel>
                <Switch
                  name="fn_fields.tags.allowed"
                  // value="1"
                  label={<b>Palavras-chave</b>}
                />
                <div className="d-flex gap-2">
                <Text name="fn_fields.tags.min" label="Mínimo" min={0} type="number" disabled={!values.fn_fields?.tags?.allowed} />
                <Text name="fn_fields.tags.max" label="Máximo" min={0} type="number" disabled={!values.fn_fields?.tags?.allowed} />
                </div>
              </Field>
              <Field infos="Campo de resumo ou sinópse." noLabel>
                <Switch
                  name="fn_fields.resume.allowed"
                  // value="1"
                  label={<b>Resumo</b>}
                />
                <div className="d-flex gap-2">
                <Text name="fn_fields.resume.min" label="Mínimo" min={0} type="number" disabled={!values.fn_fields?.resume?.allowed} />
                <Text name="fn_fields.resume.max" label="Máximo" min={0} type="number" disabled={!values.fn_fields?.resume?.allowed} />
                </div>
              </Field>
              <Field infos="Campo de conteúdo." noLabel>
                <Switch
                  name="fn_fields.content.allowed"
                  // value="1"
                  label={<b>Conteúdo</b>}
                />
                <div className="d-flex gap-2">
                <Text name="fn_fields.content.min" label="Mínimo" min={0} type="number" disabled={!values.fn_fields?.content?.allowed} />
                <Text name="fn_fields.content.max" label="Máximo" min={0} type="number" disabled={!values.fn_fields?.content?.allowed} />
                </div>
              </Field>
              <Field infos="Campo de bibliografia." noLabel>
                <Switch
                  name="fn_fields.bibliography.allowed"
                  // value="1"
                  label={<b>Bibliografia</b>}
                />
                <div className="d-flex gap-2">
                <Text name="fn_fields.bibliography.min" label="Mínimo" min={0} type="number" disabled={!values.fn_fields?.bibliography?.allowed} />
                <Text name="fn_fields.bibliography.max" label="Máximo" min={0} type="number" disabled={!values.fn_fields?.bibliography?.allowed} />
                </div>
              </Field>
              <Field infos="Possibilidade de anexar documentos ao trabalho." noLabel>
                <Switch
                  name="fn_fields.attachments.allowed"
                  // value="1"
                  label={<b>Anexos</b>}
                />
                <div className="d-flex gap-2">
                <Text name="fn_fields.attachments.min" label="Mínimo" min={0} type="number" disabled={!values.fn_fields?.attachments?.allowed} />
                <Text name="fn_fields.attachments.max" label="Máximo" min={0} type="number" disabled={!values.fn_fields?.attachments?.allowed} />
                </div>
              </Field>
              <Field infos="Quantidade de co-autores." noLabel>
                <Switch
                  name="fn_fields.authors.allowed"
                  // value="1"
                  label={<b>Co-autores</b>}
                />
                <div className="d-flex gap-2">
                <Text name="fn_fields.authors.min" label="Mínimo" min={0} type="number" disabled={!values.fn_fields?.authors?.allowed} />
                <Text name="fn_fields.authors.max" label="Máximo" min={0} type="number" disabled={!values.fn_fields?.authors?.allowed} />
                </div>
              </Field>
            </fieldset>
{/* 
//region Tópicos
*/}
            <fieldset>
              <legend>Tópicos</legend>
              {values.fn_fields?.topic?.allowed 
                ? <Topics name="topics" /> 
                : <div className="badge badge-secondary">Tópicos desativados</div>}
              
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
