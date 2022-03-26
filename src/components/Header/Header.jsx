import "./Header.scss";

import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Nav, NavItem } from "reactstrap";
//import { AppNavbarBrand } from '@coreui/react';
import styled from "styled-components";

import { panelSelect } from "pages/PermissionPage/PermissionPageReducer";

import ConnectionIndicator from "./components/ConnectionIndicator";

const EosioLogoSmallSVG = ({ className }) => (
  <svg
    {...{ className }}
    width="42px"
    height="48px"
    viewBox="0 0 42 48"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
  >
    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g
        transform="translate(-2610.000000, -1236.000000)"
        fill="#443F54"
        fillRule="nonzero"
      >
        <g transform="translate(2610.000000, 1236.000000)">
          <path
            d="M16.1,0 L4.8,15.5 L0,38.3 L16.1,48 L32.2,38.3 L27.4,15.4 L16.1,0 Z M7.4,15.9 L16.1,4 L24.8,15.9 L16.1,42 L7.4,15.9 Z M26,19.8 L29.6,37.2 L17.8,44.3 L26,19.8 Z M2.6,37.2 L6.2,19.8 L14.4,44.3 L2.6,37.2 Z"
            id="Shape"
          ></path>
          <polygon
            id="Shape"
            points="35.4 44.6 34.2 44.6 34.2 44.3 36.9 44.3 36.9 44.6 35.7 44.6 35.7 48 35.4 48"
          ></polygon>
          <polygon
            id="Shape"
            points="41 44.7 39.6 48 39.5 48 38.2 44.7 38.2 48 37.9 48 37.9 44.3 38.4 44.3 39.6 47.3 40.8 44.3 41.3 44.3 41.3 48 41 48"
          ></polygon>
        </g>
      </g>
    </g>
  </svg>
);

const StyledEosioLogoSmallSVG = styled(EosioLogoSmallSVG)`
  width: auto;
  height: 48px;
  display: block;
`;

const NavWrapper = styled.div`
  width: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 40px;
  padding: 0 0 0 10px;
  :nth-child(1) {
    flex: 1.5 0 0;
  }
  :nth-child(2) {
    flex: 5 0 0;
    .last-item {
      padding-right: 0 !important;
      flex: none;
    }
    @media screen and (max-width: 1280px) {
      flex: 4 0 0;
    }
    @media screen and (max-width: 1120px) {
      .last-item {
        flex: 0 1 0;
      }
    }
  }
  :nth-child(3) {
    flex: 0.4 1 0;
    padding: 0;
    @media screen and (max-width: 1280px) {
      flex: 0.1 1 0;
    }
  }
  :nth-child(4) {
    flex: 3 0 0;
    .px-3 {
      flex: none;
      padding-right: 0 !important;
    }
    @media screen and (max-width: 1280px) {
      flex: 2.7 0 0;
      .px-3 {
        padding-right: 0 !important;
      }
    }
    @media screen and (max-width: 1120px) {
      flex: 2 0 0;
      .px-3 {
        flex: 0 1 0;
      }
    }
  }
  :nth-child(5) {
    flex: 0.3 0 0;
    @media screen and (max-width: 1280px) {
      padding: 0;
    }
  }
  :nth-child(6) {
    flex: 0.6 0 0;
    padding: 0;
    .px-3 {
      padding-right: 0 !important;
    }
    @media screen and (max-width: 1120px) {
      padding-right: 10px;
      .px-3 {
        padding-right: 1rem !important;
      }
    }
  }
`;

const NavWrapperRow = styled(NavWrapper)`
  flex-direction: row;
  justify-content: space-around;
`;

const NavHead = styled.div`
  font-size: 9px;
  color: #bcbcbc;
  padding-top: 1px;
`;

const VerticalLine = styled.div`
  height: 40px;
  width: 1px;
  margin: auto 0;
  background-color: #e8ebf0;
`;

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const AppName = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-left: 4px;
  line-height: 1;
  color: #443f54;
  font-weight: normal;
  height: 40px;
  font-weight: 500;
  text-align: left;
  > div {
    &:first-child {
      font-size: 11px;
      margin-top: 2.5px;
      sub {
        font-size: 25%;
      }
    }
    &:last-child {
      font-size: 16px;
      margin-bottom: 1.5px;
    }
  }
`;

const WrappedLink = styled(Link)`
  display: flex;
  color: inherit;
  :hover {
    text-decoration: none;
    color: inherit;
  }
`;
const NavStyled = styled(Nav)`
  padding-top: 10px;
`;
const AirWireStyled = styled.img`
  width: 150px;
