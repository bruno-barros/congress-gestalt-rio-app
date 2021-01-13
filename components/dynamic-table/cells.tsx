import React, {useMemo, useState} from "react";
import moment from "moment";
import {Icon} from "@brunobarros/react-components";
import {statusColorName} from "../../src/helpers";
import useTrans from "../hooks/useTrans";
import AbstractAuthorsModal from "../abstract/abstract-authors-modal";
import AbstractAttachmentsModal from "../abstract/abstract-attachments-modal";
import {MapRoles} from "../../src/resources/user";
import Link from "next/link";
import AbstractEvaluationsModal from "../abstract/abstract-evaluations-modal";

export function RenderCell({cell}) {
  // console.log(cell.props.cell.value);
  if (cell.props.cell.column.id === 'status') return <Status cell={cell}/>
  if (cell.props.cell.column.id === 'authors_count') return <Authors cell={cell}/>
  if (cell.props.cell.column.id === 'evaluations_count') return <Evaluations cell={cell}/>
  if (cell.props.cell.column.id === 'attachments_count') return <Attachments cell={cell}/>
  if (['date', 'ev_last_update'].indexOf(cell.props.cell.column.id) !== -1) return <DateTime cell={cell}/>
  if (cell.props.cell.column.id === 'roles') return <Roles cell={cell}/>
  if (cell.props.cell.column.id === 'order_status') return <OrderStatus cell={cell}/>
  if (cell.props.cell.column.id === 'title') return <AddLink cell={cell}/>
  if (cell.props.cell.column.id === 'name') return <AddLink cell={cell}/>
  return cell
}

export function Roles({cell}) {
  const roles = cell.props.cell.value?.split(',')

  return roles ? roles.map(role => {
    const maped = MapRoles.find(r => r.label === role)
    return <span key={role} className="badge badge-secondary" style={{backgroundColor: maped.color}}>{role}</span>
  }) : null
}

export function OrderStatus({cell}) {
  const label = cell.props.cell.value
  const status = cell.props.row.original.status_woo.toLowerCase()
    return <span className={`badge badge-${status}`} style={{}}>{label}</span>
}

export function AddLink({cell}) {
  const model = cell._owner.memoizedProps.name
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
