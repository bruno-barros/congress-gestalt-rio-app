import MainLayout from "../../components/layout";
import useTrans from "../../components/hooks/useTrans";
import useEvent from "../../components/hooks/useEvent";
import {Edition} from "../../src/resources/event";
import {useRouter} from "next/router";
import {Loading} from "@brunobarros/react-components";
import useCurrentUser from "../../components/hooks/useCurrentUser";
import useEvaluation from "../../components/hooks/useEvaluation";
import AbstractView from "../../components/abstract/abstract-view";
import EvaluationForm from "../../components/abstract/evaluation-form";


const EvaluationEditing = () => {

  const {user} = useCurrentUser()
  const router = useRouter()
  const t = useTrans()
  const {data: event, isLoading} = useEvent()
  const edition: Edition = event?.currentEdition()
  const {data: evaluation, error, isLoading: loadingEval} = useEvaluation(Number(router.query?.id))


  if (isLoading || loadingEval) {
    return <MainLayout><Loading vspace={80}/></MainLayout>;
  }


  if (evaluation.user_id !== user.getId() && !user.canManageAbstracts()) {
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

  if (evaluation.abstract.authorDatabaseId === user.getId()) {
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
    <div className="row no-gutters">
      <div className="col-12 col-md-8 p-3 p-lg-5">
       <AbstractView abstract={evaluation.getAbstract()}/>
      </div>
      <div className="col-12 col-md-4 bg-light p-3 p-lg-4">
        <EvaluationForm evaluation={evaluation}/>
      </div>
    </div>
  </MainLayout>)
}


export default EvaluationEditing
