import Generic from "./generic";
import useTrans from "../hooks/useTrans";
import Error from "../../src/resources/error";
import {SocialLoginButtonProps} from "./social-buttons.d";
import React from "react";
import Icon from "../ui/ionicon";


export default function Google(props: SocialLoginButtonProps) {

  const t = useTrans()
  const {onFailed, onSuccess} = props

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
    onSuccess(user, 'google')
  }

  function handleSocialLoginFailure(err) {
    const error = Error.make(err, {code: 'google-provider'})
    onFailed(error, 'google')
  }


  return (<>
    <Generic
      provider="google" btnStyle="google"
      appId={process.env.GOOGLE_OAUTH_ID}
      onLoginSuccess={handleSocialLogin}
      onLoginFailure={handleSocialLoginFailure}><Icon name={`logo-google`}/>{t('login-com', {driver: "Google"})}</Generic>
  </>)
}
