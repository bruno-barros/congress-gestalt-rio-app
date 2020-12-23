import {useRouter} from "next/router";
import useCurrentUser from "../components/hooks/useCurrentUser";
import MainLayout from "../components/layout";
import Head from "next/head";
import {siteTitle} from "../src/helpers";


const Register1 = () => {

  const router = useRouter()
  const {authLoading, user} = useCurrentUser()

  return (<MainLayout>
    <Head>
      <title>{siteTitle('Cadastro')}</title>
    </Head>
    <div className="">
      <h1>Cadastro fase 1</h1>
    </div>
  </MainLayout>)
}

export default Register1
