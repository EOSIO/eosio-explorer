import React, {useEffect} from 'react';

import { connect } from 'react-redux';

import { Col, Form, FormGroup, Label, Button } from 'reactstrap';

import { fetchStart } from './BlockchainInfoReducer';
import { LoadingSpinner } from 'components';

const BlockchainInfo = (props) => {

  useEffect(()=>{
    props.fetchStart();
  }, [])

  let { blockchainInfo: { isFetching, data }} = props;
  let { payload = {}, error } = data;

  return (
    <>
      { error ?
        <div className="text-center">
          <p className="text-danger">{JSON.stringify(error)}</p>
          <Button color="primary" onClick={props.fetchStart}>Click to Reload</Button>
        </div>
      : isFetching ? (
        <LoadingSpinner />
      ) : (
        <Form className="form-horizontal">
          <FormGroup row className="mb-0">
            <Col xs="2">
              <Label><strong>Server Version</strong></Label>
            </Col>
            <Col xs="10">
              <p className="form-control-static">{payload && payload.server_version}</p>
            </Col>
          </FormGroup>
          <FormGroup row className="mb-0">
            <Col xs="2">
              <Label><strong>Server Version String</strong></Label>
            </Col>
            <Col xs="10">
              <p className="form-control-static">{payload && payload.server_version_string}</p>
            </Col>
          </FormGroup>
          <FormGroup row className="mb-0">
            <Col xs="2">
              <Label><strong>Chain ID</strong></Label>
            </Col>
            <Col xs="10">
              <p className="form-control-static">{payload && payload.chain_id}</p>
            </Col>
          </FormGroup>
      </Form>
      )}
    </>
  );
}

export default connect(
  ({ infoPage: { blockchainInfo }}) => ({
    blockchainInfo
  }),
  {
    fetchStart,
  }

)(BlockchainInfo);
