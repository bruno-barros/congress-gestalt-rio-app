import useEvent from "../hooks/useEvent";
import React from "react";
import Icon from "../ui/ionicon";

interface AbstractAnswersProps {
  answers: any[]
  edition_id?: string
  className?: string
}

export default function AbstractAnswers(props: AbstractAnswersProps) {

  const {answers, edition_id, className} = props
  const {data: event, isLoading} = useEvent()
  const edition = event && !edition_id && event.currentEdition() || event.getEdition(edition_id)
  const questions = edition?.getReviewQuestions()

  if(!event || !edition || !questions || !answers){
    return null
  }

  return (<table className={`table table-sm ${className || ''}`}>
    {/*<code>{JSON.stringify(answers)}</code>*/}
    <tbody>
    {questions && Object.keys(answers).map(key => {
      return <tr key={key}>
        <td><Icon name={answers[key] ? 'checkmark-circle-outline' : 'close-outline'} style={{fontSize: 25, lineHeight: 0}}/></td>
        <td>{questions[key]}</td>
      </tr>
    })}
    </tbody>
  </table>)
}
