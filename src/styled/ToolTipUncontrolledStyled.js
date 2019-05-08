import { UncontrolledTooltip } from 'reactstrap';
import styled from 'styled-components';

export default styled(UncontrolledTooltip)`
  .tooltip-inner{
    background-color: #443f54;
    font-size: 14px;
    font-weight: 500;
    text-align: left;
  }
  
  .arrow:before{
    border-${props => props.placement}-color : #443f54;
  }
`
