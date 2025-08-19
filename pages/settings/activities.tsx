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
import { useReducer, useState } from "react";
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
import Button from "react-bootstrap/Button";
import CustomSidePane from "../../components/side-pane/side-pane";
import ListAcivities from "../../components/settings/activities/list-activities";
import { ActivityContextProvider } from "../../components/settings/activities/activities-context";
import useTaxonomyContext, { TaxonomyContextProvider } from "../../components/settings/taxonomies/taxonomies-context";
import ListTaxonomies from "../../components/settings/taxonomies/list-taxonomies";
import { TaxonomyType } from "../../src/types/taxonomy.type";
import useTaxonomies from "../../components/hooks/activities/useTaxonomies";
import useActivities from "../../components/hooks/activities/useActivities";
import DatePicker from "../../components/ui/form/formik/date-picker";


export default function Context() {
  return (
    <SettingsContextProvider>
      <ActivityContextProvider>
        <TaxonomyContextProvider>
          <ActivitiesPage />
        </TaxonomyContextProvider>
      </ActivityContextProvider>
    </SettingsContextProvider>
  );
}

function ActivitiesPage() {
  const { lang, setLang, currentEdition } = useSettingsContext();
  const { setTaxonmy } = useTaxonomyContext();
  const { data: evt, isLoading, isFetching } = useSettings(currentEdition);
  const { data: taxes, filterTax, isLoading: taxloading } = useTaxonomies(currentEdition)
  const { data: activities } = useActivities(currentEdition);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const [sidePanelOpenActivities, dispatchOpenActivities] = useReducer((p) => !p, false);
  const [sidePanelTaxonomy, dispatchTaxonomy] = useReducer((p) => !p, false);

  const speakersCount = filterTax(TaxonomyType.SPEAKER).length
  const groupsCount = filterTax(TaxonomyType.GROUP).length
  const venuesCount = filterTax(TaxonomyType.VENUE).length
  const roomsCount = filterTax(TaxonomyType.ROOM).length
  const acvtCount = activities?.length || 0

  //region Initial Values
  const initialValues = {
    activities_allowed: evt?.activity?.activities_allowed === "1",
    test_mode: evt?.activity?.test_mode === "1",
    start_at: evt?.activity?.start_at,
    end_at: evt?.activity?.end_at,
    limit_per_participant: evt?.activity?.limit_per_participant,
    cancel_limit_at: evt?.activity?.cancel_limit_at,
    checkin_allowed: evt?.activity?.checkin_allowed === "1",
    ckeckin_minutes_before: evt?.activity?.ckeckin_minutes_before || 10,
    ckeckin_minutes_after: evt?.activity?.ckeckin_minutes_after || 10,
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
      group: "activity",
      edition: currentEdition,
      fields: values,
    })
      .then((axios) => {
        const resp = axios.data;
        if(resp.success){
          toast.success("Configurações salvas com sucesso");
        } else {
          toast.error("Erro ao salvar configurações:"+ resp.message);
        }
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
        Atividades
        <LangSelector />
        {(isLoading || isFetching || taxloading) && <Loading />}
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
            <Switch
                name="activities_allowed"
                label="Permitir inscrição nas atividades"
            />
            
            <Switch
                name="test_mode"
                label="Habilitado APENAS para admins e pareceristas (modo de teste)"
            />

            <DateRange
                label="Período de inscrição nas atividades"
                startDateName="start_at"
                endDateName="end_at"
                dateFormat="YYYY-MM-DD"
                defaultValue={[values.start_at, values.end_at]}
            />

            <Field infos="Data limite para que os participantes possam de desisncrever de uma atividade.">
              <DatePicker
              name="cancel_limit_at"
              label="Prazo para cancelamento de atividades"
              dateFormat="YYYY-MM-DD"
              defaultValue={values.cancel_limit_at}
              />
            </Field>

            <Field infos="Número máximo de atividades que um participante pode se inscrever.">
                <Text
                    name="limit_per_participant"
                    label="Limite de atividades por participante"
                    placeholder="deixe vazio para ilimitado"
                />
            </Field>
            <Switch
                name="checkin_allowed"
                label="Permitir fazer Check-In"
            />
            <Field infos="">
                <Text
                    name="ckeckin_minutes_before"
                    label="Minutos antes do início da atividade para check-in"
                />
            </Field>
            <Field infos="">
                <Text
                    name="ckeckin_minutes_after"
                    label="Minutos após o início da atividade para check-in"
                />
            </Field>

            <div className={s.action_field}>
              <LoadingButton loading={loading} disable={!isValid} block>
                Salvar
              </LoadingButton>
            </div>
            {/* {dump({ values, errors, isValid })} */}

{/*
 //region Atividades
 */}
            <hr />
            <fieldset className="d-flex gap-5 align-items-center justify-content-between">
              <div>
                <legend>Atividades ({acvtCount})</legend>
                <p className="text-sm text-muted">Cada atividade que permite inscrição pelos usuários.</p>
              </div>
                <Button type="button" variant="outline-primary" className="text-nowrap" onClick={dispatchOpenActivities} style={{minWidth: 180}}>Gerenciar atividades</Button>
            </fieldset>
{/*
 //region Palestrantes
 */}
            <hr />
            <fieldset className="d-flex gap-5 align-items-center justify-content-between">
              <div>
                <legend>Palestrantes ({speakersCount})</legend>
                <p className="text-sm text-muted">Pessoas responsáveis por cada atividade.</p>
              </div>
              <Button type="button" variant="outline-primary" className="text-nowrap" onClick={() => {
                setTaxonmy(TaxonomyType.SPEAKER);
                dispatchTaxonomy();
              }} style={{minWidth: 180}}>Gerenciar palestrantes</Button>
            </fieldset>
{/*
 //region Grupos
 */}
            <hr />
            <fieldset className="d-flex gap-5 align-items-center justify-content-between">
              <div>
                <legend>Grupos de atividades ({groupsCount})</legend>
                <p className="text-sm text-muted">Permite agrupar atividades sob um mesmo nome.</p>
              </div>
              <Button type="button" variant="outline-primary" className="text-nowrap" onClick={() => {
                setTaxonmy(TaxonomyType.GROUP);
                dispatchTaxonomy();
              }} style={{minWidth: 180}}>Gerenciar grupos</Button>
            </fieldset>
{/*
 //region Local
 */}
            <hr />
            <fieldset className="d-flex gap-5 align-items-center justify-content-between">
              <div>
                <legend>Local da atividade ({venuesCount})</legend>
                <p className="text-sm text-muted">Endereço físico da atividade.</p>
              </div>
              <Button type="button" variant="outline-primary" className="text-nowrap" onClick={() => {
                setTaxonmy(TaxonomyType.VENUE);
                dispatchTaxonomy();
              }} style={{minWidth: 180}}>Gerenciar locais</Button>
            </fieldset>
{/*
 //region Sala
 */}
            <hr />
            <fieldset className="d-flex gap-5 align-items-center justify-content-between">
              <div>
                <legend>Sala da atividade ({roomsCount})</legend>
                <p className="text-sm text-muted">Localização da sala (ambiente) onde ocorre as atividades.</p>
              </div>
              <Button type="button" variant="outline-primary" className="text-nowrap" onClick={() => {
                setTaxonmy(TaxonomyType.ROOM);
                dispatchTaxonomy();
              }} style={{minWidth: 180}}>Gerenciar salas</Button>
            </fieldset>

            
          </Form>
        )}
      </Formik>

        
          <CustomSidePane open={sidePanelOpenActivities} onClose={dispatchOpenActivities}>{(props) => {
            return <ListAcivities {...props} />;
          }}</CustomSidePane>
        
          <CustomSidePane open={sidePanelTaxonomy} onClose={dispatchTaxonomy}>{(props) => {
              return <ListTaxonomies {...props} />;
            }}</CustomSidePane>
    </Layout>
  );
}
