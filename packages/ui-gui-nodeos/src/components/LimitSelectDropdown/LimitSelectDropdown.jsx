import React, { useEffect, useState, useRef } from 'react';
import { DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { DropdownStyled } from 'styled';

const LimitSelectDropdown = (props) => {

  // didMountRef used to prevent onChange being triggered on the first render
  const didMountRef = useRef(false);
  const [isOpen, toggleIsOpen] = useState(false);
  const [count, updateCount] = useState(props.limit || 10);

  useEffect(() => {
    if(didMountRef.current)
      props.onChange(count);
    else
      didMountRef.current = true;
  }, [count]);

  return (
    <DropdownStyled isOpen={isOpen} toggle={() => { toggleIsOpen(!isOpen) }}>
      <DropdownToggle caret>{count}</DropdownToggle>
      <DropdownMenu>
        <DropdownItem onClick={() => { updateCount(10) }}>10</DropdownItem>
        <DropdownItem onClick={() => { updateCount(20) }}>20</DropdownItem>
        <DropdownItem onClick={() => { updateCount(50) }}>50</DropdownItem>
        <DropdownItem onClick={() => { updateCount(100) }}>100</DropdownItem>
      </DropdownMenu>
    </DropdownStyled>
  )
}

export default LimitSelectDropdown;
