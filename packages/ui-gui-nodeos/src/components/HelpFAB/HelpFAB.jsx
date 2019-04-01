import React from 'react';
import { Link } from 'react-router-dom';

import './HelpFAB.scss';

function HelpFAB() {
  return (
    <div className="HelpFAB text-center">
      <Link to="//github.com/EOSIO/eosio-toppings/help.md" target="_blank" className="btn btn-pill btn-primary fab" >?</Link>
    </div>
  )
}

export default HelpFAB;
