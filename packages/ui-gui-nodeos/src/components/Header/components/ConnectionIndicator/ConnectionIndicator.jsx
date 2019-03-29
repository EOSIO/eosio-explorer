import React from 'react';

import { connect } from 'react-redux';
import { STATUS_NORMAL, STATUS_STOPPED } from './ConnectionIndicatorReducer'

import styled from 'styled-components';

const Indicator = styled.i`
  display: inline-block;
  height: 10px;
  width: 10px;
  border-radius: 50%;
  background-color: ${props => props.status === STATUS_NORMAL ? "green" : "red"};
`
const StyledDiv = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const ConnectionIndicator = (props) => {

  let { headblock:
        { data: headblockData },
        lastblockinfo:
        { data: lastblockinfoData },
        connectionIndicator
      } = props;

  let { payload : [{block_num: headblockNum }={}]= [] } = headblockData;
  let { payload : {head_block_num: lastblockinfoNum }= {} } = lastblockinfoData;

  return (
    <div style={{ width: "130px"}}>
      <StyledDiv><div>{`Nodeos: ${lastblockinfoNum ? lastblockinfoNum : ` - `}`}</div><Indicator status={connectionIndicator.status.lastblockinfoStatus}>&nbsp;</Indicator></StyledDiv>
      <StyledDiv><div>{`MongoDB: ${headblockNum ? headblockNum : ` - `}`}</div><Indicator status={connectionIndicator.status.headblockStatus}>&nbsp;</Indicator></StyledDiv>
    </div>
  );
}

export default connect(
  ({ headblock, lastblockinfo, connectionIndicator }) => ({
    headblock, lastblockinfo, connectionIndicator
  }),
  {
  }

)(ConnectionIndicator);
