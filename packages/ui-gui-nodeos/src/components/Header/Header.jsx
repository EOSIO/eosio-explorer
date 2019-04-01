import './Header.scss';

import React from 'react';
import { Link } from 'react-router-dom';
import { Nav, NavItem } from 'reactstrap';
import { AppNavbarBrand } from '@coreui/react';

import ConnectionIndicator from './components/ConnectionIndicator';

const Header = () =>

  <div className="Header">

    <>
      <AppNavbarBrand
          full={{ src: "https://cdn-images-1.medium.com/max/900/1*zkkZqd1_ShN9rRqBG_Wu3A@2x.png", width: 70, height: 56, alt: 'Nodeos GUI' }}
        />
      <Nav className="nav-items d-md-down-none" navbar>
        <NavItem className="px-3">
          <Link to="/" className="nav-link" >INFO</Link>
        </NavItem>
        <NavItem className="px-3">
          <Link to="/block-list" className="nav-link">BLOCK</Link>
        </NavItem>
        <NavItem className="px-3">
          <Link to="/transaction-list" className="nav-link">TRANSACTION</Link>
        </NavItem>
        <NavItem className="px-3">
          <Link to="/action-list" className="nav-link">ACTION</Link>
        </NavItem>
        <NavItem className="px-3">
          <Link to="/account" className="nav-link">ACCOUNT</Link>
        </NavItem>
        <NavItem className="px-3">
          <Link to="/contract" className="nav-link">SMART CONTRACT</Link>
        </NavItem>
        <NavItem className="px-3">
          <Link to="/permission" className="nav-link">PERMISSION</Link>
        </NavItem>
        <NavItem className="px-3">
          <Link to="/deploy" className="nav-link">DEPLOYMENT</Link>
        </NavItem>
        <NavItem className="px-3">
          <Link to="/push-action" className="nav-link">PUSH ACTION</Link>
        </NavItem>
        <NavItem className="px-3">
          <ConnectionIndicator/>
        </NavItem>
      </Nav>
    </>

  </div>

export default Header;
