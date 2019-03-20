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
          <Link to="/" className="nav-link" >Info Page</Link>
        </NavItem>
        <NavItem className="px-3">
          <Link to="/block-list" className="nav-link">Blocklist Page</Link>
        </NavItem>
      </Nav>
    </>

  </div>

export default Header;
