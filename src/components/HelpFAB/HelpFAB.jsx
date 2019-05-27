import React from 'react';
import { Link, withRouter } from 'react-router-dom';

import './HelpFAB.scss';

const getPath = (pathname) => pathname.split("/")[1];

const getUrl = (pageName) =>{
  switch(pageName){
    case 'block-list':
      return "//github.com/EOSIO/eosio-explorer/tree/master/docs/pages/block-list-page.md";         
    case 'block':
      return "//github.com/EOSIO/eosio-explorer/blob/master/docs/pages/detail-pages/block-detail-page.md";
    case 'transaction-list':
      return "//github.com/EOSIO/eosio-explorer/blob/master/docs/pages/transaction-list-page.md";
    case 'transaction':
      return "//github.com/EOSIO/eosio-explorer/blob/master/docs/pages/detail-pages/transaction-detail-page.md";  
    case 'action-list':
      return "//github.com/EOSIO/eosio-explorer/blob/master/docs/pages/action-list-page.md"; 
    case 'action':
      return "//github.com/EOSIO/eosio-explorer/blob/master/docs/pages/detail-pages/action-detail-page.md";
    case 'account':
      return "//github.com/EOSIO/eosio-explorer/blob/master/docs/pages/detail-pages/account-detail-page.md";
    case 'contract':
      return "//github.com/EOSIO/eosio-explorer/blob/master/docs/pages/detail-pages/smart-contract-detail-page.md";
    case 'permission':
      return "//github.com/EOSIO/eosio-explorer/blob/master/docs/pages/interact/manage-accounts-page.md";  
    case 'deploy':
      return "//github.com/EOSIO/eosio-explorer/blob/master/docs/pages/interact/deployment-page.md";  
    case 'push-action':
      return "//github.com/EOSIO/eosio-explorer/blob/master/docs/pages/interact/push-action-page.md";
    default: 
      return "//github.com/EOSIO/eosio-explorer/tree/master/docs";
  }
}

const HelpFAB = (props) => {

  const redirectToGithub = (e) => {
    e.preventDefault();
    let pageName = getPath(props.location.pathname);
    window.open(getUrl(pageName), '_blank');
  }

  return (
    <div className="HelpFAB">
      <Link to="" onClick={(e) => redirectToGithub(e)} className="btn btn-pill btn-primary fab">
        <i className="material-icons md-fab">help</i>
      </Link>
    </div>
  )
}

export default withRouter(HelpFAB);
