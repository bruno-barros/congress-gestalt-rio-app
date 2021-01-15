import Link from "next/link";

export default function PageNotFound() {

  return (<div className="vh-100 d-flex flex-column align-items-center justify-content-center">

    <img src="/img/logo-h.jpg"  className="-mg-fluid" style={{maxWidth: 250}}/>
    <div className="text-muted mt-5 mb-4">Página não encontrada</div>
    <div className="font-weight-bold ">Que tal <Link href="/login" passHref><a>fazer o login</a></Link>?</div>

  </div>)
}
