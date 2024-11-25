import ClearLayout from "../components/layout/clear";
import { dump, siteTitle } from '../src/helpers';
import Head from "next/head";
import { useQueryClient } from "react-query";
import { useRouter } from "next/router";
import useCurrentUser from "../components/hooks/useCurrentUser";
import { useRef, useState } from "react";
import Card from "react-bootstrap/cjs/Card";
import useTrans from "../components/hooks/useTrans";
import { Form, Formik, FormikProps } from "formik";
import privateRoute from "../components/hoc/private-route";
import Link from "next/link";
import LoadingButton from "../components/ui/loading-button";
import Loading from "../components/ui/loading";
import useSettings from "../components/hooks/useSettings";
import Attachments from "../components/ui/form/formik/attachments";
import WpSubscription from "../src/http/wp-subscription";
import * as Yup from 'yup';

const Register3 = () => {
  const t = useTrans();
  const queryClient = useQueryClient();
  const router = useRouter();
  const params = router.query;
  const success = params?.success === '1';
  const { authLoading, user } = useCurrentUser();
  const { data: event, currentEdition: edition, isLoading } = useSettings();
  const lang = router.locale;
  const [loading, setLoading] = useState(false);

  const formInstance = useRef<FormikProps<any> | any>(
    null
  );
  const validationSchema = Yup.object({
    attachments: Yup.array().min(1, 'Obrigatório')
  });
  const initValues = {
    attachments: [],
  }

  function doSubmit(){
      formInstance && formInstance.current.submitForm();
  }
  async function handleSubmit(values) {
    console.log(values);
    setLoading(true);
    const axios = await WpSubscription.affirmativeActionRegister({
        userId: user.getId(),
        attachments: values.attachments
    })
    const resp = axios.data;

    queryClient.resetQueries('auth');
    queryClient.resetQueries('user-documents');
    
    setLoading(false);
    router.push(`/register3?success=${resp.success ? '1' : '0'}`);   
  }

  if (isLoading) {
    return (
      <ClearLayout>
        <Loading vspace={80} />
      </ClearLayout>
    );
  }

  return (
    <ClearLayout>
      <Head>
        <title>{siteTitle("Inscrição", queryClient)}</title>
      </Head>
      {/* {dump({
      alllowed: edition.isSubscriptionAllowed(),
      })} */}
      <div className="row">

        {edition.isSubscriptionAllowed() && (
          <div className="col-12 col-lg-8 offset-lg-2">
            <Card>
              <Card.Body>
                <h3>Ações Afirmativas</h3>
                {lang === 'es' 
                  ? <>
                  <p>Es obligatorio enviar documentos y/o autodeclaración que acredite su identidad para completar su registro.</p>
                  <p>Para información detallada sobre los documentos y vacantes, debe acceder al Aviso de Acción Afirmativa: en <a href="https://cbl2025.gestalt.com.br/editalacoesafirmativasport/" target="_blank">portugués</a> o <a href="https://cbl2025.gestalt.com.br/es/edictodeaccionesafirmativas/" target="_blank">español</a>.</p>
                  </> 
                  : <>
                  <p>É obrigatório o envio de documentos e/ou autodeclaração que comprove sua identidade para efetivar a sua inscrição.</p>
                  <p>Para informações detalhadas sobre os documentos e vagas, você deve acessar o <strong>Edital de Ações Afirmativas</strong>: em <a href="https://cbl2025.gestalt.com.br/editalacoesafirmativasport/" target="_blank">português</a> ou <a href="https://cbl2025.gestalt.com.br/es/edictodeaccionesafirmativas/" target="_blank">espanhol</a>.</p>
                  </>}
                
                <hr />

                {success && <div className="alert alert-success">
                  {lang === 'es' 
                    ? <>
                    <strong>Gracias por tu envío</strong>
                    <p>Luego de enviar los documentos, recibirás un correo electrónico confirmando tu registro dentro de los <strong>3 días hábiles</strong>. Si no recibe el correo electrónico dentro del tiempo previsto, puede contactarnos por correo electrónico <a href="mailto:acoesafirmativas@gestalt.com.br" target="_blank">acoesafirmativas@gestalt.com.br</a>.</p>
                    </> 
                    : <>
                    <strong>Obrigado pela sua submissão</strong>
                    <p>Após o envio dos documentos, você receberá um e-mail de confirmação da sua inscrição em <strong>até 03 dias úteis</strong>. Caso não receba o e-mail no tempo previsto, você pode nos contatar através do e-mail <a href="mailto:acoesafirmativas@gestalt.com.br" target="_blank">acoesafirmativas@gestalt.com.br</a>.</p>
                    </>}
                
                </div>}

                {!success && <Formik
                    innerRef={formInstance}
                    initialValues={initValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >{({values, errors, isValid}) => <Form>
                    
                    <h4 style={{fontSize: '.95em'}}>{lang==='es' ? 'Cargar el documento de prueba': 'Faça o upload do documento de comprovação'}</h4>
                    <Attachments name="attachments" label={t('anexos')} maxFiles={2} metas={{
                        context: 'affirmative_action',
                        user_id: user.getId(),
                        }} />
                    {/* {dump({
                        valid: isValid,
                        valid2: formInstance.current?.isValid,
                    })} */}
                </Form>}</Formik>}

                
              </Card.Body>
              <Card.Footer className="p-0 border-0">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="btn-group btn-group-lg start" role="group">
                    
                  </div>
                  {success 
                    ? (<div className="btn-group btn-group-lg end" role="group">
                        <Link href="/dashboard">
                        <a className="btn btn-outline-secondary border-0 px-md-5">{t("continuar")}</a>
                        </Link>
                    </div>) 
                    : <div className="btn-group btn-group-lg end" role="group">
                    <Link href="/dashboard">
                       <a className="btn btn-outline-secondary border-0 px-md-5">{t("cadastro.fazer-depois")}</a>
                    </Link>
                    <LoadingButton
                      onClick={doSubmit}
                      type="button"
                      variant="primary"
                      loading={loading}
                      className=" px-md-5  d-flex align-items-center"
                    >
                      {t("salvar")}
                    </LoadingButton>
                  </div>}
                  
                </div>
              </Card.Footer>
            </Card>
          </div>
        )}
      </div>
    </ClearLayout>
  );
};

export default privateRoute(Register3);
