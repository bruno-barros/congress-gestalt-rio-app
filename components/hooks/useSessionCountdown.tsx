import useCurrentUser from "./useCurrentUser";
import {useDispatch} from "react-redux";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import AuthToken from "../../src/http/auth-token";
import {toast} from "react-toastify";
import {renewAuthToken} from "../../src/store/user.actions";

export default function useSessionCountdown(props?: {ignore?: boolean}) {
  const {user} = useCurrentUser()
  const disp = useDispatch()
  const router = useRouter()

  let timeout, countdown = 60, redirectTo = '/login', fastPace = 1000, slowPace = 10000;
  const [milliseconds, setMilliseconds] = useState(fastPace)



  function Msg({countdown}){
    return (<><div className="text-sm">Sua sessão irá expirar em {countdown} segundos.</div><div className="text-sm"> Clique para permanecer logado.</div></>)
  }

  useEffect(() => {
    if(props?.ignore) return;
    if (!user.getId()) return;
    timeout = setInterval(() => {
      const expireIn = AuthToken.factory().minutesToExpire();
      console.log('useSessionCountdown::expireIn', expireIn);
      if (expireIn < 0) {
        clearInterval(timeout)
        toast.dismiss('expires-in');
        router.push(redirectTo)
      } else if (expireIn === 0) {
        if(process.env.NODE_ENV === 'development'){
          console.info('AUTO REFRESH SESSION');
          toast.dismiss('expires-in');
          disp(renewAuthToken())
          setMilliseconds(slowPace);
        } else {
          setMilliseconds(fastPace);
        }
        countdown--;
        if (toast.isActive('expires-in')) {
          toast.update('expires-in', {
            render: <Msg countdown={countdown}/>
          });
        } else {
          toast(<Msg countdown={countdown}/>, {
            toastId: 'expires-in',
            autoClose: false,
            onClick: () => {
              clearInterval(timeout)
              toast.dismiss('expires-in');
              disp(renewAuthToken())
            }
          })
        }
      } else {
        toast.dismiss('expires-in');
        setMilliseconds(slowPace);
      }
    }, milliseconds)
    return () => clearInterval(timeout)
  }, [user, milliseconds])
}
