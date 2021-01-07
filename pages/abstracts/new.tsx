import MainLayout from "../../components/layout";
import useTrans from "../../components/hooks/useTrans";
import useEvent from "../../components/hooks/useEvent";
import {Edition} from "../../src/resources/event";
import EditionSidebar from "../../components/event/edition-sidebar";
import AbstractForm from "../../components/abstract/abstract-form";
import AbstractsRules from "../../components/abstract/abstracts-rules";


interface NewAbstractProps {

}

const NewAbstract = (props: NewAbstractProps) => {

  const t = useTrans()
  const {data: event, isLoading} = useEvent()
  const edition: Edition = event?.currentEdition()

  if (isLoading) {
    return null;
  }

  return (<MainLayout sidebar={{title: edition.name, component: <EditionSidebar edition={edition}/>}}>
    <div className="row py-4">
      <div className="col-12 col-md-8 pl-lg-4 pl-xl-5">
        <h1 className="page-title mt-3">{t('trabalho.novo')}</h1>
        <AbstractForm edition={edition} abstract={null}/>

      </div>
      <div className="col-12 col-md-4">

        <div className="border-info pl-4 my-5" style={{borderLeft: 'solid 3px'}}>
          Confira as <a href="#" target="_blank">regras de submissão de trabalhos</a>.
        </div>
        <AbstractsRules/>


      </div>
    </div>

    {/*<pre>{JSON.stringify(edition, null, 2)}</pre>*/}
  </MainLayout>)
}

export default NewAbstract
