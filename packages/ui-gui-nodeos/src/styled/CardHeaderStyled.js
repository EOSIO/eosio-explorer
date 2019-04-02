import { CardHeader } from 'reactstrap';
import styled from 'styled-components';

export default styled(CardHeader)`
  height: 40px;
  border-bottom: solid 1px #e5e5e5;
  background-color: #d5e0eb;
  padding: 8px 20px;
  font-size: 14px;
  font-weight: bold;
  border-radius: 0;
  :first-child{
    border-radius: 0;
  }
`
