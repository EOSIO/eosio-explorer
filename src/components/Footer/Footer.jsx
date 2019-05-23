import './Footer.scss';
import React from 'react'

function Footer() {
  return (
    <>
      <span>v{process.env.REACT_APP_VERSION}</span> 
      <span className="ml-auto"><a target="_blank" rel="noopener noreferrer" href="https://block.one/privacy-policy/">Privacy Policy</a></span>
    </>
  )
}

export default Footer
