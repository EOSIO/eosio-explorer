import { Input } from 'reactstrap';
import styled from 'styled-components';

export default styled(Input)`
  height: 40px;
  border-radius: 2px;
  border: solid 1px #e8ebf0;
  background-color: #f8f9fa;
  font-size: 14px;

  :focus{   
    font-weight: 500;
    border: solid 1px #1173a4;
    box-shadow: none;
  }
  :disabled{
    background-color: #f8f9fa;
  }
`
