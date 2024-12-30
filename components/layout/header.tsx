import {User} from "../../src/resources/user";
import Event from '../../src/resources/event'
import Navbar from 'react-bootstrap/cjs/Navbar'
import Nav from "react-bootstrap/cjs/Nav";
import UserMenu from "./user-menu";
import Link from "next/link";
import useTrans from "../hooks/useTrans";
import {useRouter} from "next/router";
import usePendingReview from "../hooks/usePendingReview";
import NotificationPanel from "../notification-panel";
import { useEffect, useState } from "react";
import Ac from "../access-control";
import { REQUIREMENTS } from "../access-control/requirements";
import useSettings from "../hooks/useSettings";

interface HeaderProps {
  event: Event
  user: User
}

export default function Header(props: HeaderProps) {

  const t = useTrans()
  const router = useRouter()
  const {data: pending} = usePendingReview()
  const {user, event} = props
  const { currentEdition: edition} = useSettings()

  useEffect(()=>{
  }, [router.query])

  return (<header className="mainHeader">
    <style jsx global>{`
      .navbar-nav {
        display: flex;
      }
        .brand .img-fluid {
          border-radius: 5px;
          max-height: 40px;
        }
    `}</style>

    <Navbar expand="lg">
      <div className="d-flex justify-content-between flex-grow-1 flex-lg-grow-0">
        <div className="header-start d-flex align-items-center">
          <div className="brand mr-3">
          {event.logoSecondary && <img src={event.logoSecondary} alt={event.eventName} className="img-fluid" />}            
          </div>
          <div className="menus navbar-light">
            <Navbar.Toggle aria-controls="basic-navbar-nav"/>
          </div>
        </div>
        <div className="header-end">
          <div className="user-menus d-lg-none">
            <UserMenu user={user}/>
          </div>
        </div>
      </div>
      <Navbar.Collapse id="basic-navbar-nav" className="">
        <Nav className="mr-auto">

          <Link href="/dashboard" passHref>
           <Nav.Link active={router.pathname === '/dashboard'}>Home</Nav.Link>
          </Link>
          <Link href="/profile?tab=subscriptions" passHref>
           <Nav.Link>{t('inscricao')}</Nav.Link>
          </Link>
          <Ac requires={[REQUIREMENTS.abstract.submit]}>
            <Link href={`/abstracts?edition=${edition?.getId()}`} passHref><Nav.Link
              active={router.pathname === '/abstracts'}>{t('trabalhos')}</Nav.Link>
            </Link>
            {/* <Link href={`/abstracts?edition=${edition.id}&status=synopsis`} passHref><Nav.Link
              active={router.pathname === '/abstracts' && router.query?.status!=='synopsis'}>{t('trabalho.sinopses')}</Nav.Link>
            </Link> */}
            {/* <Link href={`/abstracts?edition=${edition.id}&status=abstract`} passHref><Nav.Link
              active={router.pathname === '/abstracts' && router.query?.status==='abstract'}>{t('trabalhos')}</Nav.Link>
            </Link> */}
          </Ac>
          <Ac requires={[REQUIREMENTS.abstract.manage]}>
            <Link href={`/adm/subscriptions?edition=${edition?.id}`} passHref><Nav.Link className="admin first"
              active={router.pathname === '/adm/subscriptions'}>Inscrições</Nav.Link></Link>
            <Link href={`/adm/abstracts?edition=${edition?.id}`} passHref><Nav.Link className="admin"
              active={router.pathname === '/adm/abstracts'}>{t('trabalhos')}</Nav.Link></Link>
            <Link href={`/adm/evaluations?edition=${edition?.id}`} passHref><Nav.Link className="admin"
              active={router.pathname === '/adm/evaluations'}>Avaliações</Nav.Link></Link>
            <Link href={`/adm/users`} passHref><Nav.Link className="admin last"
              active={router.pathname === '/adm/users'}>Usuários</Nav.Link></Link>
          </Ac>
          
          
          {user.canEvaluateAbstracts() && <>
            <Link href={`/evaluations?edition=${edition?.id}`} passHref><Nav.Link
              title={`${pending} aguardando revisão`}
              active={router.pathname === '/evaluations'}>Minhas avaliações
              {pending > 0 && <div className="badge badge-warning ml-1">{pending}</div>}
            </Nav.Link></Link>
          </>}
          {/* [*abrisco] {user.canPublishAbstracts() && <>
            <Link href={`/profile?tab=subscriptions`} passHref>
              <Nav.Link>{t('minhas-inscricoes')}
            </Nav.Link></Link>
          </>} */}
          {/*<NavDropdown title="Dropdown" id="basic-nav-dropdown" className="dropdown-on-hover">*/}
          {/*  <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>*/}
          {/*  <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>*/}
          {/*  <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>*/}
          {/*  <NavDropdown.Divider/>*/}
          {/*  <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>*/}
          {/*</NavDropdown>*/}
        </Nav>
      </Navbar.Collapse>
      <div className="d-none d-lg-flex align-items-center">
        <NotificationPanel/>
        <UserMenu user={user}/>
      </div>
    </Navbar>
  </header>)
}
