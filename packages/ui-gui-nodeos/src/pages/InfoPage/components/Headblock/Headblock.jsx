import React, { useEffect } from 'react';

import { connect } from 'react-redux';

import { pollingStart, pollingStop } from './HeadblockReducer';


const Headblock = (props) => {

  useEffect(()=>{
    props.pollingStart()
    return () => { props.pollingStop() }
  }, [])

  let { headblock: { isFetching, data }} = props;

  return (
    <div className="Headblock">
      <div>{isFetching ? `loading...`: JSON.stringify(data.payload)}</div>
    </div>
  );
}

export default connect(
  ({ infoPage: { headblock }}) => ({
    headblock
  }),
  {
    pollingStart,
    pollingStop
  }

)(Headblock);
