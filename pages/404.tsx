import Link from "next/link";

export default function PageNotFound() {

  return (<div className="vh-100 d-flex flex-column align-items-center justify-content-center">

    <img src="/img/logo-h.jpg"  className="-mg-fluid" style={{maxWidth: 250}}/>
    <h2 className="text-muted font-weight-light mt-5 mb-5">Página não encontrada</h2>
    <div className="font-weight-bold ">Que tal <Link href="/login" passHref><a>fazer o login</a></Link>?</div>

  </div>)
}
