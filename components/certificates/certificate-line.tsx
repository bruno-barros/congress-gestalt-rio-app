import Button from "react-bootstrap/Button";
import { CertificatesSchema } from "../../src/types/certificates";
import { dump } from "../../src/helpers";
import { useState } from "react";
import LoadingButton from "../ui/loading-button";
import WpCertificate from "../../src/http/wp-certificate";
import useCurrentUser from "../hooks/useCurrentUser";
import { toast } from "react-toastify";
import useSettings from "../hooks/useSettings";
import { t } from "i18next";

interface CertificateLineProps {
  certificate: CertificatesSchema;
}
export default function CertificateLine(props: CertificateLineProps) {
  const { certificate } = props;
  const { user } = useCurrentUser();
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState(certificate.url || null);
  const {data: evnt} = useSettings(certificate.edition);

  async function handleGenerate() {
    setLoading(true);
    const axios = await WpCertificate.generate({
      type: certificate.type,
      user_id: user?.getId(),
      edition: certificate.edition,
      entity_id: certificate?.entity_id || null,
    });
    const resp = axios.data;
    setLoading(false);
    if(resp.success){
        setUrl(resp.data.url);
    } else {
        toast.error(`Erro ao gerar certificado: ${resp.message}`);
    }
  }

  return (
    <div className="card bg-light mb-4 p-4">
        {/* {dump({...certificate, orgUrl: url})} */}
      <h4 className="m-0">{certificate.name}</h4>
      <hr />
      <div className="mb-3">
        <div>{t('edicao')}: {evnt?.edition?.name || certificate.edition}</div>
      </div>
      {url ? (
        <div>
          <a href={url} target="_blank" className="btn btn-primary">
            {t('certificado.abrir')}
          </a>
        </div>
      ) : (
        <div className="mt-3">
          <LoadingButton
            loading={loading}
            variant="secondary"
            onClick={handleGenerate}
          >
            {t('certificado.gerar')}
          </LoadingButton>
        </div>
      )}
      {/* {dump(certificate)} */}
    </div>
  );
}
