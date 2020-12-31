import MainLayout from "../components/layout";
import {useRouter} from "next/router";
import useCurrentUser from "../components/hooks/useCurrentUser";
import {useEffect, useState} from "react";
import Link from "next/link";
import ProfileForm from "../components/user/profile-form";
import PasswordUpdateForm from "../components/user/password-update-form";


const Profile = () => {

  const router = useRouter()
  const {authLoading, user} = useCurrentUser()
  const [tab, setTab] = useState<string>('personal')

  useEffect(() => {
    setTab(String(router.query?.tab) || 'personal')
  }, [router])

  return (<MainLayout pageHeader={{title: 'Meu cadastro'}}>
    <div className="row">
      <div className="col-12 col-md-3 border-right py-3">
        <ul className="nav  nav-pills flex-column">
          <li className="nav-item">
            <Link href={`/profile?tab=personal`} passHref>
              <a className={`nav-link ${tab === 'personal' && 'active'}`}>Dados pessoais</a>
            </Link>
          </li>
          <li className="nav-item">
            <Link href={`/profile?tab=documentos`} passHref>
              <a className={`nav-link ${tab === 'documentos' && 'active'}`}>Meus documentos</a>
            </Link>
          </li>
          <li className="nav-item">
            <Link href={`/profile?tab=password`} passHref>
              <a className={`nav-link ${tab === 'password' && 'active'}`}>Mudar senha</a>
            </Link>
          </li>
        </ul>
      </div>
      <div className="col-12 col-md-9 py-3 px-md-5">
        {tab === 'personal' && <ProfileForm user={user}/>}
        {tab === 'password' && <PasswordUpdateForm user={user}/>}
      </div>
    </div>
  </MainLayout>)
}

export default Profile
