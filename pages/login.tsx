import Image from "next/image";
import Google from "../components/social-login/google";
import Facebook from "../components/social-login/facebook";

const Login = () => {

  const today = new Date;

  return (<div className="login-wrapper d-flex flex-column">
    <div className="brand-panel">
      <div className="p-4">
      <Image src="/img/logo-h.jpg" width={363} height={91} className="img-fluid"/>
      </div>
    </div>
    <div className="form-panel p-4">

      <p>FORM</p>
      <hr/>
      <Facebook/>
      <Google/>


    </div>
    <div className="footer-panel px-4 py-3 text-center text-xs text-muted">
      Versão {process.env.version} &nbsp; @{today.getFullYear()} <a href="https://conceito-online.com.br??utm_source=app&utm_medium=link&utm_campaign=Sistema_Evento" target="_blank">Conceito</a>
    </div>
  </div>)
}

export default Login
