import React, { useEffect } from 'react';

import { connect } from 'react-redux';

import { fetchStart, paramsSet } from './BlockdetailReducer';
import pathNameConsumer from 'helpers/pathname-consumer';

const Blockdetail = (props) => {

  useEffect(()=>{

    let { router: { location: {pathname} } } = props;

    props.paramsSet({id_or_num: pathNameConsumer(pathname)});
    props.fetchStart();
  }, [])

  let { blockdetail: { isFetching, data, params } } = props;
  let { payload, error } = data;

  return (
    <div className="Blockdetail">
      <div>{ error                  ? <button onClick={props.fetchStart}>{JSON.stringify(error)} Click to Reload.</button>
             : isFetching           ? `loading...`
             : payload.length === 0 ? `No block found with block id = ${params.id_or_num}`
                                    : JSON.stringify(payload)}
      </div>
    </div>
  );
}

export default connect(
  ({ blockdetailPage: { blockdetail }, router}) => ({
    blockdetail,
    router
  }),
  {
    fetchStart,
    paramsSet,
  }

)(Blockdetail);
