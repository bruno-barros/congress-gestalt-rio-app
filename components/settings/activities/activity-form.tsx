import { ErrorMessage, Form, Formik, FormikProps } from "formik";
import { dump } from "../../../src/helpers";
import useActivity from "../../hooks/activities/useActivity";
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
import Textarea from "../../ui/form/formik/textarea";
import Switch from "../../ui/form/formik/switch";
import WpActivity from "../../../src/http/wp-activity";
import { toast } from "react-toastify";
import { invalidateQuery } from '../../hooks/useUserDocuments';
import FieldError from "../../ui/form/field-error";
import useSettingsContext from "../settings-context";
import useTaxonomies from "../../hooks/activities/useTaxonomies";
import { TaxonomyType } from "../../../src/types/taxonomy.type";
import useSettings from "../../hooks/useSettings";
import { event } from '../../../src/gtag';

interface ActivityFormProps {
  id: number;
  onUpdate: () => void;
}
export default function ActivityForm(props: ActivityFormProps) {
  const { id, onUpdate } = props;
  const { currentEdition } = useSettingsContext();
  const { data: event, currentEdition: edition } = useSettings(currentEdition)
  const abstractCnf = edition?.Abstract()
  const topics = abstractCnf?.getTopics() || []
  const modalities = abstractCnf?.getModalities() || []
  const { data, isLoading, refetch } = useActivity(id);
  const mySpeakers = data?.speakers || []
  const [loading, setLoding] = useState(false);
  const langs = availableLanguages();
  const form = useRef<FormikProps<any>>(null);
  const [dates, setDates] = useState({
    start_at: null,
    end_at: null,
  });
  const { data: taxes, isLoading: taxLoading, filterTax } = useTaxonomies(currentEdition);
  const Schema = Yup.object().shape({
    title_pt: Yup.string().required("O título PT é obrigatório"),
    start_at: Yup.string().required("Data de início é obrigatória"),
    end_at: Yup.string().required("Data de término é obrigatória"),
    start_time: Yup.string().required("Obrigatório"),
    end_time: Yup.string().required("Obrigatório"),
    workload: Yup.number().required("Obrigatório"),
    vacancies: Yup.number().required("Obrigatório"),
  });
  useEffect(()=>{
    if(!data || !data?.start_at || !data.end_at) return;
    const start = moment(data.start_at);
    const end = moment(data.end_at);
    form.current.setFieldValue("start_time", start.format("HH:mm"));
    form.current.setFieldValue("end_time", end.format("HH:mm"));
    setDates({
        start_at: start.toDate(),
        end_at: end.toDate(),
    })
  }, [data])
  //region init data
  const init = {
    title_pt: data?.title_pt || "",
    title_es: data?.title_es || "",
    title_en: data?.title_en || "",
    group_id: data?.group_id || "",
    start_at: data?.start_at || "",
    end_at: data?.end_at || "",
    start_time: "",
    end_time: "",
    description_pt: data?.description_pt || "",
    description_es: data?.description_es || "",
    description_en: data?.description_en || "",
    workload: data?.workload || "",
    vacancies: data?.vacancies || "",
    certificate: !!data?.certificate,
    active: !!data?.active,
    venue_id: data?.venue_id || "",
    room_id: data?.room_id || "",
    type_id: data?.type_id || "",
    topic_id: data?.topic_id || "",
    tax_speakers: mySpeakers.map((g) => g.id) || [],
  };

  function hasLang(lang: string) {
    return langs.includes(lang);
  }
  //region submit
  async function handleSubmit(values) {
    const start = moment(dates.start_at).format("YYYY-MM-DD");
    const end = moment(dates.end_at).format("YYYY-MM-DD");
    const start_at = `${start} ${values.start_time}:00`;
    const end_at = `${end} ${values.end_time}:00`;
    console.log(values, { start_at, end_at });

    setLoding(true);
    const axios = id === 0 
      ? await WpActivity.create({ ...values, start_at, end_at, edition: currentEdition }) 
      : await WpActivity.update(id, { ...values, start_at, end_at });
    const resp = axios.data
    setLoding(false);

    if(resp.success) {
        refetch();
      toast.success("Atividade atualizada com sucesso.");
    } else {
        toast.error(resp.message || "Erro ao atualizar atividade");
    }
    onUpdate?.();
  }
  function handleDatePicker(e, field) {
    if (!e) return;
    console.log(e, field);
    setDates({ ...dates, [field]: e });
    form.current.setFieldValue(field, moment(e).format("YYYY-MM-DD"));
  }
//region form
  return (
    <div>
      {(isLoading || taxLoading || (!data && id > 0)) && <ProgressBar />}
      <h4><span className="text-muted">#{data?.id}</span> {(data && !data.active) && <span className="badge badge-warning">inativa</span>} {data?.title} </h4>
      <Formik
        innerRef={form}
        enableReinitialize
        initialValues={init}
        onSubmit={handleSubmit}
        validationSchema={Schema}
      >
        {({ values, isValid, errors }) => (
          <Form>
            <Text name="title_pt" label="Título (português)" />
            {hasLang("es") && <Text name="title_es" label="Título (espanhol)" />}
            {hasLang("en") && <Text name="title_en" label="Título (inglês)" />}

            <Select name="tax_speakers" label="Palestrantes" multi>
                <option value="">Nenhum</option>
                {filterTax(TaxonomyType.SPEAKER).map(g => {
                return <option key={g.id} value={g.id}>{g.label}</option>;
              })}
            </Select>
            <Select name="group_id" label="Grupo">
              <option value="">Sem grupo</option>
              {filterTax(TaxonomyType.GROUP).map(g => {
                return <option key={g.id} value={g.id}>{g.label}</option>;
              })}
            </Select>

            <div className="d-flex gap-4">
                <div className="d-flex gap-2">
                <div className="form-group">
                    <label className="">Data de início</label>
                    <div>
                    <DatePicker
                        onChange={(e) => handleDatePicker(e, "start_at")}
                        value={dates.start_at}
                        locale="pt-BR"
                        format="dd/MM/y"
                    />
                    <ErrorMessage name="start_at">{m => <FieldError message={m} />}</ErrorMessage>
                    </div>
                </div>
                <Mask
                    name="start_time"
                    label="Hora de início"
                    mask="99:99"
                    placeholder="00:00"
                    style={{ width: 80 }}
                />
                </div>

                <div className="d-flex gap-2 border-left pl-4 mb-3">
                <div className="form-group">
                    <label className="">Data de término</label>
                    <div>
                        <DatePicker
                        onChange={(e) => handleDatePicker(e, "end_at")}
                        value={dates.end_at}
                        locale="pt-BR"
                        format="dd/MM/y"
                        />
                        <ErrorMessage name="end_at">{m => <FieldError message={m} />}</ErrorMessage>
                    </div>
                </div>
                <Mask
                    name="end_time"
                    label="Hora de término"
                    mask="99:99"
                    placeholder="00:00"
                    style={{ width: 80 }}
                />
                </div>
            </div>

            <Textarea name="description_pt" label="Descrição (português)" rows={2} />
            {hasLang("es") && <Textarea name="description_es" label="Descrição (espanhol)" rows={2} />}
            {hasLang("en") && <Textarea name="description_en" label="Descrição (inglês)" rows={2} />}

            <div className="row">
                <div className="col-auto" style={{width: 160}}>
                    <Text name="workload" label="Carga em minutos" type="number" placeholder="20 minutos" min={1} />
                </div>
                <div className="col-auto" style={{width: 160}}>
                    <Text name="vacancies" label="Vagas disponíveis" type="number" min={0} />
                </div>
                <div className="col-auto">
                    <div className="mt-4">
                    <Switch name="certificate" label="Atividade gera certificado?" />
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col">
                    <Select name="venue_id" label="Local">
                        <option value="">Sem local</option>
                        {filterTax(TaxonomyType.VENUE).map(g => {
                          return <option key={g.id} value={g.id}>{g.label}</option>;
                        })}
                    </Select>
                </div>
                <div className="col">
                <Select name="room_id" label="Sala">
                        <option value="">Sem sala</option>
                        {filterTax(TaxonomyType.ROOM).map(g => {
                          return <option key={g.id} value={g.id}>{g.label}</option>;
                        })}
                    </Select>
                </div>
            </div>
            
            <div className="row">
                <div className="col">
                <Select name="topic_id" label="Se relaciona com o tema">
                        <option value="">Nenhum</option>
                        {topics.map(g => {
                          return <option key={g.id} value={g.id}>{g.pt}</option>;
                        })}
                    </Select>
                </div>
                <div className="col">
                    <Select name="type_id" label="Se relaciona com a modalidade">
                        <option value="">Nenhuma</option>
                        {modalities.map(g => {
                          return <option key={g.id} value={g.id}>{g.pt}</option>;
                        })}
                    </Select>
                </div>
            </div>

            <Switch name="active" label="Atividade está ativa?" />            

            <LoadingButton block loading={loading}>
              Salvar
            </LoadingButton>
            {dump({errors, values})}
          </Form>
        )}
      </Formik>
    </div>
  );
}
