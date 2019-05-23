import './Footer.scss';
import React from 'react'

function Footer() {
  return (
    <>
      <a target="_blank" rel="noopener noreferrer" href="https://block.one/privacy-policy/">Privacy Policy</a>
      <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
      <a target="_blank" rel="noopener noreferrer" href="https://github.com/EOSIO/eosio-explorer">v{process.env.REACT_APP_VERSION}</a>
    </>
  )
}

export default Footer
