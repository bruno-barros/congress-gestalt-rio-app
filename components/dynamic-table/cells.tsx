import React, {useMemo, useState} from "react";
import moment from "moment";
import {statusColorName} from "../../src/helpers";
import useTrans from "../hooks/useTrans";
import AbstractAuthorsModal from "../abstract/abstract-authors-modal";
import AbstractAttachmentsModal from "../abstract/abstract-attachments-modal";
import {MapRoles} from "../../src/resources/user";
import Link from "next/link";
import AbstractEvaluationsModal from "../abstract/abstract-evaluations-modal";
import Icon from "../ui/ionicon";
import EvaluationDetailsModal from "../abstract/evaluation-details-modal";
import useCurrentUser from "../hooks/useCurrentUser";
import { REQUIREMENTS } from "../access-control/requirements";
import { ac } from "../access-control";
import { set } from 'lodash';
import WpUser from "../../src/http/wp-user";
import AuthToken from "../../src/http/auth-token";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import Loading from "../ui/loading";

export function RenderCell({cell}) {
  console.log(cell.props);
  if (cell.props.cell.column.id === 'status') return <Status cell={cell}/>
  if (cell.props.cell.column.id === 'authors_count') return <Authors cell={cell}/>
  if (cell.props.cell.column.id === 'evaluations_count') return <Evaluations cell={cell}/>
  if (cell.props.cell.column.id === 'attachments_count') return <Attachments cell={cell}/>
  if (['date', 'ev_last_update'].indexOf(cell.props.cell.column.id) !== -1) return <DateTime cell={cell}/>
  // if (cell.props.cell.column.id === 'roles') return <Roles cell={cell}/>
  if (cell.props.cell.column.id === 'rolesString') return <Roles cell={cell}/>
  if (cell.props.cell.column.id === 'order_status') return <OrderStatus cell={cell}/>
  if (cell.props.cell.column.id === 'title') return <AddLink cell={cell}/>
  if (cell.props.cell.column.id === 'name') return <AddLink cell={cell}/>
  if (cell.props.cell.column.id === 'total') return <Html cell={cell}/>
  if (cell.props.cell.column.id === 'aa') return <Boolean cell={cell}/>
  if (cell.props.name === 'users' && cell.props.cell.column.id === 'databaseId') return <SwitchUser cell={cell}/>
  if (cell.props.name === 'evaluations-adm' && cell.props.cell.column.id === 'abs_title') return <EvaluationDetails cell={cell}/>
  return cell
}

export function Html({cell}) {
  const val = cell.props.cell.value
  return <div dangerouslySetInnerHTML={{__html: val}}/>
}

export function Roles({cell}) {
  // console.log(cell.props.cell.value)
  const roles = cell.props.cell.value?.split(',')

  return roles ? roles.map(role => {
    const maped = MapRoles.find(r => r.label === role)
    return <span key={role} className="badge badge-secondary" style={{backgroundColor: maped?.color}}>{role}</span>
  }) : null
}


export function Boolean({cell}) {
  // console.log(cell.props.cell.value)
  const trufy = !!cell.props.cell.value

  return trufy ? <>Sim</> : <>Não</>
}

export function OrderStatus({cell}) {
  const label = cell.props.cell.value
  const status = cell.props.row.original.status_woo.toLowerCase()
    return <span className={`badge badge-${status}`} style={{}}>{label}</span>
}

export function AddLink({cell}) {
  const model = cell.props.name
  return <Link href={`/${model}/${cell.props.cell.row.original.databaseId}`}><a>{cell.props.cell.value}</a></Link>
}
export function DateTime({cell}) {
  return <div className="text-sm">{moment(cell.props.cell.value).format('DD/MM/YYYY H:mm')}</div>
}

export function Authors({cell, count}:{cell?:any, count?:number}) {
  const [show, setShow] = useState(false)

  return (<>
    <button onClick={()=> setShow(true)} type="button" className="d-flex align-items-center btn btn-sm btn-link py-0"><Icon name={`person-outline`}/><span className="ml-1">{` `} ({cell.props.cell.value})</span></button>
    <AbstractAuthorsModal show={show} abstract_id={cell.props.cell.row.original.databaseId}
                          onDismiss={()=>setShow(false)}/>
  </>)
}

export function Evaluations({cell, count}:{cell?:any, count?:number}) {
  const [show, setShow] = useState(false)

  return (<>
    <button onClick={()=> setShow(true)} type="button" className="d-flex align-items-center btn btn-sm btn-link py-0"><Icon name={`chatbox-outline`}/><span className="ml-1">{` `} ({cell.props.cell.value})</span></button>
    <AbstractEvaluationsModal show={show} abstract_id={cell.props.cell.row.original.databaseId}
                              onDismiss={()=>setShow(false)}/>
  </>)
}
export function Attachments({cell, count}:{cell?:any, count?:number}) {
  const [show, setShow] = useState(false)
  return (<>
    <button onClick={()=> setShow(true)} className="d-flex align-items-center btn btn-sm btn-link py-0"><Icon name={`attach-outline`} style={{fontSize: 20}}/><span> ({cell.props.cell.value})</span></button>
    <AbstractAttachmentsModal show={show} abstract_id={cell.props.cell.row.original.databaseId} onDismiss={()=>setShow(false)}/>
  </>)
}

export function Status({cell, count}:{cell?:any, count?:number}) {
  const color = statusColorName(cell.props.cell.value)
  const t = useTrans()
  return <div className={`text-${color}`}>{t(`status.${cell.props.cell.value}`)}</div>
}

function EvaluationDetails({cell}) {
  const title = cell.props.cell.value
  const [show, setShow] = useState(false)
  return <>
    <div className="btn-link" style={{cursor: 'pointer'}} onClick={()=> setShow(true)} >{title}</div>
    <EvaluationDetailsModal show={show} evaluation={cell.props.cell.row.original} onDismiss={()=>setShow(false)}/>
  </>

}

export function SwitchUser({cell}) {
  // console.log(cell.props.cell.value)
  const { user } = useCurrentUser()
  const router = useRouter()
  const able = ac(user, [REQUIREMENTS.user.switch])
  const id = cell.props.cell.value
  const [loading, setLoading] = useState(false)

  async function handleSwitch(){
    setLoading(true)
    const axios = await WpUser.switchTo({ user_id: id })
    const resp = axios.data
    if(resp.success){
      AuthToken.storeToken(resp.data.authToken, null);
      AuthToken.storeRefreshToken(resp.data.refreshToken);
      router.push('/dashboard')
    } else {
      toast.error('Erro ao trocar de usuário.')
    }
  }

  return able 
    ? (loading ? <Loading size="sm" /> : <button onClick={handleSwitch} className="btn btn-link p-0">{id}</button>)
    : <>{id}</>
}