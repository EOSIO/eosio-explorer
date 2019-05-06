import React, { useEffect, useState, useRef } from 'react';
import { DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { DropdownStyled } from 'styled';
import styled from 'styled-components';

const CutomDropDown = styled(DropdownStyled)`  
  .btn-secondary{
    min-width: 100px;
  }
  .dropdown-menu{
    min-width: 100px;
  }  
  .dropdown-toggle, dropdown-toggle:focus{
    background-color: #fff;
  }
`
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
        <CutomDropDown isOpen={isOpen} toggle={() => { toggleIsOpen(!isOpen) }}>
          <DropdownToggle caret>{count}</DropdownToggle>
          <DropdownMenu>
            <DropdownItem onClick={() => { updateCount(10) }}>10</DropdownItem>
            <DropdownItem onClick={() => { updateCount(20) }}>20</DropdownItem>
            <DropdownItem onClick={() => { updateCount(50) }}>50</DropdownItem>
            <DropdownItem onClick={() => { updateCount(100) }}>100</DropdownItem>
          </DropdownMenu>
        </CutomDropDown>
      </div>
    </div>
  )
}

export default LimitSelectDropdown;
