import React, {useState} from "react";
import moment from "moment";
import {Icon} from "@brunobarros/react-components";
import AuthorEditModal from "../abstract/author-edit-modal";
import {statusColorName} from "../../src/helpers";
import useTrans from "../hooks/useTrans";
import AbstractAuthorsModal from "../abstract/abstract-authors-modal";
import AbstractAttachmentsModal from "../abstract/abstract-attachments-modal";

export function RenderCell({cell}) {
  // console.log(cell.props.cell.value);
  if (cell.props.cell.column.id === 'status') return <Status cell={cell}/>
  if (cell.props.cell.column.id === 'authors_count') return <Authors cell={cell}/>
  if (cell.props.cell.column.id === 'evaluations_count') return <Evaluations cell={cell}/>
  if (cell.props.cell.column.id === 'attachments_count') return <Attachments cell={cell}/>
  if (cell.props.cell.column.id === 'date') return <DateTime cell={cell}/>
  if (cell.props.cell.column.id === 'gender') return <Gender cell={cell}/>
  return cell
}

export function Gender({cell}) {
  return <a href="https://google.com" target="_blank" title={cell.props.cell.value}>{cell}</a>
}

export function DateTime({cell}) {
  return <div className="text-sm">{moment(cell.props.cell.value).format('DD/MM/YYYY H:mm')}</div>
}

export function Authors({cell, count}:{cell?:any, count?:number}) {
  const [show, setShow] = useState(false)

  return (<>
    <button onClick={()=> setShow(true)} type="button" className="d-flex align-items-center btn btn-sm btn-link py-0"><Icon name={`person-outline`}/><span className="ml-1">{` `} ({cell.props.cell.value})</span></button>
    <AbstractAuthorsModal show={show} abstract_id={cell.props.cell.row.original.databaseId} onDismiss={()=>setShow(false)}/>
  </>)
}

export function Evaluations({cell, count}:{cell?:any, count?:number}) {
  return <button className="d-flex align-items-center btn btn-sm btn-link py-0"><Icon name={`chatbox-outline`}/><span className="ml-1">{` `} ({cell.props.cell.value})</span></button>
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
