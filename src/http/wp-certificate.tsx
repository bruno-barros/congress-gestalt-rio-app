import { AxiosResponse } from "axios";
import { CertificatesModelSchema, CertificatesSchema, CertificateType } from "../types/certificates";
import { httpApi, restApi, RESTVersion } from "./axios";
import { WpRestResponse } from "../types/restapi";

export default class WpCertificate {

  
  static list(args: {
    edition: string;
  }): Promise<AxiosResponse<WpRestResponse<CertificatesModelSchema[]>>> {
    return restApi.get(`${RESTVersion.default().namespace}/certificates`, {params: args});
  }

  static previewUrl(args: {
    edition: string;
    type: CertificateType;
    user_id: number | string;
  }): string {
    return `${restApi.defaults.baseURL}${
      RESTVersion.default().namespace
    }/certificates/preview?edition=${args.edition}&type=${args.type}&user_id=${
      args.user_id
    }`;
  }
  
  /**
   * Cria o certificado para o usuário. Salva e retorna os dados do certificado.
   * @param args 
   * @returns 
   */
  static generate(args: {
    edition: string;
    type: CertificateType;
    user_id: number | string;
  }): Promise<AxiosResponse<WpRestResponse<CertificatesModelSchema>>> {
    return restApi.post(`${RESTVersion.default().namespace}/certificates/generate`, args);
  }
}