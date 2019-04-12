import React from 'react';

import { connect } from 'react-redux';

import { Col, Form, FormGroup, Label } from 'reactstrap';

import { pollingStart } from 'reducers/headblock';
import { LoadingSpinner } from 'components';
import styled from 'styled-components';
import { ButtonSecondary} from 'styled';
const CustomErrorButton = styled(ButtonSecondary)`
  width: auto;
`
const Headblock = (props) => {

  // useEffect(()=>{
  //   return () => { props.pollingStop() }
  // }, [])

  let { headblock: { isFetching, data }} = props;
  let { payload : [{block_num, block_id, block}={}]= [], error } = data;

  return (
    <>
      { error ?
        <CustomErrorButton onClick={props.pollingStart}>Connection error, click to reload</CustomErrorButton>
      : isFetching ? (
        <LoadingSpinner />
      ) : (
        <Form className="form-horizontal">
          <FormGroup row className="mb-0">
            <Col xs="2">
              <Label>Block Number:</Label>
            </Col>
            <Col xs="10" >
              <p className="form-control-static">{block_num}</p>
            </Col>
          </FormGroup>
          <FormGroup row className="mb-0">
            <Col xs="2">
              <Label>Block ID:</Label>
            </Col>
            <Col xs="10" className="hashText">
              <p className="form-control-static">{block_id}</p>
            </Col>
          </FormGroup>
          <FormGroup row className="mb-0">
            <Col xs="2">
              <Label>Timestamp:</Label>
            </Col>
            <Col xs="10">
              <p className="form-control-static">{block && block.timestamp}</p>
            </Col>
          </FormGroup>
          <FormGroup row className="mb-0">
            <Col xs="2">
              <Label>Block Producer:</Label>
            </Col>
            <Col xs="10">
              <p className="form-control-static">{block && block.producer}</p>
            </Col>
          </FormGroup>
      </Form>
      )}
    </>
  );
}

export default connect(
  ({ headblock }) => ({
    headblock
  }),
  {
    pollingStart
  }

)(Headblock);
