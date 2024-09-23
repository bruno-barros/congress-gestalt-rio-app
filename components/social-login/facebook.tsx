import Generic from "./generic";
import useTrans from "../hooks/useTrans";
import {useQueryClient} from "react-query";
import Error from "../../src/resources/error";
import {SocialLoginButtonProps} from "./social-buttons.d";
import React from "react";
import Icon from "../ui/ionicon";

export default function Facebook(props: SocialLoginButtonProps) {

  const t = useTrans()
  const queryClient = useQueryClient()
  const {onFailed, onSuccess} = props

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
    onSuccess(user, 'facebook')
  }

  function handleSocialLoginFailure(err) {
    const error = Error.make(err, {code: 'facebook-provider'})
    onFailed(error, 'facebook')
  }

  return (<Generic
    provider="facebook" btnStyle="facebook"
    appId={process.env.FACEBOOK_OAUTH_ID}
    onLoginSuccess={handleSocialLogin}
    onLoginFailure={handleSocialLoginFailure}><Icon name={`logo-facebook`}/>{t('login-com', {driver: "Facebook"})}</Generic>)
}
