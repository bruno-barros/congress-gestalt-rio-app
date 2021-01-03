import React from "react";
import {Icon} from "@brunobarros/react-components";
import {Button, Accordion, Card} from "react-bootstrap/cjs";

interface AbstractAuthorLineProps {
  i: number
  author: {
    name: string
    email: string
    active: number
    bio: string
    id: number
    is_speaker: number
    order?: number
  }
}

export default function AbstractAuthorLine(props: AbstractAuthorLineProps) {

  const {author, i} = props
  return (<Card>
      <Card.Header className="d-flex align-items-center justify-content-between">
        <Accordion.Toggle as={Button} variant="link" eventKey={`${author.id}`}>
         {author.name}
        </Accordion.Toggle>
        <div className="d-flex align-items-center">
          {author.is_speaker ? '(apresentador) ' : '(não apresenta) '}<Icon name={`${author.is_speaker ? 'mic-outline' : 'mic-off-outline'}`} style={{fontSize: 20}}/>
        </div>
      </Card.Header>
      <Accordion.Collapse eventKey={`${author.id}`}>
        <Card.Body>
          <p>{author.email}</p>
          <p>{author.bio}</p>
        </Card.Body>
      </Accordion.Collapse>
    </Card>)
}
