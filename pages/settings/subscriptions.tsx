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
import useProductCategories from "../../components/hooks/useProductCategories";
import LangIndicator from "../../components/settings/lang-indicator";
import Wysiwyg from "../../components/ui/form/formik/wysiwyg";
import ProgressBar from "../../components/ui/progressbar";
import Checkboxes from "../../components/ui/form/formik/checkboxes";
import useProducts from "../../components/hooks/useProducts";
import { camelToWords } from '../../src/resources/objects';

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
    plans_description_pt: evt?.subscription.plans_description_pt || '',
    plans_description_en: evt?.subscription.plans_description_en || '',
    plans_description_es: evt?.subscription.plans_description_es,
    produts_excluded_for_foreign: evt?.subscription.produts_excluded_for_foreign || [],
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
                {catLoading && <ProgressBar />}
                <Select label="Categoria de produtos" name="category_id">
                  <option value="">Selecione</option>
                  {(categories && categories.length > 0) && categories.map(cat => {
                    return <option key={cat.databaseId} value={cat.databaseId}>{cat.name}</option>
                  })}
                </Select>
            </Field>

            
            <Field infos="."> 
                {catLoading && <ProgressBar />}
                <ProductsExcluded category={values.category_id} />
            </Field>

            <Field infos="Texto que será exibido na tela de seleção do plano (pacote).">
              <Wysiwyg
                name={`plans_description_${lang}`}
                label={<LangIndicator lang={lang}>Observações sobre planos de inscrição</LangIndicator>}
                 charsMax={500}
                 />
            </Field>


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

function ProductsExcluded({category}: {category: number|string}){
  const { data: products, isLoading } = useProducts(Number(category));
  const options = (products && products.length) ? products?.map(prod => {
    return {value: `${prod.databaseId}`, label: prod.name}
  }) : [];
  return <div>
    {isLoading && <ProgressBar />}
    {(!isLoading && options.length === 0) && <p>Nenhum produto cadastrado para esta categoria</p>}
    {(options.length > 0) && <Checkboxes 
      label="Produtos excluídos para estrangeiros" 
      name="produts_excluded_for_foreign"
      options={options} />}
    
  </div>
}