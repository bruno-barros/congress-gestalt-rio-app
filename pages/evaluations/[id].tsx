import MainLayout from "../../components/layout";
import useTrans from "../../components/hooks/useTrans";
import useEvent from "../../components/hooks/useEvent";
import Edition from "../../src/resources/edition";
import {useRouter} from "next/router";
import useCurrentUser from "../../components/hooks/useCurrentUser";
import useEvaluation from "../../components/hooks/useEvaluation";
import AbstractView from "../../components/abstract/abstract-view";
import EvaluationForm from "../../components/abstract/evaluation-form";
import privateRoute from "../../components/hoc/private-route";
import {siteTitle} from "../../src/helpers";
import Head from "next/head";
import {useQueryClient} from "react-query";
import Loading from "../../components/ui/loading";
import useSettings from "../../components/hooks/useSettings";
import ProgressBar from "../../components/ui/progressbar";
import { ac } from "../../components/access-control";
import { REQUIREMENTS } from "../../components/access-control/requirements";


const EvaluationEditing = () => {

  const queryClient = useQueryClient()
  const {user} = useCurrentUser()
  const router = useRouter()
  const t = useTrans()
  const {data: event, isLoading, currentEdition: edition} = useSettings()
  const ReviewCnf = edition?.Review()
  const {data: evaluation, error, isLoading: loadingEval, refetch} = useEvaluation(Number(router.query?.id))


  if (isLoading || loadingEval) {
    return <MainLayout><ProgressBar /></MainLayout>;
  }


  if (evaluation.user_id !== user.getId() && !ac(user, [REQUIREMENTS.abstract.manage])) {
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

  if (evaluation.abstract?.authorDatabaseId === user.getId()) {
    return <MainLayout>
      <div className="container">
        <div className="row">
          <div className="col-12 col-md-6 offset-md-3">
            <div className="alert alert-danger mt-5">
              Você não pode avaliar sua próprio trabalho.
            </div>
          </div>
        </div>
      </div>
    </MainLayout>;
  }


  return (<MainLayout fullWidth>
    <Head>
      <title>{siteTitle('Avaliação', queryClient)}</title>
    </Head>
    <div className="row no-gutters">
      <div className="col-12 col-md-8 p-3 p-lg-5">
       <AbstractView abstract={evaluation.getAbstract()}/>
      </div>
      <div className="col-12 col-md-4 bg-light p-3 p-lg-4">
        <EvaluationForm evaluation={evaluation} onUpdate={()=>refetch()}/>
      </div>
    </div>
  </MainLayout>)
}


export default privateRoute(EvaluationEditing)
