import React from "react";
import Avatar from 'react-avatar';
import Dropdown from "react-bootstrap/cjs/Dropdown";
import {User} from "../../src/resources/user";
import Link from "next/link";
import useTrans from "../hooks/useTrans";

const CustomToggle = React.forwardRef<any, any>(({children, onClick}, ref) => (
  <button type="button" className="btn py-0 d-flex align-items-center" ref={ref}
          onClick={(e) => {
            e.preventDefault();
            onClick(e);
          }}>
    {children}{` `}&nbsp;&nbsp;&#x25bc;
  </button>));
export default function UserMenu({user}: { user: User }) {


  const t = useTrans()

  return (<Dropdown className="dropdown-on-hover">
    <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
      <Avatar name={user.getUserData().name} size="40" round src={user.getAvatarUrl()}/>
      <div className="ml-2">{user.getFirstName()}</div>
    </Dropdown.Toggle>

    <Dropdown.Menu alignRight>
      <Link href={`/profile?tab=personal`} passHref><Dropdown.Item>{t('dados-pessoais')}</Dropdown.Item></Link>
      <Link href={`/profile?tab=subscriptions`} passHref><Dropdown.Item>{t('minhas-inscricoes')}</Dropdown.Item></Link>
      <Link href={`/logout`} passHref><Dropdown.Item>{t('sair')}</Dropdown.Item></Link>
    </Dropdown.Menu>
  </Dropdown>)

}
