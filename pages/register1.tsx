import {useRouter} from "next/router";
import useCurrentUser from "../components/hooks/useCurrentUser";


const Register1 = () => {

  const router = useRouter()
  const {authLoading, user} = useCurrentUser()

  return (<div className="">
    <h1>Cadastro fase 1</h1>
  </div>)
}

export default Register1
