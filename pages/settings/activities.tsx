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

export default function Context() {
  return (
    <SettingsContextProvider>
      <ActivitiesPage />
    </SettingsContextProvider>
  );
}

function ActivitiesPage() {
  const { lang, setLang, currentEdition } = useSettingsContext();
  const { data: evt, isLoading, isFetching } = useSettings(currentEdition);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const [sidePanelOpen, dispatchOpen] = useReducer((p) => !p, false);

  //region Initial Values
  const initialValues = {
    activities_allowed: evt?.activity?.activities_allowed === "1",
    test_mode: evt?.activity?.test_mode === "1",
    start_at: evt?.activity?.start_at,
    end_at: evt?.activity?.end_at,
    limit_per_participant: evt?.activity?.limit_per_participant,
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
        Atividades
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

            <Field infos="Número máximo de atividades que um participante pode se inscrever.">
                <Text
                    name="limit_per_participant"
                    label="Limite de atividades por participante"
                    placeholder="deixe vazio para ilimitado"
                />
            </Field>

            <hr />
            <fieldset>
                <legend>Grupos de atividades</legend>
                <p className="text-sm text-muted">Permite agrupar atividades sob um mesmo nome.</p>
            </fieldset>

            <hr />
            <fieldset>
                <legend>Local da atividade</legend>
                <p className="text-sm text-muted">Endereço físico da atividade.</p>
            </fieldset>

            <hr />
            <fieldset>
                <legend>Sala da atividade</legend>
                <p className="text-sm text-muted">Espaço físico (sala) da atividade.</p>
            </fieldset>

            <hr />
            <fieldset>
                <legend>Palestrantes</legend>
                <p className="text-sm text-muted">Pessoas responsáveis por cada atividade.</p>
            </fieldset>

            <hr />
            <fieldset>
                <legend>Atividades</legend>
                <p className="text-sm text-muted">Cada atividade que permite inscrição pelos usuários.</p>
                <Button type="button" onClick={dispatchOpen}>Gerenciar atividades</Button>
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

        <ActivityContextProvider>
          <CustomSidePane open={sidePanelOpen} onClose={dispatchOpen}>{(props) => {
            return <ListAcivities {...props} />;
          }}</CustomSidePane>
        </ActivityContextProvider>
    </Layout>
  );
}
