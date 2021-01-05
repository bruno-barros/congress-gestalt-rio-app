import useTrans from "../hooks/useTrans";
import {useState} from "react";
import {StepProps} from "./registration.d";


export default function StepPayment(props: StepProps) {


  const {user, event, edition, onLoading, goPrev, goNext} = props
  const t = useTrans()
  const [response, setResponse] = useState({success: null, msg: ''})

  function dismissAlert() {
    setTimeout(() => {
      setResponse({success: null, msg: ''})
    }, 5000)
  }

  return(<div className="">
    <h2>Pagamento</h2>
    <button onClick={goPrev}>voltar</button>
    <button onClick={goNext}>avançar</button>
  </div>)

}
