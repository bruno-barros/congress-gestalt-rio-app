import MainLayout from "../../components/layout";
import Card from "react-bootstrap/cjs/Card";
import useEvent from "../../components/hooks/useEvent";
import EditionSidebar from "../../components/event/edition-sidebar";
import {Loading} from "@brunobarros/react-components";
import AbstractCard from "../../components/abstract/abstract-card";
import Link from "next/link";
import {useEffect} from "react";
import {useQuery} from "react-query";
import useCurrentUser from "../../components/hooks/useCurrentUser";
import {WpAbstract} from "../../src/http/wp-abstract";
import Error from "../../src/resources/error";
import {toast} from "react-toastify";


const Abstracts = () => {

  const {user} = useCurrentUser()
  const {data: event} = useEvent()
  const edition = event && event.currentEdition()
  const {data: abstracts, error, isLoading} = useQuery<any[], any>(['abstracts', user.getId(), edition?.id], queryAbstracts, {
    enabled: !!edition?.id && user.getId() > 0
  })

  function queryAbstracts(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      WpAbstract.collection({
        edition: edition.id,
        authorId: user.getId()
      }).then(resp => {
        if(resp.data.data?.abstractFilters?.nodes){
          resolve(resp.data.data.abstractFilters.nodes)
        } else {
          reject([])
          let error = Error.make(resp.data.errors)
          toast.error(error.message)
        }
      }, err => {
        reject([])
        let error = Error.make(err)
        toast.error(error.message)
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
        {(!abstracts || abstracts?.length === 0)
        && <Card style={{maxWidth: 600}}>
          <Card.Body className="p-5">
            <p>Olá, congressista.</p>
            <p>Antes de submeter seu trabalho confira as <a href="#" target="_blank">regras de submissão de
              trabalhos</a>.
              Você pode enviar até 2 trabalhos.</p>
            <p><Link href={`/abstracts/new`} passHref><a className="btn btn-primary">Envie seu trabalho agora</a></Link>
            </p>
          </Card.Body>
        </Card>}

        {abstracts && abstracts.map(abstract => (<AbstractCard key={abstract.databaseId} abstract={abstract}/>))}


      </div>
    </div>
  </MainLayout>)
}

export default Abstracts
