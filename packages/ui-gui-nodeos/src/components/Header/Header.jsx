import './Header.scss';

import React from 'react';
import { Link } from 'react-router-dom';
import { Nav, NavItem } from 'reactstrap';
import { AppNavbarBrand} from '@coreui/react';

const Header = () =>

  <div className="Header">

    <>
      <AppNavbarBrand
          full={{ src: null, width: 89, height: 25, alt: 'Nodeos GUI' }}
          minimized={{ src: null, width: 30, height: 30, alt: 'Nodeos GUI' }}
        />
      <Nav className="d-md-down-none" navbar>
        <NavItem className="px-3">
          <Link to="/" className="nav-link" >Info</Link>
        </NavItem>
        <NavItem className="px-3">
          <Link to="/block-list" className="nav-link">Block</Link>
        </NavItem>
        <NavItem className="px-3">
          <Link to="/transaction-list" className="nav-link">Transaction</Link>
        </NavItem>
        <NavItem className="px-3">
          <Link to="/action-list" className="nav-link">Action</Link>
        </NavItem>
        <NavItem className="px-3">
          <Link to="/account" className="nav-link">Account</Link>
        </NavItem>
        <NavItem className="px-3">
          <Link to="/contract" className="nav-link">Smart Contract</Link>
        </NavItem>
        <NavItem className="px-3">
          <Link to="/permission" className="nav-link">Permission</Link>
        </NavItem>
        <NavItem className="px-3">
          <Link to="/deploy" className="nav-link">Deploy</Link>
        </NavItem>
        <NavItem className="px-3">
          <Link to="/push-action" className="nav-link">Push Action</Link>
        </NavItem>
      </Nav>
    </>

  </div>

export default Header;
