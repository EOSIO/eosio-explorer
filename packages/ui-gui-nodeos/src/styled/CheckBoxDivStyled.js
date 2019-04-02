import styled from 'styled-components';

export default styled.div`
  margin-top: 11px;
  .checkboxContainer {    
    position: relative;
    padding-left: 25px;
    cursor: pointer;    
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .checkboxContainer input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }

  .checkmark {
    position: absolute;
    top: 4px;
    left: 0;
    height: 13px;
    width: 13px;
    background-color: #f8f9fa;
    border: 1px solid #cacece;
    border-radius: 2px;
  }

  .checkboxContainer:hover input ~ .checkmark {
    background-color: #ccc;
  }

  .checkboxContainer input:checked ~ .checkmark {
    background-color: #d5e0eb;
  }
  
  .checkmark:after {
    content: "";
    position: absolute;
    display: none;
  }

  .checkboxContainer input:checked ~ .checkmark:after {
    display: block;
  }

  .checkboxContainer .checkmark:after {
    left: 3px;
    width: 5px;
    height: 10px;
    border: solid #838187;
    border-width: 0 3px 3px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
  }
  
`
