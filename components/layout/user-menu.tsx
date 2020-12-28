import React from "react";
import Avatar from 'react-avatar';
import Dropdown from "react-bootstrap/cjs/Dropdown";
import {User} from "../../src/resources/user";

const CustomToggle = React.forwardRef<any, any>(({ children, onClick }, ref) => (
  <button type="button" className="btn py-0 d-flex align-items-center" ref={ref}
       onClick={(e) => {
         e.preventDefault();
         onClick(e);
       }}>
    {children}{` `}&nbsp;&nbsp;&#x25bc;
  </button>));
export default function UserMenu({user}: {user: User}) {



  return (<Dropdown className="dropdown-on-hover">
      <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
        <Avatar name={user.getUserData().name} size="40" round src={user.getAvatarUrl()} />
        <div className="ml-2">{user.getFirstName()}</div>
      </Dropdown.Toggle>

      <Dropdown.Menu alignRight>
        <Dropdown.Item eventKey="1">Dados pessoais</Dropdown.Item>
        <Dropdown.Item eventKey="2">Minhas inscrições</Dropdown.Item>
        <Dropdown.Item eventKey="1">Sair</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>)

}
