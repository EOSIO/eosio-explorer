import React from 'react';

import { connect } from 'react-redux';

import { Col, Form, FormGroup, Label } from 'reactstrap';

import isObjectEmpty from 'helpers/is-object-empty';
import { pollingStart } from 'reducers/lastblockinfo';
import { LoadingSpinner } from 'components';
import { ErrorButton } from 'styled';

const LastIrreversibleBlockInfo = (props) => {

  let { lastblockinfo: { isFetching, data } } = props;
  let { payload = {}, error } = data;
  
  return (
    <>
      { error ?
        <>
          {!isObjectEmpty(error) && <p className="text-danger">{JSON.stringify(error)}</p>}
          <ErrorButton onClick={props.pollingStart}>Connection error, click to reload</ErrorButton>
        </>
      : isFetching ? (
        <LoadingSpinner />
      ) : (
        <Form className="form-horizontal">
          <FormGroup row className="mb-0">
            <Col xs="2">
              <Label>Block Number:</Label>
            </Col>
            <Col xs="10" className="hashText">
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
