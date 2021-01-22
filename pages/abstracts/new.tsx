import MainLayout from "../../components/layout";
import useTrans from "../../components/hooks/useTrans";
import useEvent from "../../components/hooks/useEvent";
import {Edition} from "../../src/resources/event";
import EditionSidebar from "../../components/event/edition-sidebar";
import AbstractForm from "../../components/abstract/abstract-form";
import AbstractsRules from "../../components/abstract/abstracts-rules";
import privateRoute from "../../components/hoc/private-route";
import {useRouter} from "next/router";
import {Trans} from "react-i18next";


interface NewAbstractProps {

}

const NewAbstract = (props: NewAbstractProps) => {

  const router = useRouter()
  const t = useTrans()
  const {data: event, isLoading} = useEvent()
  const edition: Edition = event?.currentEdition()
  const lang = router.locale

  if (isLoading) {
    return null;
  }

  return (<MainLayout sidebar={{title: edition.name, component: <EditionSidebar edition={edition}/>}}>
    <div className="row py-4">
      <div className="col-12 col-md-8 pl-lg-4 pl-xl-5">
        <h1 className="page-title mt-3">{t('trabalho.novo-trabalho')}</h1>
        <AbstractForm edition={edition} abstract={null}/>

      </div>
      <div className="col-12 col-md-4">

        <div className="border-info pl-4 my-5" style={{borderLeft: 'solid 3px'}}>
          <Trans as="div"
                 i18nKey="trabalho.confira-as-regras"
                 defaults={`Confira as <1>regras de submissão de trabalhos</1>.`}
                 components={['Confira as ',
                   <a href={edition.abstract.rules[lang]} target="_blank">regras de submissão de trabalhos</a>,
                   '.']}
          />
        </div>
        {/*<AbstractsRules/>*/}


      </div>
    </div>

    {/*<pre>{JSON.stringify(edition, null, 2)}</pre>*/}
  </MainLayout>)
}

export default privateRoute(NewAbstract)
