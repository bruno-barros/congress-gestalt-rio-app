import Generic from "./generic";

export default function Facebook() {

  function handleSocialLogin(user) {
    // _profile:
    //   email: "brunodanca@gmail.com"
    // firstName: "Bruno"
    // gender: undefined
    // id: "117243100433288172506"
    // lastName: "Barros"
    // name: "Bruno Barros"
    // profilePicURL: "https://lh3.googleusercontent.com/a-/AOh14GjxzCc0WyltBFAzA8JKHAfna9Lz6ngHvgbCmASSng=s96-c"
    //
    //
    // _token:
    //   accessToken: "ya29.a0AfH6SMBbIxaaQ5E7SUwBR5ELrSA5ZbcIk0u7gmYrkOlWzHwuOD0y1gBBiM6VlQ4fSFOiH6WQ2E7F-g9m98ANk-O7poreBlCuvnbW6zJk5ahOJPyY2cAL5nnGn3EOkf1GDtiwJhec2C5dC5_TY7Q1RRvxeEk1q31DguYCQ7SsAYc"
    // expiresAt: 1608100952531
    // expiresIn: 3599
    // firstIssued_at: 1608097353531
    // idToken: "ey.......TrA"
    // scope: "email profile https://www.googleapis.com/auth/userinfo.email openid https://www.googleapis.com/auth/userinfo.profile"
    console.log(user);
  }

  function handleSocialLoginFailure(err) {
    console.error(err);
  }

  return (<Generic
    provider="facebook"
    appId="306275963626458"
    onLoginSuccess={handleSocialLogin}
    onLoginFailure={handleSocialLoginFailure}>Login com o Facebook</Generic>)
}
