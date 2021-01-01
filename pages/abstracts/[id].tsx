import MainLayout from "../../components/layout";
import useTrans from "../../components/hooks/useTrans";
import useEvent from "../../components/hooks/useEvent";
import {Edition} from "../../src/resources/event";
import {useRouter} from "next/router";
import EditionSidebar from "../../components/event/edition-sidebar";
import AbstractForm from "../../components/abstract/abstract-form";
import AbstractStatusBar from "../../components/abstract/abstract-status-bar";
import useAbstract from "../../components/hooks/useAbstract";
import {Loading} from "@brunobarros/react-components";
import useCurrentUser from "../../components/hooks/useCurrentUser";


const AbstractEditing = ()=> {

  const {user} = useCurrentUser()
  const router = useRouter()
  const t = useTrans()
  const {data: event, isLoading} = useEvent()
  const edition: Edition = event?.currentEdition()
  const {data: abstract, error, isLoading: loadingAbstract} = useAbstract(Number(router.query?.id))


  if(isLoading || loadingAbstract) {
    return <MainLayout><Loading vspace={80}/></MainLayout>;
  }

  return (<MainLayout sidebar={{title: edition.name, component: <EditionSidebar edition={edition}/>}}>
    <div className="row my-5">
      <div className="col-12 col-md-8 pl-lg-4 pl-xl-5">
        <AbstractForm edition={edition} abstract={abstract}/>
      </div>
      <div className="col-12 col-md-4">
        <AbstractStatusBar editable={user.canManageAbstracts()} edition={edition} currentStatus={abstract?.status} className="my-4"/>
        <p><strong>Comentários</strong></p>
      </div>
    </div>
  </MainLayout>)
}


export default AbstractEditing
