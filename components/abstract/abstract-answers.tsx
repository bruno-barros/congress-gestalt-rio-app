import useEvent from "../hooks/useEvent";
import React from "react";
import Icon from "../ui/ionicon";
import useSettings from "../hooks/useSettings";
import { useRouter } from "next/router";

interface AbstractAnswersProps {
  answers: any[]
  edition_id?: string
  className?: string
}

export default function AbstractAnswers(props: AbstractAnswersProps) {

  const {answers, edition_id, className} = props
  const router = useRouter()
  const lang = router.locale
  const {data: event, isLoading, currentEdition: edition} = useSettings(edition_id)  
  const questions = edition?.getReviewQuestions()

  function findQuestion(key: string) {
    return questions.find(q => q.id === key)
  }

  if(!event || !edition || !questions || !answers){
    return null
  }

  return (<table className={`table table-sm ${className || ''}`}>
    {/*<code>{JSON.stringify(answers)}</code>*/}
    <tbody>
    {questions.length > 0 && Object.keys(answers).map(key => {
      const resp = Boolean(answers[key])
      return <tr key={key}>
        <td style={{verticalAlign: 'middle'}}>
          <Icon name={resp ? 'checkmark-circle-outline' : 'close-outline'} style={{fontSize: 25, lineHeight: 0, color: resp? 'green':'red'}}/></td>
        <td style={{verticalAlign: 'middle'}}>{findQuestion(key)?.[lang]}</td>
      </tr>
    })}
    </tbody>
  </table>)
}
