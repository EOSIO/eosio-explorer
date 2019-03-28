import React, { useEffect } from 'react';

import { connect } from 'react-redux';

import { Button, ButtonGroup, Col, Form, FormGroup, Input, Label, FormFeedback } from 'reactstrap';
import styled from 'styled-components';

import { connectStart, connectReset, endpointInitState } from 'reducers/endpoint';
import useForm from 'helpers/useForm';
import validate from './NodeswitchValidatorEngine';

const CenteredLabel = styled(Label)`
  margin-top: 6px;
`

const Nodeswitch = (props) => {

  const { values, handleChange, handleSubmit, setValues, errors } = useForm(()=>{
    props.connectStart(values.nodeosEndPoint, values.mongodbEndPoint);
  }, validate);

  let { endpoint: { nodeos, mongodb } } = props;


  useEffect(()=>{
    setValues({
      nodeosEndPoint: nodeos,
      mongodbEndPoint: mongodb,
    })
    return () => { }
  }, [])

  const isDirtyForm = nodeos !== values.nodeosEndPoint || mongodb !== values.mongodbEndPoint;

  return (
    <div className="Nodeswitch">
      <Form onSubmit={ handleSubmit }>
        <FormGroup row className="mb-0">
          <Col xs="3">
            <CenteredLabel htmlFor="nodeosEndPoint">Connected Nodeos</CenteredLabel>
          </Col>
          <Col xs="9">
            <Input
              type="text"
              id="nodeosEndPoint"
              name="nodeosEndPoint"
              placeholder="Enter nodeos endpoint..."
              defaultValue={values.nodeosEndPoint}
              onChange={handleChange}
              invalid={!!errors.nodeosEndPoint}
              />
              {
                errors.nodeosEndPoint &&
                <FormFeedback invalid="true">
                  {errors.nodeosEndPoint}
                </FormFeedback>
              }
          </Col>
          <br/>
          <br/>
          <Col xs="3">
            <CenteredLabel htmlFor="mongodbEndPoint">Connected MongoDB</CenteredLabel>
          </Col>
          <Col xs="9">
            <Input
              type="text"
              id="mongodbEndPoint"
              name="mongodbEndPoint"
              placeholder="Enter mongodb endpoint..."
              defaultValue={values.mongodbEndPoint}
              onChange={handleChange}
              invalid={!!errors.mongodbEndPoint}
            />
            {
              errors.mongodbEndPoint &&
              <FormFeedback invalid="true">
                {errors.mongodbEndPoint}
              </FormFeedback>
            }
          </Col>
          <Col xs="12" className="text-right mt-3">
            <ButtonGroup className="float-right">
              <Button type="submit" color="primary" size="sm" disabled={ !isDirtyForm }>Connect</Button>
              <Button
                color="danger"
                onClick={()=>{
                  props.connectReset();
                  setValues({nodeosEndPoint: endpointInitState.nodeos, mongodbEndPoint: endpointInitState.mongodb});
                }}
              >Reset Connections</Button>
            </ButtonGroup>
          </Col>
        </FormGroup>
      </Form>
    </div>
  );
}

export default connect(
  ({ endpoint }) => ({
    endpoint
  }),
  {
    connectStart,
    connectReset
  }

)(Nodeswitch);
