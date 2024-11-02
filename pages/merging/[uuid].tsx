import {useRouter} from "next/router";
import Card from "react-bootstrap/cjs/Card";
import {useEffect, useState} from "react";
import Link from "next/link";
import useCurrentUser from "../../components/hooks/useCurrentUser";
import WpUser from "../../src/http/wp-user";
import useTrans from "../../components/hooks/useTrans";
import Head from "next/head";
import {siteTitle} from "../../src/helpers";
import ClearLayout from "../../components/layout/clear";
import Loading from "../../components/ui/loading";
import Icon from "../../components/ui/ionicon";


const Merging = () => {

  const router = useRouter()
  const t = useTrans()
  const {authLoading, user} = useCurrentUser()
  const [status, setStatus] = useState('')
  const [lang, setLang] = useState('pt')

  useEffect(() => {
    console.log(router.query?.uuid);
    // if (!router.query?.uuid) {
    //   router.push('/login')
    //   return;
    // }
    if (router.query.uuid) {
      WpUser.mergeApproved(router.query.uuid)
        .then(resp => {
          if (resp.data.success) {
            setStatus(resp.data.data)
          } else {
            setStatus('error')
          }
        })
    }
    if (router.query?.lang) {
      setLang(String(router.query.lang))
    } else {
      setLang(router.locale)
    }

  }, [router.query])

  return (<ClearLayout ignoreSessionCountDown>
    <Head>
      <title>{siteTitle('Merging')}</title>
    </Head>
    <div className="row">
      <div className="col-12 col-md-10 offset-md-1 col-lg-8 offset-lg-2">
        {status === ''
        && <Card>
          <Card.Body>
            <Loading vspace={40} message={t('aguarde') + '...'}/>
          </Card.Body>
        </Card>}
        {status === 'error'
        && <Card>
          <Card.Body className="text-center">
            {t('cadastro.link-expirou')} {t('por-favor')}, <Link href="/login" locale={lang}
                                                                 passHref><a>{t('cadastro.faca-seu-login')}</a></Link>.
          </Card.Body>
        </Card>}
        {(status.hasOwnProperty('ID'))
        && <Card>
          <Card.Body>
            <div className="d-flex">
              <Icon style={{fontSize: 80}} name={`checkmark-circle-outline`}/>
              <div className="ml-4">
                <p>Contas unificadas com sucesso!</p>
                <p>
                  <Link href="/login" locale={lang} passHref>
                    <a className="btn btn-primary">{t('cadastro.faca-seu-login')}</a>
                  </Link>
                </p>
              </div>
            </div>
          </Card.Body>
        </Card>}
      </div>
    </div>
  </ClearLayout>)
}

export default Merging
