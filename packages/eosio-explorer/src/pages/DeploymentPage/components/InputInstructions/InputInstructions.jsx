import React, { Component } from 'react';
import {
  CardBody
} from 'reactstrap';
import { CardStyled } from 'styled';
import styled from 'styled-components';

const CardStyledNoBorder = styled(CardStyled)`
  border-top: solid 1px #e5e5e5;
`

const OrderedList = styled.ol`
  padding-left: 40px;
  counter-reset: my-counter;
  list-style: none;

  li {
    margin-top: 1.5rem;
    counter-increment: my-counter;
    position: relative;    
  }
  li:before {
    content: counter(my-counter)". ";    
    position: absolute;
    left: -30px;
  }
`
class InputInstructions extends Component {

  render() {
    return (
      <CardStyledNoBorder>
        <CardBody>
          <strong>Entry Point File Upload Instructions:</strong>
          <OrderedList>
            <li>
              Drag and drop (or browse for it) the chosen entry file to the grey area
            </li>
            <li>
              Double check your source code file and dependencies
            </li>
            <li>
              <b>Enter the absolute folder path containing this file</b> into the field indicated as
              "Root Folder Path". This path will be saved locally for future use. All files in this root folder
              will be used as part of the compilation process.
            </li>
            <li>
              <b>Optional Step 2</b>: Generate your ABI file first by clicking "Generate ABI". The result of
              compilation will appear in the code viewer. View the ABI / Deployment Log for any warnings
              or errors. You may also choose to import an ABI file by clicking "Import ABI" instead.
            </li>
            <li>
              Go to Step 3, deploy. If you're sure your contract works, you can deploy to the Nodeos instance you are
              currently connected to by clicking on Deploy after selecting the permission you want
              to deploy the contract as. <b>Note: You cannot deploy as 'eosio' since 'eosio' owns the system contract.</b>
            </li>
          </OrderedList>
        </CardBody>
      </CardStyledNoBorder>
    )
  }

}

export default InputInstructions;
