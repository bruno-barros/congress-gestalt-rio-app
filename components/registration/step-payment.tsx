import useTrans from "../hooks/useTrans";
import {useEffect, useState} from "react";
import {StepProps} from "./registration.d";
import {useRouter} from "next/router";
import {useDispatch, useSelector} from "react-redux";
import {RootReducers} from "../../src/store/store.d";
import {blockUi} from "../../src/store/ui.actions";
import WpUser from "../../src/http/wp-user";
import AuthToken from "../../src/http/auth-token";
import {errorNotification} from "../../src/resources/responses";


export default function StepPayment(props: StepProps) {


  const {step, user, event, edition, onLoading, goPrev, goNext, formInstance} = props
  const disp = useDispatch()
  const t = useTrans()
  const router = useRouter()
  const [response, setResponse] = useState({success: null, msg: ''})
  const cart = useSelector((s: RootReducers) => s.user.cart)

  useEffect(() => {
    formInstance({
      submitForm: () => {
        handleSubmit()
      }
    })
    return () => formInstance(null)
  }, [])


  function handleSubmit() {
    disp(blockUi(true))
    WpUser.saveRemoteSession(user.getId(), AuthToken.getToken())
      .then(resp => {
        if (resp.data.success) {
          window.location.href = event.buildUrlCheckout(cart, AuthToken.getToken())
        } else {
          errorNotification({message: resp.data.data.msg})
          disp(blockUi(false))
        }
      }, err => {
        errorNotification({error: err})
        disp(blockUi(false))
      }).catch(err => {
      errorNotification({error: err})
      disp(blockUi(false))
    })
  }

  function dismissAlert() {
    setTimeout(() => {
      setResponse({success: null, msg: ''})
    }, 5000)
  }

  return (<div className="px-md-5 py-md-3">
    {(!cart || !cart.product) ?
      (<><h3 className="mb-3 pb-2 border-bottom">Ops!</h3>
        <div className="alert alert-warning d-flex align-items-center justify-content-between">
          <div className="text-sm">Algo deu errado. Não registramos o plano que você escolheu.</div>
          <button type="button" className="btn btn-sm btn-warning text-nowrap" onClick={() => goPrev(1)}>Tente
            novamente
          </button>
        </div>
      </>)
      : (<><h3 className="mb-3 pb-2 border-bottom">Estamos quase lá!</h3>
        <p>Você será redirecionado para a página de pagamento. Após o pagamento você será redirecionado para o sistema
          de gestão de trabalhos.</p>
        <p>Se algo der errado você pode reiniciar o processo de inscrição a qualquer momento.</p></>)}


  </div>)

}
