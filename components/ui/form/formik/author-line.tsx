import React from "react";
import {Icon} from "@brunobarros/react-components";

interface AuthorLineProps {
  author: any
  index: number
  onDelete: () => void
}
export default function AuthorLine(props: AuthorLineProps) {

  const {author, index: idx, onDelete} = props
  return (<div className="border d-flex align-items-center justify-content-between py-2 px-4" key={idx}
               style={{margin: '0 -1.5rem'}}>
    <div className="d-flex">
      <div className="mr-2">{`#${idx + 1}`}</div>
      <div className="text-truncate">{author.name}</div>
    </div>
    <button type="button" className="btn btn-sm btn-outline-danger" onClick={onDelete}><Icon name={`trash-outline`}/></button>
  </div>)
}
