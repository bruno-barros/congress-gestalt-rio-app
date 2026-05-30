import MainLayout from "../../components/layout";
import Card from "react-bootstrap/cjs/Card";
import useEvent from "../../components/hooks/useEvent";
import EditionSidebar from "../../components/event/edition-sidebar";
import AbstractCard from "../../components/abstract/abstract-card";
import Link from "next/link";
import {useQuery, useQueryClient} from "react-query";
import useCurrentUser from "../../components/hooks/useCurrentUser";
import {WpAbstract} from "../../src/http/wp-abstract";
import {errorNotification} from "../../src/resources/responses";
import useTrans from "../../components/hooks/useTrans";
import {useRouter} from "next/router";
import {Trans} from "react-i18next";
import privateRoute from "../../components/hoc/private-route";
import {dump, siteTitle} from "../../src/helpers";
import Head from "next/head";
import {useEffect, useState} from "react";
import useUserOrders from "../../components/hooks/useUserOrders";
import Button from "react-bootstrap/Button";
import Loading from "../../components/ui/loading";
import useSettings from "../../components/hooks/useSettings";
import useEditions from "../../components/hooks/useEditions";
import useAbstracts from "../../components/hooks/useAbstracts";
import { ac } from "../../components/access-control";
import { REQUIREMENTS } from "../../components/access-control/requirements";



const Abstracts = () => {

  const queryClient = useQueryClient()
  const t = useTrans()
  const router = useRouter()
  const {user} = useCurrentUser()
  const selectedEditionKey = String(router.query.edition)
  // const {data: event} = useEvent()
  // const currentEdition = event && event.currentEdition()
  // const edition = router.query?.edition && event?.getEdition(String(router.query.edition)) || currentEdition

  const { data: editions } = useEditions()
  const { data: event, currentEdition } = useSettings()

  const edition = editions?.find(ed => ed.id === selectedEditionKey)

  const [phase, setPhase] = useState(String(router.query?.status))
  const isCurrent = currentEdition?.getId() === edition?.getId()
  const {data: abstracts, error, isLoading} = useAbstracts(user.getId(), edition?.getId())
  const { data: orders, isLoading: ordersLoading } = useUserOrders(
    user?.getId()
  );

  const testMode = edition?.abstract?.test_mode == '1'
  const onlySubscribed = edition?.abstract?.only_subscribed === "1"
  const isSubscribed = testMode 
      ? ac(user, [REQUIREMENTS.abstract.submit], {edition, isSubscribed: true}) 
      : onlySubscribed
        ? orders?.hasValidSubscription(edition)
        : true;

  const isOpenToSubmit = testMode 
    ? ac(user, [REQUIREMENTS.abstract.submit], {edition, isSubscribed}) 
    : edition?.isOpenToAbstracts();

  const lang = router.locale || 'pt'


  useEffect(() => {
    if (router.query?.status) setPhase(String(router.query?.status))
  }, [router.query?.status])



  if (!event || isLoading) {
    return (<MainLayout>
      <Loading vspace={80}/>
    </MainLayout>)
  }

  function SynopsisIntro() {
    return (<>
      {(
        (abstracts?.count() === 0)
        && isCurrent
        && isOpenToSubmit
      ) && <Card style={{maxWidth: 600}}>
        <Card.Body className="p-3 p-md-5">
          <Trans as="div"
                 i18nKey="trabalho.boas-vindas"
                 values={{limit: edition?.abstract?.limit_per_user}}
                 defaults={`<0>Olá, congressista.</0>
              Antes de submeter seu trabalho confira as
                <1>regras de submissão de trabalhos</1>.`}
                 components={[<p>Olá, congressista.</p>,
                   <a href={edition?.abstract?.[`rules_${lang}`]} target="_blank">regras de submissão de trabalhos</a>]}
          />
          <div className="my-3 d-md-flex align-items-center">
            <Link href={`/abstracts/new`} passHref><a
              className="btn btn-primary text-nowrap">{t('trabalho.novo-trabalho')}</a>
            </Link>
            {/* <Link href={`/abstracts?edition=${edition.id}&status=abstract`}><a
          className="btn btn-outline-primary ml-3">{t('trabalho.meus-trabalhos')}</a></Link> */}

            {edition?.abstract?.limit_per_user > 0 &&
            <div className="ml-md-3 mt-3">
            {/* <Trans i18nKey="trabalho.voce-pode-enviar-ate"
                   values={{limit: edition.abstract.limit_per_user}}
                   defaults={`Você pode enviar até {{limit}} trabalhos.`}
            /> */}
            <div className="border-left mt-2 pl-2 text-muted text-sm">
              {lang === 'pt' ? <>Somente 1 trabalho como autor/a e 1 como co-autor/a será possivel enviar nas modalidades Mesa Redonda, Roda de Conversa, Workshop, Mini curso e Poster.
                Ja as modalidades Lançamento de Livro, Apresentação artistico- cultural e Práticas meditativas ou corporais integrativas podem ser propostas até um maximo de 3.</> : <>Sólo se podrá presentar 1 trabajo como autor y 1 como coautor en las modalidades de Mesa Redonda, Círculo de Conversación, Taller, Mini Curso y Póster.
                Las modalidades de Lanzamiento de Libro, Presentación Artístico-Cultural y Prácticas Corporales Meditativas o Integrativas podrán ser propuestas hasta un máximo de 3.</>}            
            </div>
          </div>}


          </div>
        </Card.Body>
      </Card>}


      {/**
       //region Limite atingido
       */      
      // (edition.abstract.limit_per_user > 0 && edition.abstract.limit_per_user <= abstracts?.getNoRejected().length) &&
      // <div className="alert alert-warning">
      //   {t('trabalho.limite-atingido')}
      // </div>
      }

      {(
        abstracts?.count() > 0
        // && (edition.abstract.limit_per_user === 0 || edition.abstract.limit_per_user > abstracts?.getNoRejected().length)
        && isOpenToSubmit
      ) &&
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

  function SubscriptionNotAllowed(){
    return <Card border="warning" className="mb-5">
      <Card.Body>
        <h5>Faça sua inscrição!</h5>
        <p>Caro congressista, para submeter seu trabalho é necessário que você esteja inscrito no evento.</p>
        <Link href={`/register2`} passHref>
          <a className="btn btn-primary">
            {t("fazer-inscricao")}
          </a>
        </Link>
        </Card.Body>
    </Card>
  }


  return (<MainLayout
    sidebar={{title: edition?.getName(), component: <EditionSidebar edition={edition}/>}}>
    <Head>
      <title>{siteTitle('Meus trabalhos', queryClient)}</title>
    </Head>

    <div className="row">
      <div className="col-12 p-4">

        {!isSubscribed && <SubscriptionNotAllowed/>}
        {(isSubscribed && isOpenToSubmit) && <SynopsisIntro/>}
        

        {/**
         //region Lista de trabalhos
         */
        (abstracts && isSubscribed) && abstracts.all().map(abstract => (<AbstractCard key={abstract.databaseId} abstract={abstract}/>))}

        {(abstracts && abstracts?.count() === 0 && phase === 'abstract') &&
        <div className="alert alert-light border">
          Você não tem trabalhos. / Nothin to show.
        </div>}


      </div>
    </div>
    {dump({ 
      isCurrent,
      phase,
      testMode,
      isSubscribed,
      isOpenToSubmit,
      isOpenToAbstracts: edition?.isOpenToAbstracts()
      })}
  </MainLayout>)
}

export default privateRoute(Abstracts)