`;

const matchPath = (pathname, path) => {
  let splitArr = pathname.split("/");
  if (splitArr.find((el) => el === path)) {
    return true;
  } else {
    return false;
  }
};

const Header = (props) => {
  let {
    router: {
      location: { pathname },
    },
    panelSelect,
  } = props;

  return (
    <div className="Header">
      <NavWrapper>
        <WrappedLink to={`/`}>
          <Nav className="nav-items d-md-down-none" navbar>
            <LogoWrapper>
              {(process.env.REACT_APP_API_NETWORK_NAME || "")
                .toLowerCase()
                .includes("airwire") ? (
                <AirWireStyled
                  src="https://ipfs.airwire.io/ipfs/Qmdisktsun8NoXDY5R6mX4B2YyoLn7j4LorXgBxkXee7DP"
                  alt="airwire explorer"
                />
              ) : (
                <>
                  <StyledEosioLogoSmallSVG />
                  <AppName>
                    <div>
                      EOSIO Labs<sub>TM</sub>
                    </div>
                    <div>EOSIO Explorer</div>
                  </AppName>
                </>
              )}
            </LogoWrapper>
          </Nav>
        </WrappedLink>
      </NavWrapper>
      <NavWrapper>
        <NavHead>INSPECT</NavHead>
        <NavStyled className="nav-items d-md-down-none" navbar>
          <NavItem className="px-3">
            <Link
              to={`/`}
              className={`nav-link ${pathname === `/` ? `active` : ``}`}
            >
              INFO
            </Link>
          </NavItem>
          <NavItem className="px-3">
            <Link
              to={`/block-list`}
              className={`nav-link ${
                pathname === `/block-list` ||
                pathname === `/block-list/` ||
                matchPath(pathname, "block")
                  ? `active`
                  : ``
              }`}
            >
              BLOCKS
            </Link>
          </NavItem>
          <NavItem className="px-3">
            <Link
              to={`/transaction-list`}
              className={`nav-link ${
                pathname === `/transaction-list` ||
                pathname === `/transaction-list/` ||
                matchPath(pathname, "transaction")
                  ? `active`
                  : ``
              }`}
            >
              TRANSACTIONS
            </Link>
          </NavItem>
          <NavItem className="px-3">
            <Link
              to={`/action-list`}
              className={`nav-link ${
                pathname === `/action-list` ||
                pathname === `/action-list/` ||
                matchPath(pathname, "action")
                  ? `active`
                  : ``
              }`}
            >
              ACTIONS
            </Link>
          </NavItem>
          <NavItem className="px-3">
            <Link
              to={`/account`}
              className={`nav-link ${
                pathname === `/account` || matchPath(pathname, "account")
                  ? `active`
                  : ``
              }`}
            >
              ACCOUNTS
            </Link>
          </NavItem>
          <NavItem className="px-3 last-item">
            <Link
              to={`/contract`}
              className={`nav-link ${
                pathname === `/contract` || matchPath(pathname, "contract")
                  ? `active`
                  : ``
              }`}
            >
              SMART CONTRACT
            </Link>
          </NavItem>
        </NavStyled>
      </NavWrapper>
      <NavWrapper></NavWrapper>
      <NavWrapper>
        <NavHead>INTERACT</NavHead>
        <NavStyled className="nav-items d-md-down-none" navbar>
          <NavItem className="px-3">
            <Link
              onClick={() => panelSelect("permission-list")}
              to={`/permission`}
              className={`nav-link ${
                pathname === `/permission` || pathname === `/permission/`
                  ? `active`
                  : ``
              }`}
            >
              MANAGE ACCOUNTS
            </Link>
          </NavItem>
          <NavItem className="px-3">
            <Link
              to={`/deploy`}
              className={`nav-link ${
                pathname === `/deploy` || pathname === `/deploy/`
                  ? `active`
                  : ``
              }`}
            >
              DEPLOY CONTRACTS
            </Link>
          </NavItem>
          <NavItem className="px-3">
            <Link
              to={`/push-action`}
              className={`nav-link ${
                pathname === `/push-action` || pathname === `/push-action/`
                  ? `active`
                  : ``
              }`}
            >
              PUSH ACTIONS
            </Link>
          </NavItem>
        </NavStyled>
      </NavWrapper>
      <NavWrapperRow>
        <VerticalLine>&nbsp;</VerticalLine>
      </NavWrapperRow>
      <NavWrapperRow>
        <Nav className="nav-items d-md-down-none" navbar>
          <NavItem className="px-3">
            <ConnectionIndicator />
          </NavItem>
        </Nav>
      </NavWrapperRow>
      <div style={{ display: "none" }}>
        <Link to={`/page-not-found`}></Link>
      </div>
    </div>
  );
};

export default connect(
  ({ router }) => ({
    router,
  }),
  {
    panelSelect,
  }
)(Header);
