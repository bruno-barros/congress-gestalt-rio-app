import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {User} from "../../src/resources/user";
import Event from '../../src/resources/event'
import Navbar from 'react-bootstrap/cjs/Navbar'
import Nav from "react-bootstrap/cjs/Nav";
import NavDropdown from "react-bootstrap/cjs/NavDropdown";
import UserMenu from "./user-menu";
import Link from "next/link";
import useTrans from "../hooks/useTrans";
import {useRouter} from "next/router";

interface HeaderProps {
  event: Event
  user: User
}

export default function Header(props: HeaderProps) {

  const t = useTrans()
  const router = useRouter()
  const {user, event} = props

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
          <Link href="/dashboard" passHref><Nav.Link active={router.pathname ==='/dashboard'}>{t('eventos')}</Nav.Link></Link>
          <Link href="/abstracts" passHref><Nav.Link active={router.pathname ==='/abstracts'}>{t('trabalhos')}</Nav.Link></Link>
          {/*<NavDropdown title="Dropdown" id="basic-nav-dropdown" className="dropdown-on-hover">*/}
          {/*  <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>*/}
          {/*  <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>*/}
          {/*  <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>*/}
          {/*  <NavDropdown.Divider/>*/}
          {/*  <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>*/}
          {/*</NavDropdown>*/}
        </Nav>
      </Navbar.Collapse>
      <div className="d-none d-lg-block">
        <UserMenu user={user}/>
      </div>
    </Navbar>
  </header>)
}
