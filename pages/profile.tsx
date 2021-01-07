import MainLayout from "../components/layout";
import {useRouter} from "next/router";
import useCurrentUser from "../components/hooks/useCurrentUser";
import {useEffect, useState} from "react";
import Link from "next/link";
import ProfileForm from "../components/user/profile-form";
import PasswordUpdateForm from "../components/user/password-update-form";
import MySubscriptions from "../components/user/my-subscriptions";


const Profile = () => {

  const router = useRouter()
  const {authLoading, user} = useCurrentUser()
  const [tab, setTab] = useState<string>('personal')

  useEffect(() => {
    setTab(String(router.query?.tab) || 'personal')
  }, [router])

  return (<MainLayout pageHeader={{title: 'Meu cadastro'}}>
    <div className="row no-gutters">
      <div className="col-12 col-md-3 border-right py-3 pr-md-3">
        <ul className="nav  nav-pills flex-column">
          <li className="nav-item">
            <Link href={`/profile?tab=personal`} passHref>
              <a className={`nav-link ${tab === 'personal' && 'active'}`}>Dados pessoais</a>
            </Link>
          </li>
          <li className="nav-item">
            <Link href={`/profile?tab=subscriptions`} passHref>
              <a className={`nav-link ${tab === 'subscriptions' && 'active'}`}>Inscrições</a>
            </Link>
          </li>
          <li className="nav-item">
            <Link href={`/profile?tab=password`} passHref>
              <a className={`nav-link ${tab === 'password' && 'active'}`}>Mudar senha</a>
            </Link>
          </li>
        </ul>
      </div>
      <div className="col-12 col-md-9">
        {tab === 'personal' && <div className=" py-3 px-md-5"><ProfileForm user={user}/></div>}
        {tab === 'subscriptions' && <MySubscriptions user={user}/>}
        {tab === 'password' && <div className=" py-3 px-md-5"><PasswordUpdateForm user={user}/></div>}
      </div>
    </div>
  </MainLayout>)
}

export default Profile
