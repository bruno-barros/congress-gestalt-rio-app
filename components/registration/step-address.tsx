import useTrans from "../hooks/useTrans";
import {useState} from "react";
import {StepProps} from "./registration.d";


export default function StepAddress(props: StepProps) {

  const {user, event, edition, onLoading, goNext, goPrev} = props
  const t = useTrans()
  const [response, setResponse] = useState({success: null, msg: ''})

  function dismissAlert() {
    setTimeout(() => {
      setResponse({success: null, msg: ''})
    }, 5000)
  }


  return(<div className="">
    <h2>Endereço</h2>

    <button onClick={goPrev}>voltar</button>
    <button onClick={goNext}>avançar</button>
  </div>)

}
