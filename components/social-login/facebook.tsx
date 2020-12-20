import Generic from "./generic";
import useTrans from "../hooks/use-trans";

export default function Facebook() {

  const t = useTrans()

  function handleSocialLogin(user) {
    /*
    _profile:
      email: "conceito@conceito-online.com.br"
      firstName: "SrLuis"
      id: "1059301927748489"
      lastName: "Monteiro"
      name: "SrLuis Monteiro"
      profilePicURL: "https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=1059301927748489&height=50&width=50&ext=1610757994&hash=AeSZP9D5DvKpYiXtFxc"
    */
    console.log(user);
  }

  function handleSocialLoginFailure(err) {
    console.error(err);
  }

  return (<Generic
    provider="facebook"
    appId="306275963626458"
    onLoginSuccess={handleSocialLogin}
    onLoginFailure={handleSocialLoginFailure}>{t('login-com', {driver: "Facebook"})}</Generic>)
}
