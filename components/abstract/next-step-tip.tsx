import { StatusType } from "../../src/types/abstracts";
import useTrans from "../hooks/useTrans";
import {useRouter} from "next/router";

interface NextStepProps {

  status: StatusType
}

export default function NextStepTip(props: NextStepProps) {
  const {status} = props
  const router = useRouter()
  const t = useTrans()
  const lang = router.locale || 'pt'

  function messages() {
    const pending = {
      pt: 'O autor deve submeter a sinopse para avaliação.',
      en: 'The author must submit the resume for evaluation.',
      es: 'El autor deberá entregar la sinopsis para su evaluación.'
    }
    const revision = {
      pt: 'Sinopse (ou trabalho) enviada para revisão (Quando começar a avaliação o autor não poderá editá-la).',
      en: 'Resume (or abstract) sent to revision (When the evaluation begins, the author will not be able to edit it).',
      es: 'Sinopsis (o trabajo) enviado para revisión (Una vez iniciada la revisión, el autor no podrá editarlo).'
    }
    const evaluating = {
      pt: 'Sinopse (ou trabalho) está sendo avaliado.',
      en: 'The resume (or abstract) is being evaluated.',
      es: 'Se está evaluando la sinopsis (o trabajo).'
    }
    const rejected = {
      pt: 'Sinopse (ou trabalho) rejeitado, por tanto não é possível editá-la.',
      en: 'Resume (or abstract) rejected, so it is not possible to edit it.',
      es: 'Sinopsis (o obra) rechazada, por lo tanto no es posible editarla.'
    }
    const waiting = {
      pt: 'O autor deve fazer as correções solicitadas e submetê-lo a avaliação.',
      en: 'The author must make the requested corrections and submit it for evaluation.',
      es: 'El autor deberá realizar las correcciones solicitadas y enviarlo para su evaluación.'
    }
    const synopsis_approved = {
      pt: 'Sinopse aprovada! O autor deve submeter o trabalho para avaliação.',
      en: 'Synopsis approved! The author must submit the abstract for evaluation.',
      es: '¡Sinopsis aprobada! El autor deberá enviar el trabajo para su evaluación.'
    }
    const pre_approved = {
      pt: 'Trabalho aprovado! Aguardando confirmação da organização.',
      en: 'Approved abstract! Awaiting confirmation from the organization.',
      es: '¡Trabajo aprobado! Esperando confirmación por parte de la organización.'
    }
    const approved = {
      pt: 'Parabéns! Trabalho aprovado para apresentação.',
      en: 'Congratulations! Approved abstract for presentation.',
      es: '¡Felicidades! Trabajo aprobado para presentación.'
    }

    return {
      pending,
      synopsis_revision: revision,
      synopsis_evaluating: evaluating,
      synopsis_rejected: rejected,
      synopsis_waiting_upd: waiting,
      synopsis_approved,
      revision,
      final_revision: revision,
      evaluating,
      rejected,
      waiting_update: waiting,
      pre_approved,
      approved
    }
  }

  const nextStep = messages()[status] && messages()[status][lang] || null

  return (<div className="next-step-tip">
    {nextStep && <p>
      {status !== 'approved' && <strong>{t('trabalho.proximo-passo')}</strong>}
      <span className={`d-block ${status === 'approved' ? 'alert alert-success' : ''}`}>
        <span className="d-block text-sm">{nextStep}</span>
      </span>
    </p>}
  </div>)
}
