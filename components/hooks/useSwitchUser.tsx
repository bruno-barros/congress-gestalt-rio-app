
import AuthToken from "../../src/http/auth-token";
import WpUser from "../../src/http/wp-user";


export default function useSwitchUser() {

  function fetch(id: number): Promise<{
    authToken?: string,
    refreshToken?: string,
    error?: string
  }>{
    return new Promise((resolve, reject) => {
      WpUser.switchTo({ user_id: id })
      .then(axios => {
        const resp = axios.data
        // console.log(resp)
        if(resp.success){
          AuthToken.storeToken(resp.data.authToken, null);
          AuthToken.storeRefreshToken(resp.data.refreshToken);
          resolve(resp.data)
        } else {
          reject({ error: resp.data.msg})
        }
      })
      .catch(err => {
        // console.log({err})
        reject({ error: err?.response?.data?.data?.msg || 'Erro ao trocar de usuário.'})
      })
    })
}

 function switchTo(userid: number){
    return fetch(userid)
  }

  return {
    switchTo
  }
}
