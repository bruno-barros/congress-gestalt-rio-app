import {TableInstance} from "react-table";
import {PropsWithChildren, ReactElement, useState} from "react";
import {useRouter} from "next/router";
import useTrans from "../hooks/useTrans";


type EvaluationStatus<T extends object> = {
  instance: TableInstance<T>
}
export default function EvaluationStatus<T extends object>({instance}: PropsWithChildren<EvaluationStatus<T>> & any): ReactElement | null {

  const router = useRouter()
  const t = useTrans()
  const {data, setGlobalFilter, setAllFilters, state: {selectedRowIds}} = instance
  const awaitingReview = data.filter(row => ['synopsis_evaluating', 'evaluating'].indexOf(row?.status) !== -1)


  if(awaitingReview?.length === 0) return  null

  function filter(){
    setGlobalFilter(undefined)
    setAllFilters([{id: 'status', value: 'evaluating'}])
  }
  return (<button type="button" className="btn btn-warning -bg-warning -py-2 -px-3" onClick={filter}>
    <strong>{awaitingReview?.length}</strong> aguardando revisão
  </button>)

}
