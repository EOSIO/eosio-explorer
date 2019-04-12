import React from 'react';
const BoxMiniSocial = ({
  src = "",
  iconClass = ""
}) =>
  <a href={src} target="_blank"  rel="noopener noreferrer">
    <div className="BoxMiniSocial">
      <i className={iconClass}></i>
    </div>
  </a>


export default BoxMiniSocial;
