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
import Sweet from "../../components/ui/sweet-alert";
import {useEffect} from "react";
import NextStepTip from "../../components/abstract/next-step-tip";


const AbstractEditing = () => {

  const {user} = useCurrentUser()
  const router = useRouter()
  const t = useTrans()
  const {data: event, isLoading} = useEvent()
  const edition: Edition = event?.currentEdition()
  const {data: abstract, error, isLoading: loadingAbstract} = useAbstract(Number(router.query?.id))

  useEffect(()=>{
    if(router.query?.created) NextStepPopup()
  }, [router.query])
  function NextStepPopup(){
    Sweet.fire({
      html: `<div class="text-left"><p>Caro, autor. <br/>
        O próximo passo é enviar seu trabalho para revisão.</p>
        <p>Quando estiver pronto use o botão "<b>${t('trabalho.atualizar-e-submeter')}</b>".</p></div>`
    })
  }

  if (isLoading || loadingAbstract) {
    return <MainLayout><Loading vspace={80}/></MainLayout>;
  }


  if (abstract.getResponsible().databaseId !== user.getId() && !user.canManageAbstracts()) {
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


  return (<MainLayout sidebar={{title: edition.name, component: <EditionSidebar edition={edition}/>}}>
     <div className="row my-5">
      <div className="col-12 col-md-8 pl-lg-4 pl-xl-5">
        <AbstractForm edition={edition} abstract={abstract}/>
      </div>
      <div className="col-12 col-md-4">
        <AbstractStatusBar editable={user.canManageAbstracts()} edition={edition} currentStatus={abstract?.status}
                           className="my-4"/>
        <NextStepTip status={abstract?.status}/>
        <p><strong>Comentários</strong></p>
      </div>
    </div>
  </MainLayout>)
}


export default AbstractEditing
