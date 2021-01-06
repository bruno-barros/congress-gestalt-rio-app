import useTrans from "../hooks/useTrans";
import {useState} from "react";
import {StepProps} from "./registration.d";
import {useRouter} from "next/router";


export default function StepPayment(props: StepProps) {


  const { step, user, event, edition, onLoading, goPrev, goNext, formInstance} = props
  const t = useTrans()
  const router = useRouter()
  const [response, setResponse] = useState({success: null, msg: ''})

  function dismissAlert() {
    setTimeout(() => {
      setResponse({success: null, msg: ''})
    }, 5000)
  }

  return(<div className="px-md-5 py-md-3">
    <h3 className="mb-3 pb-2 border-bottom">Estamos quase lá!</h3>
    {/*<button onClick={goPrev}>voltar</button>*/}
    {/*<button onClick={goNext}>avançar</button>*/}
    <p>Você será redirecionado para a página de pagamento. Após o pagamento você será redirecionado para o sistema de gestão de trabalhos.</p>
    <p>Se algo der errado você pode reiniciar o processo de inscrição a qualquer momento.</p>
  </div>)

}
