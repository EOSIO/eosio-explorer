import React, { useEffect } from 'react';

import { connect } from 'react-redux';

import { fetchStart, paramsSet } from './TransactiondetailReducer';
import pathNameConsumer from 'helpers/pathname-consumer';

const Transactiondetail = (props) => {

  useEffect(()=>{

    let { router: { location: {pathname} } } = props;

    props.paramsSet({id: pathNameConsumer(pathname)});
    props.fetchStart();
  }, [])

  let { transactiondetail: { isFetching, data, params } } = props;
  let { payload, error } = data;

  return (
    <div className="Transactiondetail">
      <div>{ error                  ? <button onClick={props.fetchStart}>{JSON.stringify(error)} Click to Reload.</button>
             : isFetching           ? `loading...`
             : payload.length === 0 ? `No block found with block id = ${params.id}`
                                    : JSON.stringify(payload)}
      </div>
    </div>
  );
}

export default connect(
  ({ transactiondetailPage: { transactiondetail }, router}) => ({
    transactiondetail,
    router
  }),
  {
    fetchStart,
    paramsSet,
  }

)(Transactiondetail);
