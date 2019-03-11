import React, { Component } from 'react';

import { connect } from 'react-redux';

import { fetchHeadBlock, fetchHeadBlockFulfilled, fetchHeadBlockRejected } from './HeadBlockInfoReducer';

class HeadBlockInfo extends Component {

  render() {

    return (
      <div className="HeadBlockInfo">
        <button onClick={()=>{this.props.fetchHeadBlock()}}>Click!</button>
        <div>{this.props.isFetchingHeadBlock?`true`:`false`}</div>
        <button onClick={()=>{this.props.fetchHeadBlockFulfilled({'a':1})}}>Click!</button>
        <div>{JSON.stringify(this.props.headBlockInfoData.payload)}</div>
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
  })

)(HeadBlockInfo);
