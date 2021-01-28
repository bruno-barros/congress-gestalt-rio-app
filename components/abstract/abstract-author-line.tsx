import React from "react";
import {Icon} from "@brunobarros/react-components";
import {Button, Accordion, Card} from "react-bootstrap/cjs";
import {Author} from "../../src/resources/user";

interface AbstractAuthorLineProps {
  i: number
  author: Author
  mainAuthorId: number
}

export default function AbstractAuthorLine(props: AbstractAuthorLineProps) {

  const {author, i, mainAuthorId} = props

  return (<Card>
      <Card.Header className="d-flex align-items-center justify-content-between py-1">
        <Accordion.Toggle as={Button} variant="link" eventKey={`${author.id}`} className="flex-grow-1 text-left">
          {author.name}
        </Accordion.Toggle>
        <div className="d-flex align-items-center">
           {author.wp_user_id === mainAuthorId && <div className="badge badge-dark">autor de contato</div>}
          {author.is_speaker === 1 && <div className="badge badge-warning ml-3">apresentador</div>}
        </div>
      </Card.Header>
      <Accordion.Collapse eventKey={`${author.id}`}>
        <Card.Body>
          <table className="table table-sm">
            <tbody>
            <tr>
              <th>Email</th>
              <td width="100%">{author.email}</td>
            </tr>
            {author.company &&
            <tr>
              <th>Instituição</th>
              <td>{author.company}</td>
            </tr>}
            {author.bio &&
            <tr>
              <th>Bio</th>
              <td>{author.bio}</td>
            </tr>}
            </tbody>
          </table>
        </Card.Body>
      </Accordion.Collapse>
    </Card>)
}
