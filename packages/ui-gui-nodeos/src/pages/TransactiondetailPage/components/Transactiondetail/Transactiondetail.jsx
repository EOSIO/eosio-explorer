import React, { useEffect } from 'react';

import { connect } from 'react-redux';

import { fetchStart, paramsSet } from './TransactiondetailReducer';
import pathNameConsumer from 'helpers/pathname-consumer';
import { Card, CardTitle, CardBody, Col, Row, Form, FormGroup} from 'reactstrap';
import styled from 'styled-components';

const Transactiondetail = (props) => {

  useEffect(()=>{
    let { router: { location: {pathname} } } = props;
    props.paramsSet({trx_id: pathNameConsumer(pathname)});
    props.fetchStart();
  }, [])

  let { transactiondetail: { isFetching, data, params } } = props;
  let { payload, error } = data;

  return (
    <div className="Transactiondetail">
      <div>{ error
              ? <button onClick={props.fetchStart}>{JSON.stringify(error)} Click to Reload.</button>
              : isFetching           
                ? `loading...`
                : payload.length === 0 
                  ? `No block found with block id = ${params.trx_id}`
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
