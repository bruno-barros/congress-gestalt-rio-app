import React from "react";
import Icon from "../ui/ionicon";

interface SortedLabelProps {
  active: boolean
  direction: 'desc'|'asc'
  children: any
}
export default function SortedLabel(props: SortedLabelProps) {

  const {active, direction} = props

  return (<div className="table-sorted-label">
    <div className="lbl">{props.children}</div>
    <div className="sort">{active && <Icon name={`${direction === 'desc' ? 'arrow-down-outline' : 'arrow-up-outline'}`}/>}</div>
  </div>)
}
