import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useState } from "react";
import { CertificateType } from "../../src/types/certificates.d";
import FindUser from "../user/find-user";
import { User } from "../../src/resources/user";
import { dump, openNewAuthenticatedTab } from "../../src/helpers";
import WpCertificate from "../../src/http/wp-certificate";

interface CertificatePreviewModalProps {
  type?: CertificateType;
  edition: string;
}
export default function CertificatePreviewModal(
  props: CertificatePreviewModalProps
) {
  const { type = CertificateType.PARTICIPANT, edition } = props;
  const [show, setShow] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [certType, setType] = useState<CertificateType>(type);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  function handleGenerate() {
    if (!user) {
      alert("Selecione um usuário para gerar o certificado.");
      return;
    }

    const url = WpCertificate.previewUrl({
        edition,
        type: certType,
        user_id: user.getId()
    });

    openNewAuthenticatedTab(url);
  }

  return (
    <>
      <Button variant="primary" size="sm" onClick={handleShow}>
        Testar modelo
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Pré-visualização do Certificado</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group mb-3">
            <label htmlFor="">
              Selecione o usuário para visualizar o certificado:
            </label>
            <FindUser onUpdate={setUser} preSelected={user} />
          </div>

          <div className="mb-3 form-group">
            <label htmlFor="">Tipo de certificado</label>
            <select
              className="form-control form-control-sm"
              defaultValue={type}
              onChange={(e) => setType(e.target.value as CertificateType)}
            >
              <option value={CertificateType.PARTICIPANT}>
                Participação no evento
              </option>
              <option value={CertificateType.ABSTRACT}>
                Envio de trabalho
              </option>
              <option value={CertificateType.ACTIVITY}>
                Participação em atividade
              </option>
            </select>
          </div>
          <hr />
          {/* {dump({certType})} */}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Fechar
          </Button>
          <Button onClick={handleGenerate}>Gerar certificado</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
