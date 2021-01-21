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
         {author.name} {author.wp_user_id === mainAuthorId && <div className="badge badge-dark mx-3">autor de contato</div>}
        </Accordion.Toggle>
        <div className="d-flex align-items-center">
          {author.is_speaker ? <div className="badge badge-warning">apresentador</div> : ''}<Icon name={`${author.is_speaker ? 'mic-outline' : 'mic-off-outline'}`} style={{fontSize: 20}}/>
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
            <tr>
              <th>Instituição</th>
              <td>{author.company}</td>
            </tr>
            <tr>
              <th>Bio</th>
              <td>{author.bio}</td>
            </tr>
            </tbody>
          </table>
        </Card.Body>
      </Accordion.Collapse>
    </Card>)
}
