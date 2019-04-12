import React, { useEffect, useState, useRef } from 'react';
import { DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { DropdownStyled } from 'styled';

const LimitSelectDropdown = (props) => {

  // didMountRef used to prevent onChange being triggered on the first render
  const didMountRef = useRef(false);
  const [isOpen, toggleIsOpen] = useState(false);
  const [count, updateCount] = useState(props.limit || 100);

  useEffect(() => {
    if(didMountRef.current)
      props.onChange(count);
    else
      didMountRef.current = true;
  }, [count]);

  return (
    <div>
      <span className="d-inline-block mr-3 text-muted">Show rows:</span>
      <div className="d-inline-block">
        <DropdownStyled isOpen={isOpen} toggle={() => { toggleIsOpen(!isOpen) }}>
          <DropdownToggle caret>{count}</DropdownToggle>
          <DropdownMenu>
            <DropdownItem onClick={() => { updateCount(10) }}>10</DropdownItem>
            <DropdownItem onClick={() => { updateCount(20) }}>20</DropdownItem>
            <DropdownItem onClick={() => { updateCount(50) }}>50</DropdownItem>
            <DropdownItem onClick={() => { updateCount(100) }}>100</DropdownItem>
          </DropdownMenu>
        </DropdownStyled>
      </div>
    </div>
  )
}

export default LimitSelectDropdown;
