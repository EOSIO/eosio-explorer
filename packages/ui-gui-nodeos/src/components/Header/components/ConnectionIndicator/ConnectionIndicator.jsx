import React from 'react';

import { connect } from 'react-redux';

import { Col,  Button } from 'reactstrap';

import { LoadingSpinner } from 'components';
import { Link } from 'react-router-dom';


const ConnectionIndicator = (props) => {

  let { headblock: { isFetching, data }} = props;
  let { payload : [{block_num, }={}]= [], error } = data;

  return (
    <>
      { error ?
        <div className="text-center">
          <p className="text-danger">{JSON.stringify(error)}</p>
          <Button color="primary" onClick={props.pollingStart}>Click to Reload</Button>
        </div>
      : isFetching ? (
        <LoadingSpinner />
      ) : (
        <Link  className="nav-link" to="/">{block_num}</Link>
      )}
    </>
  );
}

export default connect(
  ({ headblock }) => ({
    headblock
  }),
  {
  }

)(ConnectionIndicator);
