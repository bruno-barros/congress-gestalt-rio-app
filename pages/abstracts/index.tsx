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


const Abstracts = () => {

  const t = useTrans()
  const router = useRouter()
  const {user} = useCurrentUser()
  const {data: event} = useEvent()
  const currentEdition = event && event.currentEdition()
  const edition = router.query?.edition && event?.getEdition(String(router.query.edition)) || currentEdition
  const isCurrent = currentEdition?.id === edition?.id
  const {data: abstracts, error, isLoading} = useQuery<any[], any>(['abstracts', user.getId(), edition?.id], queryAbstracts, {
    enabled: !!edition?.id && user.getId() > 0
  })

  function queryAbstracts(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      WpAbstract.collection({
        edition: edition.id,
        authorId: user.getId()
      }).then(resp => {
        if (resp.data.data?.abstractFilters?.nodes) {
          resolve(resp.data.data.abstractFilters.nodes)
        } else {
          reject([])
          errorNotification({error: resp.data.errors})
        }
      }, err => {
        reject([])
        errorNotification({error: err})
      })
    })
  }

  if (!event || isLoading) {
    return (<MainLayout>
      <Loading vspace={80}/>
    </MainLayout>)
  }


  return (<MainLayout sidebar={{title: edition.name, component: <EditionSidebar edition={edition}/>}}>
    <div className="row">
      <div className="col-12 p-4">

        {(!abstracts || abstracts?.length === 0) && isCurrent
        && <Card style={{maxWidth: 600}}>
          <Card.Body className="p-5">
            <p>Olá, congressista.</p>
            <p>Antes de submeter seu trabalho confira as <a href="#" target="_blank">regras de submissão de
              trabalhos</a>.
              Você pode enviar até 2 trabalhos.</p>
            <p><Link href={`/abstracts/new`} passHref><a
              className="btn btn-primary">{t('trabalho.novo-trabalho')}</a></Link>
            </p>
          </Card.Body>
        </Card>}

        {(abstracts && abstracts?.length > 0) && <div className=""><Link href={`/abstracts/new`}><a
          className="btn btn-lg btn-primary">{t('trabalho.novo-trabalho')}</a></Link></div>}

        {abstracts && abstracts.map(abstract => (<AbstractCard key={abstract.databaseId} abstract={abstract}/>))}

        {(!isCurrent && abstracts && abstracts?.length === 0) &&
        <div className="alert alert-light border">
          Você não tem trabalhos nesta edição. / Nothin to show.
        </div>}


      </div>
    </div>
  </MainLayout>)
}

export default Abstracts
