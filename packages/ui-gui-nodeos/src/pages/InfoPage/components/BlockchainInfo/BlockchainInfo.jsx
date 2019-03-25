import React, {useEffect} from 'react';

import { connect } from 'react-redux';

import { Col, Form, FormGroup, Label } from 'reactstrap';

import { fetchStart } from './BlockchainInfoReducer';
import { LoadingSpinner } from 'components';

const BlockchainInfo = (props) => {

  useEffect(()=>{
    props.fetchStart();
  }, [])

  let { blockchainInfo: { isFetching, data }} = props;
  let { error } = data;
  
  return (
    <>
      {isFetching ? (
        <LoadingSpinner />
      ) : (
        <Form className="form-horizontal">
          <FormGroup row className="mb-0">
            <Col xs="2">
              <Label><strong>Server Version</strong></Label>
            </Col>
            <Col xs="10">
              <p className="form-control-static">{data.payload.server_version}</p>
            </Col>
          </FormGroup>
          <FormGroup row className="mb-0">
            <Col xs="2">
              <Label><strong>Server Version String</strong></Label>
            </Col>
            <Col xs="10">
              <p className="form-control-static">{data.payload.server_version_string}</p>
            </Col>
          </FormGroup>
          <FormGroup row className="mb-0">
            <Col xs="2">
              <Label><strong>Chain ID</strong></Label>
            </Col>
            <Col xs="10">
              <p className="form-control-static">{data.payload.chain_id}</p>
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
