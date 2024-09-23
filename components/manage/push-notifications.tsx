import Card from "react-bootstrap/cjs/Card";
import useEvent from "../hooks/useEvent";
import {useQuery} from "react-query";
import WpConfig from "../../src/http/wp-config";
import {errorNotification} from "../../src/resources/responses";
import {Form, Formik} from "formik";
import {useRouter} from "next/router";
import Text from "../ui/form/formik/text";
import Textarea from "../ui/form/formik/textarea";
import {useState} from "react";
import * as Yup from 'yup'
import ToolTip from "../ui/tooltip";
import Sweet from "../ui/sweet-alert";
import Select from "../ui/form/formik/select";
import LoadingButton from "../ui/loading-button";
import Icon from "../ui/ionicon";

export default function PushNotifications() {

  const router = useRouter()
  const {data: event} = useEvent()
  const edition = event.currentEdition()
  const langs = router.locales
  const [loading, setLoading] = useState(false)
  const {data: app, isLoading} = useQuery<{
    app_id: string; last_messages: any[]; messageable_players: number; name: string;
    players: number; rate_limit: string
  }>(['push-notification', 'app'], queryPush)

  function queryPush(): Promise<any> {
    return new Promise((resolve) => {
      WpConfig.pushNotificationApp()
        .then(resp => {
          if (resp.data?.data?.evPushNotification) {
            resolve(resp.data.data.evPushNotification)
          } else resolve(null)
        }, err => {
          errorNotification({error: err})
        })
    })

  }

  function handleSubmit(values) {
    setLoading(true)

    WpConfig.pushNotificationSend(values)
      .then(resp => {
        if(resp.data.success){
          Sweet.fire({
            icon: 'success',
            title: 'Mensagem enviada',
            text: 'A notificação será entregue nos próximos minutos.'
          })
        } else {
          errorNotification({message: resp.data.data.msg})
        }
      }, err => {
        errorNotification({error: err})
      }).finally(()=>{
        setLoading(false)
    })

  }

  const FormSchema = Yup.object().shape({
    title: Yup.object().shape({
      pt: Yup.string().required('Obrigatório')
    }),
    message: Yup.object().shape({
      pt: Yup.string().required('Obrigatório')
    })
  })

  return (<div className="">
    <p>Enviar notificações direto pelo navegador.</p>
    {app &&
    <Card className="mb-4">
      <Card.Body>
        <h5>{app.name}</h5>
        <div className="d-flex align-items-center">
          <div className="mr-4">Limite: <span className="badge badge-light">{app.rate_limit}</span></div>
          <div className="mr-4">Usuários ativos: <span className="badge badge-success">{app.messageable_players}</span>
          </div>
          <ToolTip text="Para um maior controle sobre as opções de envio use o painel OneSignal">
            <a href={`https://app.onesignal.com/apps/${app.app_id}`} target="_blank">Dashboard <Icon
              name={`open-outline`} style={{verticalAlign: 'middle'}}/></a>
          </ToolTip>
        </div>
      </Card.Body>
    </Card>}

    <Card bg="light">
      <Card.Body>
        <Formik
          initialValues={{
            title: {pt: ''},
            message: {pt: ''},
            tags: 'Active Users'
          }}
          onSubmit={handleSubmit}
          validationSchema={FormSchema}
        >{({values}) => (<Form>

          {langs.map((lang, i) => (<Text key={i} name={`title.${lang}`} label={`Título (${lang})`}/>))}

          {langs.map((lang, i) => (<Textarea key={i} name={`message.${lang}`} label={`Mensagem (${lang})`}/>))}

          <Select name="tags" label="Segmentação">
            <option value="Active Users">Usuários ativos</option>
            <option value="participant">Participantes</option>
            <option value="evaluator">Avaliadores</option>
          </Select>

          <LoadingButton loading={loading}>Enviar</LoadingButton>

        </Form>)}</Formik>
      </Card.Body>
    </Card>


  </div>)

}
