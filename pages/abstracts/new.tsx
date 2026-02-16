import MainLayout from "../../components/layout";
import useTrans from "../../components/hooks/useTrans";
import EditionSidebar from "../../components/event/edition-sidebar";
import AbstractForm from "../../components/abstract/abstract-form";
import privateRoute from "../../components/hoc/private-route";
import {useRouter} from "next/router";
import {Trans} from "react-i18next";
import {useQueryClient} from "react-query";
import {siteTitle} from "../../src/helpers";
import Head from "next/head";
import useSettings from "../../components/hooks/useSettings";
import ProgressBar from "../../components/ui/progressbar";


interface NewAbstractProps {

}

const NewAbstract = (props: NewAbstractProps) => {

  const queryClient = useQueryClient()
  const router = useRouter()
  const t = useTrans()
  const { data: event, currentEdition: edition, isLoading} = useSettings()  
  const lang = router.locale
  const url = edition.Abstract().getRulesUrl(lang)


  if (isLoading) {
    return <ProgressBar/>;
  }

  return (<MainLayout sidebar={{title: edition.name, component: <EditionSidebar edition={edition}/>}}>
    <Head>
      <title>{siteTitle('Nova sinopse', queryClient)}</title>
    </Head>
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
                 components={(['Confira as ',
                   <a href={url} target="_blank">regras de submissão de trabalhos</a>,
                   '.']) as any}
          />
        </div>
        {/*<AbstractsRules/>*/}


      </div>
    </div>

    {/*<pre>{JSON.stringify(edition, null, 2)}</pre>*/}
  </MainLayout>)
}

export default privateRoute(NewAbstract)
