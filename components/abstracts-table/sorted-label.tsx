import React from "react";
import {Icon} from "@brunobarros/react-components";

interface SortedLabelProps {
  active: boolean
  direction: 'desc'|'asc'
  children: any
}
export default function SortedLabel(props: SortedLabelProps) {

  const {active, direction} = props
  // <span>
  //                   {column.isSorted
  //                     ? column.isSortedDesc
  //                       ? ' 🔽'
  //                       : ' 🔼'
  //                     : ''}
  //                 </span>

  return (<div className="table-sorted-label">
    <div className="lbl">{props.children}</div>
    <div className="sort">{active && <Icon name={`${direction === 'desc' ? 'arrow-down-outline' : 'arrow-up-outline'}`}/>}</div>
  </div>)
}
