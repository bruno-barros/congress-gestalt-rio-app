import MainLayout from "../../components/layout";
import useTrans from "../../components/hooks/useTrans";
import useEvent from "../../components/hooks/useEvent";
import {useRouter} from "next/router";
import useCurrentUser from "../../components/hooks/useCurrentUser";
import {useQuery} from "react-query";
import WpUser from "../../src/http/wp-user";
import {errorNotification} from "../../src/resources/responses";
import ProfileForm from "../../components/user/profile-form";
import {User} from "../../src/resources/user";
import UsersListSidebar from "../../components/user/users-list-sidebar";
import privateRoute from "../../components/hoc/private-route";
import Loading from "../../components/ui/loading";
import useUserDocuments from "../../components/hooks/useUserDocuments";
import { DocumentContexts } from "../../src/resources/document";


const UserEditing = () => {

  const {user: auth} = useCurrentUser()
  const router = useRouter()
  const t = useTrans()
  const {data: event, isLoading} = useEvent()
  const {data: user, error, isLoading: loadingUser} = useQuery(['user', router.query.id], queryUser, {
    enabled: true
  })
  const {data: documents, isLoading: docLoading} = useUserDocuments(Number(router.query.id))
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
        <p><strong>Documentos</strong></p>
        {docLoading && <Loading />}
        {(!docLoading && documents.length === 0) && <div className="alert alert-light border">Nenhum documento enviado.</div>}
        {(documents && documents.length > 0) && <ul className="list-group">{documents.map(doc => {
          return <li key={doc.id} className="list-group-item text-sm">
            <a href={doc.url} target="_blank" className="d-block">{doc.name}</a>
            <span className="badge badge-primary badge-pill">{DocumentContexts(doc.context)?.[0]?.name}</span>
          </li>
        })}</ul>}
      </div>
    </div>
  </MainLayout>)
}


export default privateRoute(UserEditing)
