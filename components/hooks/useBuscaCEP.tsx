import axios, {AxiosResponse} from "axios";

export interface CEP {
  address: string;
  city: string;
  state: string;
  neighborhood: string;
  complement?: string;
}

export default function useBuscaCEP(cep: string | number): Promise<CEP | null> {

  return new Promise((resolve, reject) => {

    let nums = String(cep).replace(/\D+/g, '')
    if (nums?.length !== 8) {
      reject(null)
      return;
    }

    let apis = [
      {url: `https://ws.apicep.com/cep/${nums}.json`, name: 'apicep'},
      {url: `https://viacep.com.br/ws/${nums}/json`, name: 'viacep'},
      // {url: `http://cep.la/${nums}`, name: 'cepla'},
    ]
    let result: CEP = null;
    for (let x = 0; x < apis.length; x++) {
      let api = apis[x]
      if(result) break;
      axios.get(api.url).then((resp) => {
        if (api.name === 'apicep') {
          result = {
            address: resp.data.address,
            city: resp.data.city,
            state: resp.data.state,
            neighborhood: resp.data.district,
            complement: '',
          }
        } else if (api.name === 'viacep') {
          result = {
            address: resp.data.logradouro,
            city: resp.data.city,
            state: resp.data.state,
            neighborhood: resp.data.neighborhood,
            complement: resp.data.complement,
          }
        }
        resolve(result)
      }, err => {
      }).catch(err => {
      })
    }

  })
}
