import { PropsWithChildren, useState } from "react";
import Popover from "react-bootstrap/Popover";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

interface ButtonVariablesProps {}
export default function ButtonVariables(
  props: PropsWithChildren<ButtonVariablesProps>
) {
  const { children } = props;

  function Code({code, description}) {
    return (
      <dl className="d-flex mb-2 border-bottom " style={{lineHeight: '1em', fontSize: '.9em'}}>
        <dt className="text-danger text-sm">%{code}%</dt>
        <dd className="ml-2 text-sm">{description}</dd>
      </dl>
    );

  }

  const popover = (
    <Popover id="popover-cert-vars">
      <Popover.Title as="h3">Variáveis do certificado</Popover.Title>
      <Popover.Content>
        <Code code="EV_NOME" description="Nome do evento." />
        <Code code="NOME" description="Nome do participante." />
        <Code code="DOC" description="CPF (ou outro) documento do participante." />
        <Code code="DT_PER" description="Período do evento por extenso." />
        <Code code="ATIV_NOME" description="Nome da atividade." />
        <Code code="ATIV_DT" description="Data da atividade." />
      </Popover.Content>
    </Popover>
  );

  return (
    <>
      <OverlayTrigger trigger="click" placement="left" overlay={popover}>
        <button
          type="button"
          className="btn btn-sm btn-link p-0"
          style={{ lineHeight: "1em" }}
        >
          {children}
        </button>
      </OverlayTrigger>
    </>
  );
}
