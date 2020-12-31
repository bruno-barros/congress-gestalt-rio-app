import MainLayout from "../../components/layout";
import useTrans from "../../components/hooks/useTrans";
import useEvent from "../../components/hooks/useEvent";
import {Edition} from "../../src/resources/event";
import {useRouter} from "next/router";
import EditionSidebar from "../../components/event/edition-sidebar";
import AbstractForm from "../../components/abstract/abstract-form";
import AbstractStatusBar from "../../components/abstract/abstract-status-bar";


const AbstractEditing = ()=> {

  const router = useRouter()
  const t = useTrans()
  const {data: event, isLoading} = useEvent()
  const edition: Edition = event?.currentEdition()

  if(isLoading) {
    return null;
  }

  return (<MainLayout sidebar={{title: edition.name, component: <EditionSidebar edition={edition}/>}}>
    <div className="row my-5">
      <div className="col-12 col-md-8 pl-lg-4 pl-xl-5">
        <AbstractForm edition={edition} abstract={null}/>
      </div>
      <div className="col-12 col-md-4">
        <AbstractStatusBar editable={true} edition={edition} currentStatus={`pre_approved`} className="my-4"/>
        <p><strong>Comentários</strong></p>
      </div>
    </div>
  </MainLayout>)
}


export default AbstractEditing
