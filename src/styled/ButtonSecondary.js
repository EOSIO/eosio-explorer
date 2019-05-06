import { Button } from 'reactstrap';
import styled from 'styled-components';

export default styled(Button)`
  width: 130px;
  height: 40px;
  border-radius: 2px;
  background-color: #667d9a;
  opacity: 1;
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
  border: 0;
  padding: 8px 8px 10px 8px;
  text-transform: uppercase;

  :disabled{
    background-color: #a4a4a4;
    opacity: 1;
    color: #ffffff;
  }
  :hover{
    background-color: #435a77;
    color: #ffffff;
    opacity: 1;
  }
  :not(:disabled):not(.disabled):active{
    background-color: #667d9a;
    opacity: 1;
    color: #ffffff;
  }
`
