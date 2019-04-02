import React from 'react';

import { connect } from 'react-redux';
import { STATUS_NORMAL, STATUS_STOPPED } from './ConnectionIndicatorReducer'

import styled from 'styled-components';

const StyledWrapper = styled.div`
  position: relative;
  top: -1px;
`

const Indicator = styled.i`
  position: relative;
  top: 1px;
  display: inline-block;
  flex: 0 0 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${props => props.status === STATUS_NORMAL ? "green" : "red"};
`

const StyledDiv = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 5px 0;
`

const StyledInner = styled.div`
  margin-left: 7px;
  min-width: 63px;
`

const StyledName = styled.div`
  font-size: 8px;
  color: #bcbcbc;
  text-align: left;
  line-height: 10px;
`

const StyledBlockNum = styled.div`
  text-align: left;
  line-height: 12px;
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
    <StyledWrapper>
      <StyledDiv>
        <Indicator status={connectionIndicator.status.lastblockinfoStatus}>&nbsp;</Indicator>
        <StyledInner>
          <StyledName>Nodeos</StyledName>
          <StyledBlockNum>{lastblockinfoNum ? lastblockinfoNum : ` - `}</StyledBlockNum>
        </StyledInner>
      </StyledDiv>
      <StyledDiv>
        <Indicator status={connectionIndicator.status.headblockStatus}>&nbsp;</Indicator>
        <StyledInner>
          <StyledName>MongoDB</StyledName>
          <StyledBlockNum>{headblockNum ? headblockNum : ` - `}</StyledBlockNum>
        </StyledInner>
      </StyledDiv>
    </StyledWrapper>
  );
}

export default connect(
  ({ headblock, lastblockinfo, connectionIndicator }) => ({
    headblock, lastblockinfo, connectionIndicator
  }),
  {
  }

)(ConnectionIndicator);
