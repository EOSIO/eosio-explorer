import { Button } from 'reactstrap';
import styled from 'styled-components';

export default styled(Button)`
  width: 130px;
  height: 40px;
  border-radius: 2px;
  background-color: #443f54;
  opacity: 1;
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
  border: 0;
  padding: 8px 8px 10px 8px;

  :disabled{
    background-color: #a4a4a4;
    cursor: not-allowed;
    color: #ffffff;
  }
  :disabled:hover{
    background-color: #a4a4a4;
    opacity: 0.65;
  }
  :hover{
    background-color: #201c2c;
    opacity: 1;
    color: #ffffff;
  }
  :not(:disabled):not(.disabled):active{
    background-color: #201c2c;
    opacity: 1;
    color: #ffffff;
  }
  
`
