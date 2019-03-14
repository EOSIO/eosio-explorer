import React, { useEffect } from 'react';

import { connect } from 'react-redux';

import { dispatchFetchHeadBlockStartPolling, dispatchFetchHeadBlockStopPolling } from './HeadBlockInfoReducer';


const HeadBlockInfo = (props) => {

  useEffect(()=>{
    props.dispatchFetchHeadBlockStartPolling()
    return () => { props.dispatchFetchHeadBlockStopPolling() }
  }, [])

  return (
    <div className="HeadBlockInfo">
      <div>{props.isFetchingHeadBlock ? `loading...`: JSON.stringify(props.headBlockInfoData.payload)}</div>
    </div>
  );
}

export default connect(
  ({ info: { headBlockInfo: { isFetchingHeadBlock, headBlockInfoData} }}) => ({
    headBlockInfoData,
    isFetchingHeadBlock
  }),
  {
    dispatchFetchHeadBlockStartPolling,
    dispatchFetchHeadBlockStopPolling
  }

)(HeadBlockInfo);
