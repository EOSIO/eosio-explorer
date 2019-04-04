import './Header.scss';

import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {  Nav, NavItem } from 'reactstrap';
import { AppNavbarBrand } from '@coreui/react';
import styled from 'styled-components';

import ConnectionIndicator from './components/ConnectionIndicator';

const EosioLogoSmallSVG = ({className}) =>
  <svg {...{className}} width="42px" height="48px" viewBox="0 0 42 48" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g transform="translate(-2610.000000, -1236.000000)" fill="#443F54" fillRule="nonzero">
            <g transform="translate(2610.000000, 1236.000000)">
                <path d="M16.1,0 L4.8,15.5 L0,38.3 L16.1,48 L32.2,38.3 L27.4,15.4 L16.1,0 Z M7.4,15.9 L16.1,4 L24.8,15.9 L16.1,42 L7.4,15.9 Z M26,19.8 L29.6,37.2 L17.8,44.3 L26,19.8 Z M2.6,37.2 L6.2,19.8 L14.4,44.3 L2.6,37.2 Z" id="Shape"></path>
                <polygon id="Shape" points="35.4 44.6 34.2 44.6 34.2 44.3 36.9 44.3 36.9 44.6 35.7 44.6 35.7 48 35.4 48"></polygon>
                <polygon id="Shape" points="41 44.7 39.6 48 39.5 48 38.2 44.7 38.2 48 37.9 48 37.9 44.3 38.4 44.3 39.6 47.3 40.8 44.3 41.3 44.3 41.3 48 41 48"></polygon>
            </g>
        </g>
    </g>
  </svg>

const StyledEosioLogoSmallSVG = styled(EosioLogoSmallSVG)`
  width: auto;
  height: 48px;
  display: block;
`;

const NavWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 40px;
  padding: 0 10px;
  :nth-child(1){
    flex: 1 1 220px;
    margin-left: -10px;
  }
  :nth-child(3){
    flex: 3.5 3.5 580px;
  }
  :nth-child(5){
    flex: 2 2 360px;
    margin-right: -25px;
  }
`

const NavHead = styled.div`
  text-align: center;
  font-size: 10px;
  color: #bcbcbc;
`

const VerticalLine = styled.div`
  height: 30px;
  width: 1px;
  background-color: #e8ebf0;
`

const LogoWrapper = styled.div`
  display: flex;
`

const AppName = styled.div`
  width: 70px;
  margin-left: 5px;
  margin-top: 4px;
  font-size: 18px;
  line-height: 20px;
`

const WrappedLink = styled(Link)`
  display: flex;
  color: inherit;
  :hover{
    text-decoration: none;
    color: inherit;
  }
`

const Header = (props) => {

  let { router: { location: {pathname} } } = props;

  return (
    <div className="Header">
        <NavWrapper>
          <WrappedLink to={`/`}>
            <Nav className="nav-items d-md-down-none" navbar>
              <LogoWrapper>
                <StyledEosioLogoSmallSVG/>
                <AppName>
                  EOSIO DEV&nbsp;GUI
                </AppName>
              </LogoWrapper>
              <NavItem className="px-3">
                <ConnectionIndicator/>
              </NavItem>
            </Nav>
          </WrappedLink>
        </NavWrapper>
        <VerticalLine>&nbsp;</VerticalLine>
        <NavWrapper>
          <NavHead>INSPECT</NavHead>
          <Nav className="nav-items d-md-down-none" navbar>
            <NavItem className="px-3">
              <Link to={`/`} className={`nav-link ${pathname === `/` ? `active` : ``}`}>INFO</Link>
            </NavItem>
            <NavItem className="px-3">
              <Link to={`/block-list`} className={`nav-link ${pathname === `/block-list` ? `active` : ``}`}>BLOCKS</Link>
            </NavItem>
            <NavItem className="px-3">
              <Link to={`/transaction-list`} className={`nav-link ${pathname === `/transaction-list` ? `active` : ``}`}>TRANSACTIONS</Link>
            </NavItem>
            <NavItem className="px-3">
              <Link to={`/action-list`} className={`nav-link ${pathname === `/action-list` ? `active` : ``}`}>ACTIONS</Link>
            </NavItem>
            <NavItem className="px-3">
              <Link to={`/account`} className={`nav-link ${pathname === `/account` ? `active` : ``}`}>ACCOUNTS</Link>
            </NavItem>
            <NavItem className="px-3">
              <Link to={`/contract`} className={`nav-link ${pathname === `/contract` ? `active` : ``}`}>SMART CONTRACT</Link>
            </NavItem>
          </Nav>
        </NavWrapper>
        <VerticalLine>&nbsp;</VerticalLine>
        <NavWrapper>
          <NavHead>INTERACT</NavHead>
          <Nav className="nav-items d-md-down-none" navbar>
            <NavItem className="px-3">
              <Link to={`/permission`} className={`nav-link ${pathname === `/permission` ? `active` : ``}`}>MANAGE ACCOUNTS</Link>
            </NavItem>
            <NavItem className="px-3">
              <Link to={`/deploy`} className={`nav-link ${pathname === `/deploy` ? `active` : ``}`}>DEPLOY CONTRACTS</Link>
            </NavItem>
            <NavItem className="px-3">
              <Link to={`/push-action`} className={`nav-link ${pathname === `/push-action` ? `active` : ``}`}>PUSH ACTIONS</Link>
            </NavItem>
          </Nav>
        </NavWrapper>
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
