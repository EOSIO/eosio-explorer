import React, { useEffect } from 'react';

import { connect } from 'react-redux';

import { Col, Form, FormGroup, Label, Button } from 'reactstrap';

import { pollingStart } from 'reducers/lastblockinfo';
import { LoadingSpinner } from 'components';


const LastIrreversibleBlockInfo = (props) => {

  let { lastblockinfo: { isFetching, data } } = props;
  let { payload = {}, error } = data;

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
        <Form className="form-horizontal">
          <FormGroup row className="mb-0">
            <Col xs="2">
              <Label>Block Number:</Label>
            </Col>
            <Col xs="10">
              <p className="form-control-static">{payload && payload.last_irreversible_block_num}</p>
            </Col>
          </FormGroup>
          <FormGroup row className="mb-0">
            <Col xs="2">
              <Label>Block ID:</Label>
            </Col>
            <Col xs="10" className="hashText">
              <p className="form-control-static">{payload && payload.last_irreversible_block_id}</p>
            </Col>
          </FormGroup>
      </Form>
      )}
    </>
  );
}

export default connect(
  ({ lastblockinfo }) => ({
    lastblockinfo
  }),
  {
    pollingStart
  }

)(LastIrreversibleBlockInfo);
