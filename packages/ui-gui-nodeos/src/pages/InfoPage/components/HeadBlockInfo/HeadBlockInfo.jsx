import React, { useEffect } from 'react';

import { connect } from 'react-redux';


const HeadBlockInfo = (props) => {

  useEffect(()=>{
    props.startPolling()
    return () => { props.stopPolling() }
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
  dispatch => ({
    startPolling: () => dispatch({
      type: 'START_POLLING_FETCH_HEADBLOCK'
    }),
    stopPolling: () => dispatch({
      type: 'STOP_POLLING_FETCH_HEADBLOCK'
    }),
  })

)(HeadBlockInfo);
