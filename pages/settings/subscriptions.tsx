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
import useProductCategories from "../../components/hooks/useProductCategories";

export default function Context() {
  return (
    <SettingsContextProvider>
      <Subscription />
    </SettingsContextProvider>
  );
}

function Subscription() {
  const { lang, setLang, currentEdition } = useSettingsContext();
  const { data: evt, isLoading, isFetching } = useSettings(currentEdition);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const { data: categories, isLoading: catLoading } = useProductCategories()

  const initialValues = {
    allowed: evt?.subscription.allowed === "1",
    start_at: evt?.subscription.start_at,
    end_at: evt?.subscription.end_at,
    category_id: evt?.subscription.category_id || '',
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
      group: "subscription",
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
        Inscrições
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
              name="allowed"
              label="Permitir inscrições"
            />

            <Field infos="Período em que se pode fazer inscrição. Não confundir com o período do evento.">
              <DateRange
                label="Período de inscrição"
                startDateName="start_at"
                endDateName="end_at"
                dateFormat="YYYY-MM-DD"
                defaultValue={[values.start_at, values.end_at]}
              />
            </Field>
          
            <Field infos="Identificação da categoria no módulo de vendas. Isso permite separar as inscrições deste evento.">            
                <Select label="Categoria de produtos" name="category_id">
                  <option value="">Selecione</option>
                  {(categories && categories.length > 0) && categories.map(cat => {
                    return <option key={cat.databaseId} value={cat.databaseId}>{cat.name}</option>
                  })}

                </Select>
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
