import { Button } from 'reactstrap';
import styled from 'styled-components';

export default styled(Button)`
  width: 130px;
  height: 40px;
  border-radius: 2px;
  background-color: #4d9cc3;
  opacity: 1;
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
  border: 0;
  padding: 8px 8px 10px 8px;

  :disabled{
    background-color: #4d9cc3;
    cursor: not-allowed;
    color: #ffffff;
  }
  :disabled:hover{
    background-color: #4d9cc3;
    opacity: 0.65;
  }
  :hover{
    background-color: #407893;
    opacity: 1;
    color: #ffffff;
  }
  :not(:disabled):not(.disabled):active{
    background-color: #2a4c5d;
    opacity: 1;
    color: #ffffff;
  }
  
`
