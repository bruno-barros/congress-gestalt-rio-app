import MainLayout from "../../components/layout";
import useTrans from "../../components/hooks/useTrans";
import useEvent from "../../components/hooks/useEvent";
import {useRouter} from "next/router";
import {Loading} from "@brunobarros/react-components";
import useCurrentUser from "../../components/hooks/useCurrentUser";
import {useQuery} from "react-query";
import WpUser from "../../src/http/wp-user";
import {errorNotification} from "../../src/resources/responses";
import ProfileForm from "../../components/user/profile-form";
import {User} from "../../src/resources/user";
import UsersListSidebar from "../../components/user/users-list-sidebar";


const UserEditing = () => {

  const {user: auth} = useCurrentUser()
  const router = useRouter()
  const t = useTrans()
  const {data: event, isLoading} = useEvent()
  const {data: user, error, isLoading: loadingUser} = useQuery(['user', router.query.id], queryUser, {
    enabled: true
  })
  let editingMode: 'user'|'admin' = auth.canManageAbstracts() ? 'admin' : 'user'

  function queryUser(): Promise<any>{
    return new Promise((resolve, reject)=>{
      WpUser.fetchUser(Number(router.query.id))
        .then(resp => {
          if(resp.data?.data?.user) resolve(User.make(resp.data.data.user))
          else reject(null)
        }, err => {
          errorNotification({error: err})
        })
    })
  }


  if (isLoading || loadingUser) {
    return <MainLayout><Loading vspace={80}/></MainLayout>;
  }


  if (user.databaseId !== auth.getId() && !auth.canManageAbstracts()) {
    return <MainLayout>
      <div className="container">
        <div className="row">
          <div className="col-12 col-md-6 offset-md-3">
            <div className="alert alert-danger mt-5">
              {t('sem-permissao')}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>;
  }

  function Sidebar(){
    // return null

    return {title: 'Usuários', component: <UsersListSidebar/>}
  }

  return (<MainLayout sidebar={Sidebar()}>
    <div className="row my-5">
      <div className="col-12 col-md-8 pl-lg-4 pl-xl-5">
        <ProfileForm editingMode={editingMode} user={user}/>
      </div>
      <div className="col-12 col-md-4">
        <p><strong>Histórico de inscrições</strong></p>
      </div>
    </div>
  </MainLayout>)
}


export default UserEditing
