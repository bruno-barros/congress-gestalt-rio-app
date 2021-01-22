import MainLayout from "../../components/layout";
import Card from "react-bootstrap/cjs/Card";
import useEvent from "../../components/hooks/useEvent";
import EditionSidebar from "../../components/event/edition-sidebar";
import {Loading} from "@brunobarros/react-components";
import AbstractCard from "../../components/abstract/abstract-card";
import Link from "next/link";
import {useQuery} from "react-query";
import useCurrentUser from "../../components/hooks/useCurrentUser";
import {WpAbstract} from "../../src/http/wp-abstract";
import {errorNotification} from "../../src/resources/responses";
import useTrans from "../../components/hooks/useTrans";
import {useRouter} from "next/router";
import {AbstractCollection, StatusesPhaseAbstract, StatusesPhaseSynopsis} from "../../components/abstract/abstract.d";
import {Trans} from "react-i18next";
import privateRoute from "../../components/hoc/private-route";


const Abstracts = () => {

  const t = useTrans()
  const router = useRouter()
  const {user} = useCurrentUser()
  const {data: event} = useEvent()
  const currentEdition = event && event.currentEdition()
  const edition = router.query?.edition && event?.getEdition(String(router.query.edition)) || currentEdition
  const phase = router.query?.status || 'synopsis'
  const isCurrent = currentEdition?.id === edition?.id
  const {data: abstracts, error, isLoading} = useQuery<AbstractCollection, any>(['abstracts', user.getId(), edition?.id, phase], queryAbstracts, {
    enabled: !!edition?.id && user.getId() > 0
  })
  const lang = router.locale || 'pt'

  function queryAbstracts(): Promise<AbstractCollection> {
    return new Promise((resolve, reject) => {
      WpAbstract.collection({
        edition: edition.id,
        authorId: user.getId(),
        statuses: phase === 'abstract' ? StatusesPhaseAbstract() : StatusesPhaseSynopsis()
      }).then(resp => {
        if (resp.data.data?.abstractFilters?.nodes) {
          resolve(AbstractCollection.make(resp.data.data.abstractFilters.nodes))
        } else {
          resolve(AbstractCollection.make([]))
          errorNotification({error: resp.data.errors})
        }
      }, err => {
        resolve(AbstractCollection.make([]))
        errorNotification({error: err})
      })
    })
  }

  if (!event || isLoading) {
    return (<MainLayout>
      <Loading vspace={80}/>
    </MainLayout>)
  }

  function SynopsisIntro(){
    return (<>
      {(abstracts?.count() === 0) && isCurrent
      && <Card style={{maxWidth: 600}}>
        <Card.Body className="p-5">
          <Trans as="div"
                 i18nKey="trabalho.boas-vindas"
                 values={{limit: edition.abstract.limit_per_user}}
                 defaults={`<0>Olá, congressista.</0>
              Antes de submeter seu trabalho confira as
                <1>regras de submissão de trabalhos</1>.`}
                 components={[<p>Olá, congressista.</p>,
                   <a href={edition.abstract.rules[lang]} target="_blank">regras de submissão de trabalhos</a>]}
          />
          <div className="my-3 d-flex align-items-center">
            <Link href={`/abstracts/new`} passHref><a
              className="btn btn-primary">{t('trabalho.novo-trabalho')}</a>
            </Link>

            <div className="ml-3">
              <Trans i18nKey="trabalho.voce-pode-enviar-ate"
                     values={{limit: edition.abstract.limit_per_user}}
                     defaults={`Você pode enviar até {{limit}} trabalhos.`}
              />
            </div>

          </div>
        </Card.Body>
      </Card>}



      {(edition.abstract.limit_per_user > 0 && edition.abstract.limit_per_user <= abstracts?.getNoRejected().length) &&
      <div className="alert alert-warning">
        {t('trabalho.limite-atingido')}
      </div>}

      {(edition.abstract.limit_per_user === 0 || abstracts?.count() > 0 && edition.abstract.limit_per_user > abstracts?.getNoRejected().length) &&
      <div className="d-md-flex align-items-center">
        <Link href={`/abstracts/new`}><a
          className="btn btn-lg btn-primary">{t('trabalho.novo-trabalho')}</a></Link>
        {edition.abstract.limit_per_user > 0 &&
        <div className="my-3 ml-md-4">
          {`${t('trabalho.existe-um-limite')} ${edition.abstract.limit_per_user} ${t('trabalho.trabalhos-por-autor')}.`}
        </div>}
      </div>}
    </>)
  }


  return (<MainLayout sidebar={{title: edition.name, component: <EditionSidebar edition={edition}/>}}>
    <div className="row">
      <div className="col-12 p-4">

        {phase === 'synopsis' && <SynopsisIntro/>}

        {abstracts && abstracts.all().map(abstract => (<AbstractCard key={abstract.databaseId} abstract={abstract}/>))}

        {(abstracts && abstracts?.count() === 0) &&
        <div className="alert alert-light border">
          Você não tem trabalhos. / Nothin to show.
        </div>}


      </div>
    </div>
  </MainLayout>)
}

export default privateRoute(Abstracts)
