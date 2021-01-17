import MainLayout from "../../components/layout";
import {useRouter} from "next/router";
import useCurrentUser from "../../components/hooks/useCurrentUser";
import {useEffect, useState} from "react";
import Link from "next/link";
import ProfileForm from "../../components/user/profile-form";
import PasswordUpdateForm from "../../components/user/password-update-form";
import MySubscriptions from "../../components/user/my-subscriptions";
import useTrans from "../../components/hooks/useTrans";
import Anais from "../../components/manage/anais";


const Manage = () => {

  const t = useTrans()
  const router = useRouter()
  const {authLoading, user} = useCurrentUser()
  const [tab, setTab] = useState<string>('anais')

  useEffect(() => {
    setTab(String(router.query?.tab) || 'anais')
  }, [router])

  return (<MainLayout pageHeader={{title: 'Gestão do evento'}}>
    <div className="row no-gutters">
      <div className="col-12 col-md-3 border-right py-3 px-md-3">
        <ul className="nav  nav-pills flex-column">
          <li className="nav-item">
            <Link href={`/adm/manage?tab=anais`} passHref>
              <a className={`nav-link ${tab === 'anais' && 'active'}`}>Anais</a>
            </Link>
          </li>
        </ul>
      </div>
      <div className="col-12 col-md-9">
        {tab === 'anais' &&
        <div className="py-3 px-3 px-md-5"><Anais/></div>}
      </div>
    </div>
  </MainLayout>)
}

export default Manage
