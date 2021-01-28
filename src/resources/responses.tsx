import Error from "./error";
import {toast} from "react-toastify";
import {blockUi} from "../store/ui.actions";
import Sweet from "../../components/ui/sweet-alert";

export function exceptionNotification(exceptionError: any, dispatcher?: any) {
  const error = Error.make(exceptionError)
  toast.error(error.message)
  dispatcher && dispatcher(blockUi(false))
}

export function successNotification(input: { message?: string, heroTitle?: string }) {
  if (input?.heroTitle) {
    Sweet.fire({
      icon: 'success',
      title: input?.heroTitle,
      text: input?.message,
      showCloseButton: true,
      timer: 5000,
      timerProgressBar: true,
    })
  } else {
    toast.success(input?.message)
  }
}

export function errorNotification(input: { message?: string, heroTitle?: string, error?: any }) {
  if (input?.heroTitle) {
    Sweet.fire({
      icon: 'error',
      title: input?.heroTitle,
      text: input?.message,
      showCloseButton: true,
      timer: 5000,
      timerProgressBar: true,
    })
  } else {
    if(input?.error){
      const error = Error.make(input.error)
      input.message = error.message
    }
    toast.error(input?.message, {toastId: 'error-notification'})
  }
}
