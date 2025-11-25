import axios from "axios";

export interface CEP {
  address: string;
  city: string;
  state: string;
  neighborhood: string;
  complement?: string;
}

export default async function useBuscaCEP(
  cep: string | number
): Promise<CEP | null> {
  const nums = String(cep).replace(/\D+/g, "");

  if (nums.length !== 8) {
    return null;
  }

  // Tenta ViaCEP primeiro
  try {
    const { data } = await axios.get(`https://viacep.com.br/ws/${nums}/json/`);
    if (!data.erro) {
      return {
        address: data.logradouro,
        city: data.localidade,
        state: data.uf,
        neighborhood: data.bairro,
        complement: data.complemento,
      };
    }
  } catch (error) {
    // Falha silenciosa para tentar o próximo serviço
  }

  // Tenta ApiCEP como fallback
  try {
    const { data } = await axios.get(`https://ws.apicep.com/cep/${nums}.json`);
    if (data.status === 200) {
      return {
        address: data.address,
        city: data.city,
        state: data.state,
        neighborhood: data.district,
        complement: "",
      };
    }
  } catch (error) {
    // Falha silenciosa
  }

  return null;
}
