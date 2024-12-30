import MainLayout from "../components/layout";
import {useRouter} from "next/router";
import useCurrentUser from "../components/hooks/useCurrentUser";
import {useEffect, useState} from "react";
import Link from "next/link";
import ProfileForm from "../components/user/profile-form";
import PasswordUpdateForm from "../components/user/password-update-form";
import MySubscriptions from "../components/user/my-subscriptions";
import useTrans from "../components/hooks/useTrans";
import privateRoute from "../components/hoc/private-route";
import DebugPanel from "../components/user/debug";
import {siteTitle} from "../src/helpers";
import Head from "next/head";
import {useQueryClient} from "react-query";
import UserDocuments from "../components/user/user-documents";


const Profile = () => {

  const queryClient = useQueryClient()
  const t = useTrans()
  const router = useRouter()
  const {authLoading, user} = useCurrentUser()
  const [tab, setTab] = useState<string>('personal')

  useEffect(() => {
    setTab(router.query?.tab ? String(router.query?.tab) : 'personal')
  }, [router])

  return (<MainLayout pageHeader={{title: t('cadastro.meu-cadastro')}}>
    <Head>
      <title>{siteTitle(`Perfil - ${tab}`, queryClient)}</title>
    </Head>
    <div className="row">
      <div className="col-12 col-md-3 border-right py-3 px-md-3">
        <ul className="nav  nav-pills flex-column">
          <li className="nav-item">
            <Link href={`/profile?tab=personal`} passHref>
              <a className={`nav-link ${tab === 'personal' && 'active'}`}>{t('dados-pessoais')}</a>
            </Link>
          </li>
          <li className="nav-item">
            <Link href={`/profile?tab=subscriptions`} passHref>
              <a className={`nav-link ${tab === 'subscriptions' && 'active'}`}>{t('inscricoes')}</a>
            </Link>
          </li>
          <li className="nav-item">
            <Link href={`/profile?tab=documents`} passHref>
              <a className={`nav-link ${tab === 'documents' && 'active'}`}>{t('documentos')}</a>
            </Link>
          </li>
          <li className="nav-item">
            <Link href={`/profile?tab=password`} passHref>
              <a className={`nav-link ${tab === 'password' && 'active'}`}>{t('mudar-senha')}</a>
            </Link>
          </li>
        </ul>
      </div>
      <div className="col-12 col-md-9">
        {tab === 'personal' &&
        <div className=" py-3 px-md-3"><ProfileForm user={user} editingMode={user.isSuperAdmin()?'admin':'user'}/></div>}
        {tab === 'subscriptions' && <MySubscriptions user={user}/>}
        {tab === 'documents' && <UserDocuments user={user}/>}
        {tab === 'password' && <div className=" py-3 px-md-3"><PasswordUpdateForm user={user}/></div>}
        {tab === 'debug' && <div className=" py-3 px-md-3"><DebugPanel/></div>}
      </div>
    </div>
  </MainLayout>)
}

export default privateRoute(Profile)
