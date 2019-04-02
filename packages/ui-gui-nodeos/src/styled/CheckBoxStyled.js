import styled from 'styled-components';

export default styled.input`
  -webkit-appearance: none;
  background-color: #f8f9fa;
  border: 1px solid #cacece;
  border-radius: 2px;
  height: 13px;
  width: 13px;
 
  :hover{    
    cursor: pointer;
  }

  :checked {
	background-color: #d5e0eb;	
    color: #99a1a7;
    border: solid 1px #e8ebf0;
  }

  :checked:after {    
	content: '\2714';
	font-size: 14px;
	position: absolute;
	top: 0px;
	left: 3px;
	color: #99a1a7;
  }
  
`
