import './Header.scss';

import React from 'react';
import { Link } from 'react-router-dom';

const Header = () =>

  <div className="Header">

    <Link to={'/'}>Info Page</Link>
    <Link to={'/block-list'}>Blocklist Page</Link>
  </div>

export default Header;
