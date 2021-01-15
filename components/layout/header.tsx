import {User} from "../../src/resources/user";
import Event, {Edition} from '../../src/resources/event'
import Navbar from 'react-bootstrap/cjs/Navbar'
import Nav from "react-bootstrap/cjs/Nav";
import UserMenu from "./user-menu";
import Link from "next/link";
import useTrans from "../hooks/useTrans";
import {useRouter} from "next/router";
import usePendingReview from "../hooks/usePendingReview";
import NotificationPanel from "../notification-panel";

interface HeaderProps {
  event: Event
  user: User
}

export default function Header(props: HeaderProps) {

  const t = useTrans()
  const router = useRouter()
  const {data: pending} = usePendingReview()
  const {user, event} = props
  const edition: Edition = event.currentEdition()

  return (<header className="mainHeader">
    <Navbar expand="lg">
      <div className="d-flex justify-content-between flex-grow-1 flex-lg-grow-0">
        <div className="header-start d-flex align-items-center">
          <div className="brand mr-3">{event.name}</div>
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
          <Link href="/dashboard" passHref><Nav.Link active={router.pathname === '/dashboard'}>{t('eventos')}</Nav.Link></Link>
          {user.canManageAbstracts()
            ? (<>
              <Link href={`/adm/subscriptions?edition=${edition.id}`} passHref><Nav.Link
                active={router.pathname === '/adm/subscriptions'}>Inscrições</Nav.Link></Link>
              <Link href={`/adm/abstracts?edition=${edition.id}`} passHref><Nav.Link
                active={router.pathname === '/adm/abstracts'}>{t('trabalhos')}</Nav.Link></Link>
              <Link href={`/adm/users`} passHref><Nav.Link
                active={router.pathname === '/adm/users'}>Usuários</Nav.Link></Link>
            </>)
            : (<>
              <Link href={`/abstracts?edition=${edition.id}`} passHref><Nav.Link
                active={router.pathname === '/abstracts'}>{t('trabalhos')}</Nav.Link></Link>
            </>)}
          {user.canEvaluateAbstracts() && <>
            <Link href={`/evaluations?edition=${edition.id}`} passHref><Nav.Link
              title={`${pending} aguardando revisão`}
              active={router.pathname === '/evaluations'}>Minhas avaliações
              {pending && <div className="badge badge-warning ml-1">{pending}</div>}
            </Nav.Link></Link>
          </>}
          {user.canPublishAbstracts() && <>
            <Link href={`/profile?tab=subscriptions`} passHref>
              <Nav.Link>{t('minhas-inscricoes')}
            </Nav.Link></Link>
          </>}
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
