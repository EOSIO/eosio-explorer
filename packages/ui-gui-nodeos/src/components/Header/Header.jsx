import './Header.scss';

import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Nav, NavItem } from 'reactstrap';
import { AppNavbarBrand } from '@coreui/react';

import ConnectionIndicator from './components/ConnectionIndicator';

const Header = (props) => {

  let { router: { location: {pathname} } } = props;

  return (
    <div className="Header">
      <>
        <AppNavbarBrand
            full={{ src: "https://cdn-images-1.medium.com/max/900/1*zkkZqd1_ShN9rRqBG_Wu3A@2x.png", width: 70, height: 56, alt: 'Nodeos GUI' }}
          />
        <Nav className="nav-items d-md-down-none" navbar>
          <NavItem className="px-3">
            <Link to={`/`} className={`nav-link ${pathname === `/` ? `active` : ``}`}>INFO</Link>
          </NavItem>
          <NavItem className="px-3">
            <Link to={`/block-list`} className={`nav-link ${pathname === `/block-list` ? `active` : ``}`}>BLOCK</Link>
          </NavItem>
          <NavItem className="px-3">
            <Link to={`/transaction-list`} className={`nav-link ${pathname === `/transaction-list` ? `active` : ``}`}>TRANSACTION</Link>
          </NavItem>
          <NavItem className="px-3">
            <Link to={`/action-list`} className={`nav-link ${pathname === `/action-list` ? `active` : ``}`}>ACTION</Link>
          </NavItem>
          <NavItem className="px-3">
            <Link to={`/account`} className={`nav-link ${pathname === `/account` ? `active` : ``}`}>ACCOUNT</Link>
          </NavItem>
          <NavItem className="px-3">
            <Link to={`/contract`} className={`nav-link ${pathname === `/contract` ? `active` : ``}`}>SMART CONTRACT</Link>
          </NavItem>
          <NavItem className="px-3">
            <Link to={`/permission`} className={`nav-link ${pathname === `/permission` ? `active` : ``}`}>PERMISSION</Link>
          </NavItem>
          <NavItem className="px-3">
            <Link to={`/deploy`} className={`nav-link ${pathname === `/deploy` ? `active` : ``}`}>DEPLOYMENT</Link>
          </NavItem>
          <NavItem className="px-3">
            <Link to={`/push-action`} className={`nav-link ${pathname === `/push-action` ? `active` : ``}`}>PUSH ACTION</Link>
          </NavItem>
          <NavItem className="px-3">
            <ConnectionIndicator/>
          </NavItem>
        </Nav>
      </>

    </div>
  )
}

export default connect(
  ({router}) => ({
    router
  }),
  {
  }

)(Header);
