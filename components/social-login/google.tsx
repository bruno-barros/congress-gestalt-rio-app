import Generic from "./generic";
import useTrans from "../hooks/use-trans";

export default function Google() {

  const t = useTrans()

  function handleSocialLogin(user) {
  /*
  _profile:
      email: "brunodanca@gmail.com"
      firstName: "Bruno"
      gender: undefined
      id: "117243100433288172506"
      lastName: "Barros"
      name: "Bruno Barros"
      profilePicURL: "https://lh3.googleusercontent.com/a-/AOh14GjxzCc0WyltBFAzA8JKHAfna9Lz6ngHvgbCmASSng=s96-c"
   */
    console.log(user);
  }

  function handleSocialLoginFailure(err) {
    console.error(err);
  }

  return (<Generic
    provider="google"
    appId="264083566287-vfip1cdofp7lm56vn63le77aes3uicf4.apps.googleusercontent.com"
    onLoginSuccess={handleSocialLogin}
    onLoginFailure={handleSocialLoginFailure}>{t('login-com', {driver: "Google"})}</Generic>)
}
