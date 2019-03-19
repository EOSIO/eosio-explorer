import React, { useEffect } from 'react';

import { connect } from 'react-redux';

import { fetchStart } from './BlockdetailReducer';

const Blockdetail = (props) => {

  useEffect(()=>{
    props.fetchStart();
  }, [])

  let { blockdetail: { isFetching, data } } = props;
  let { payload, error } = data;

  return (
    <div className="Blockdetail">
      <div>{ error          ? <button onClick={props.fetchStart}>{JSON.stringify(error)} Click to Reload.</button>
             : isFetching   ? `loading...`
                            : JSON.stringify(payload)}
      </div>
    </div>
  );
}

export default connect(
  ({ blockdetailPage: { blockdetail }}) => ({
    blockdetail
  }),
  {
    fetchStart,
  }

)(Blockdetail);
