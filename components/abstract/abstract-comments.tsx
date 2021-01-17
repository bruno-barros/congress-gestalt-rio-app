import Abstract from "../../src/resources/abstract";
import {Loading} from "@brunobarros/react-components";
import {useQuery} from "react-query";
import WpEvaluation from "../../src/http/wp-evaluation";
import useTrans from "../hooks/useTrans";
import moment from "moment";
import {statusColorName} from "../../src/helpers";

interface AbstractCommentsProps {
  abstract: Abstract
}

export default function AbstractComments(props: AbstractCommentsProps) {

  const t = useTrans()
  const {abstract} = props
  const {data: evaluations, isLoading, error} = useQuery<any[]>(['abstract_evaluations', abstract.databaseId], queryEvaluations, {
    enabled: !!abstract?.databaseId
  })

  function queryEvaluations(): Promise<any[] | null> {
    return new Promise((resolve) => {
      WpEvaluation.forAbstract(abstract.databaseId)
        .then(resp => {
          if (resp.data.data?.evEvaluations?.nodes) {
            resolve(resp.data.data.evEvaluations.nodes)
          } else {
            resolve(null)
          }
        }, err => {

        })
    })
  }

  return (<div className="">
    <p><strong>{t('trabalho.comentarios')}</strong>
      {evaluations && evaluations?.filter(eva => eva.is_public)?.length === 0 &&
      <span className="text-sm d-block">{t('trabalho.nenhum-comentario')}</span>}
    </p>
    {isLoading && <Loading/>}
    <div className="comment-box-wraper">
      {evaluations && evaluations.filter(eva => eva.is_public).map(eva => (
        <div key={eva.databaseId} className="comment-box">
          <header className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <div className={`bullet bg-${statusColorName(eva.status)}`}/>
              <div className={`text-${statusColorName(eva.status)}`}>{t(`status.${eva.status}`)}</div>
            </div>
            <div className="">{moment(eva.updated_at).format('DD/MM/YYYY')}</div>
          </header>
          <div className="comment">
            {eva.comment}
          </div>
        </div>
      ))}
    </div>
  </div>)
}
