import React, { Component } from 'react';

import { connect } from 'react-redux';

import { fetchHeadBlock, fetchHeadBlockFulfilled, fetchHeadBlockRejected } from './HeadBlockInfoReducer';

class HeadBlockInfo extends Component {

  componentDidMount() {
    this.props.startPolling()
  }

  componentWillUnmount() {
    this.props.stopPolling();
  }

  render() {

    return (
      <div className="HeadBlockInfo">
        <button onClick={()=>{
          this.props.fetchHeadBlock()
        }}>Refresh Block!</button>
        <div>{this.props.isFetchingHeadBlock ? `loading...`: JSON.stringify(this.props.headBlockInfoData.payload)}</div>
      </div>
    );
  }
}

export default connect(
  ({ info: { headBlockInfo: { isFetchingHeadBlock, headBlockInfoData} }}) => ({
    headBlockInfoData,
    isFetchingHeadBlock
  }),
  dispatch => ({
    fetchHeadBlock: () => dispatch(fetchHeadBlock()),
    fetchHeadBlockFulfilled: (payload) => dispatch(fetchHeadBlockFulfilled(payload)),
    fetchHeadBlockRejected: (payload) => dispatch(fetchHeadBlockRejected(payload)),
    startPolling: () => dispatch({
      type: 'START_POLLING_FETCH_HEADBLOCK'
    }),
    stopPolling: () => dispatch({
      type: 'STOP_POLLING_FETCH_HEADBLOCK'
    }),
  })

)(HeadBlockInfo);
