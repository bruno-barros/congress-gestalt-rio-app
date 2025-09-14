import { useQuery } from "react-query";
import WpCertificate from "../../src/http/wp-certificate";
import { CertificatesModelSchema } from "../../src/types/certificates";

export default function useCertificates(edition: string) {
  async function fetch(): Promise<CertificatesModelSchema[]> {
    const axios = await WpCertificate.list({ 
      edition: edition,
    });
    const response = axios.data;
    return response.data;
  }

  return useQuery(["adm-certificates", edition], fetch, {
    enabled: !!edition,
  });
}
