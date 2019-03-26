import React, { useEffect } from 'react';

import { connect } from 'react-redux';

import { fetchStart, paramsSet } from './ActiondetailReducer';
import pathNameConsumer from 'helpers/pathname-consumer';

const Actiondetail = (props) => {

  useEffect(()=>{

    let { router: { location: {pathname} } } = props;

    props.paramsSet({id: pathNameConsumer(pathname)});
    props.fetchStart();
  }, [])

  let { actiondetail: { isFetching, data, params } } = props;
  let { payload, error } = data;

  return (
    <div className="Actiondetail">
      <div>{ error                  ? <button onClick={props.fetchStart}>{JSON.stringify(error)} Click to Reload.</button>
             : isFetching           ? `loading...`
             : payload.length === 0 ? `No action found with action id = ${params.id}`
                                    : JSON.stringify(payload)}
      </div>
    </div>
  );
}

export default connect(
  ({ actiondetailPage: { actiondetail }, router}) => ({
    actiondetail,
    router
  }),
  {
    fetchStart,
    paramsSet,
  }

)(Actiondetail);
