import { Button } from 'reactstrap';
import styled from 'styled-components';

export default styled(Button)`
  width: 130px;
  height: 40px;
  border-radius: 2px;
  background-color: #bcbcbc;
  opacity: 1;
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
  border: 0;
  padding: 8px 8px 10px 8px;

  :disabled{
    background-color: #bcbcbc;
    opacity: 1;
    color: #ffffff;
  }
  :hover{
    background-color: #9b9b9b;
    color: #ffffff;
    opacity: 1;
  }
  :not(:disabled):not(.disabled):active{
    background-color: #838187;
    opacity: 1;
    color: #ffffff;
  }
`
