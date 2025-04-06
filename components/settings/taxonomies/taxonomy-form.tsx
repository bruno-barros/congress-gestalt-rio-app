import { ErrorMessage, Form, Formik, FormikProps } from "formik";
import { dump } from "../../../src/helpers";
import ProgressBar from "../../ui/progressbar";
import * as Yup from "yup";
import Text from "../../ui/form/formik/text";
import LoadingButton from "../../ui/loading-button";
import { useEffect, useRef, useState } from "react";
import { availableLanguages } from "../../../src/i18n";
import Select from "../../ui/form/formik/select";
import DatePicker from "react-date-picker";
import moment from "moment";
import Mask from "../../ui/form/formik/mask";
import Image from "../../ui/form/formik/image";
import Textarea from "../../ui/form/formik/textarea";
import Switch from "../../ui/form/formik/switch";
import { toast } from "react-toastify";
import { invalidateQuery } from "../../hooks/useUserDocuments";
import FieldError from "../../ui/form/field-error";
import useSettingsContext from "../settings-context";
import useTaxonomy from "../../hooks/activities/useTaxonomy";
import WpTaxonomy from "../../../src/http/wp-taxonomy";
import useTaxonomyContext from "./taxonomies-context";
import { getTaxonomyTypeLabel } from "../../../src/resources/taxonomy";


interface TaxonomyFormProps {
  id: number;
  onUpdate: () => void;
}
export default function TaxonomyForm(props: TaxonomyFormProps) {
  const { id, onUpdate } = props;
  const {lang, currentEdition } = useSettingsContext();
  const { taxonmy } = useTaxonomyContext();
  const single = getTaxonomyTypeLabel(taxonmy, lang, false);
  const { data, isLoading, refetch } = useTaxonomy(id);
  const [loading, setLoding] = useState(false);
  const langs = availableLanguages();
  const form = useRef<FormikProps<any>>(null);
  const [dates, setDates] = useState({
    start_at: null,
    end_at: null,
  });
  const Schema = Yup.object().shape({
    label_pt: Yup.string().required("O título PT é obrigatório"),
    // start_at: Yup.string().required("Data de início é obrigatória"),
    // end_at: Yup.string().required("Data de término é obrigatória"),
    // start_time: Yup.string().required("Obrigatório"),
    // end_time: Yup.string().required("Obrigatório"),
    // workload: Yup.number().required("Obrigatório"),
    // vacancies: Yup.number().required("Obrigatório"),
  });

//region init data
  const init = {
    // edition: '',
	// type: data?.type || '',
	label_pt: data?.label_pt || '',
	label_es: data?.label_es || '',
	label_en: data?.label_en || '',
	external_id: data?.external_id || '',
	description_pt: data?.description_pt || '',
	description_es: data?.description_es || '',
	description_en: data?.description_en || '',
	img: data?.img || '',
	active: !!data?.active,
  };

  function hasLang(lang: string) {
    return langs.includes(lang);
  }
  async function handleSubmit(values) {    

    setLoding(true);
    const axios =
      id === 0
        ? await WpTaxonomy.create({
            ...values, edition: currentEdition, type: taxonmy,
          })
        : await WpTaxonomy.update(id, { ...values });
    const resp = axios.data;
    setLoding(false);

    if (resp.success) {
      refetch();
      toast.success(`${single} atualizado com sucesso.`);
    } else {
      toast.error(resp.message || `Erro ao atualizar ${single}`);
    }
    onUpdate?.();
  }


  return (
    <div>
      {(isLoading || (!data && id > 0)) && <ProgressBar />}
      <h4>
        <span className="text-muted">{single}#{data?.id}</span>{" "}
        {data && !data.active && (
          <span className="badge badge-warning">inativa</span>
        )}{" "}
        {data?.label}{" "}
      </h4>
      <Formik
        innerRef={form}
        enableReinitialize
        initialValues={init}
        onSubmit={handleSubmit}
        validationSchema={Schema}
      >
        {({ values, isValid, errors }) => (
          <Form>
            <Image name="img" label="Imagem" imgStyle={{maxHeight: 120}} />
            <Text name="label_pt" label="Nome (português)" />
            {hasLang("es") && <Text name="label_es" label="Nome (espanhol)" />}
            {hasLang("en") && <Text name="label_en" label="Nome (inglês)" />}


            <Textarea
              name="description_pt" label="Descrição (português)" rows={2}/>
            {hasLang("es") && (
              <Textarea
                name="description_es" label="Descrição (espanhol)" rows={2} />
            )}
            {hasLang("en") && (
              <Textarea
                name="description_en" label="Descrição (inglês)" rows={2} />
            )}

            <Switch name="active" label={`${single} está ativa?`} />

            <LoadingButton block loading={loading}>
              Salvar
            </LoadingButton>
            {dump({ errors, values })}
          </Form>
        )}
      </Formik>
    </div>
  );
}
