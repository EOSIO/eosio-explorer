import React from 'react';
import { Link } from 'react-router-dom';

import './HelpFAB.scss';

function HelpFAB() {
  return (
    <div className="HelpFAB">
      <Link to="//github.com/EOSIO/eosio-toppings/blob/develop/help.md" target="_blank" className="btn btn-pill btn-primary fab">
        <i className="material-icons md-fab">help</i>
      </Link>
    </div>
  )
}

export default HelpFAB;
