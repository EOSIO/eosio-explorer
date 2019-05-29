import React, { useState } from 'react';
// import { Tooltip } from 'reactstrap';
import { ToolTipStyled } from 'styled';

const BasicTooltip = (props) => {

  const [isOpen, toggleOpen] = useState(false);

  return (
    <ToolTipStyled placement={props.placement || "top"} target={props.target}
        isOpen={isOpen}
        toggle={() => toggleOpen(!isOpen)}
        delay={{show: 0, hide: 0}}
        trigger="hover focus"
        autohide={true}>
        {props.text}
    </ToolTipStyled>
  )
}

export default BasicTooltip;
