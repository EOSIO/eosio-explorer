import React, { useState, useEffect } from 'react';

import { connect } from 'react-redux';

import { Button, ButtonGroup, Col, Form, FormGroup, Input, Label, FormFeedback } from 'reactstrap';
import styled from 'styled-components';

import { connectStart, connectReset, endpointInitState } from 'reducers/endpoint';
import useForm from 'helpers/useForm';
import validate from './NodeswitchValidatorEngine';
import { InputStyled, ButtonPrimary, ButtonSecondary } from 'styled';


const ButtonNow = styled(Button)`
   width: 130px;
    height: 40px;
    border-radius: 2px;
    background-color: #4d9cc3;
    opacity: 1;
    color: #ffffff;
    font-size: 14px;
    font-weight: 500;
`
const CenteredLabel = styled(Label)`
  margin-top: 6px;
`

const Nodeswitch = (props) => {

  const { values, handleChange, handleSubmit, setValues, errors } = useForm(()=>{
    props.connectStart(values.nodeosEndPoint, values.mongodbEndPoint);
  }, validate);

  const [key, setKey] = useState(Date.now());

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
      <Form key={key} onSubmit={ handleSubmit }>
        <FormGroup row className="mb-0">
          <Col xs="3">
            <CenteredLabel htmlFor="nodeosEndPoint">Connected Nodeos:</CenteredLabel>
          </Col>
          <Col xs="9">
            <InputStyled
              type="text"
              id="nodeosEndPoint"
              name="nodeosEndPoint"
              placeholder="Please enter your end point"
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
          <Col xs="3" style={{marginTop: "10px"}}>
            <CenteredLabel htmlFor="mongodbEndPoint">Connected MongoDB:</CenteredLabel>
          </Col>
          <Col xs="9" style={{marginTop: "10px"}}>
            <InputStyled
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
              <ButtonPrimary type="submit" disabled={ !isDirtyForm }>CONNECT</ButtonPrimary>
              <ButtonSecondary
                onClick={()=>{
                  props.connectReset();
                  setValues({nodeosEndPoint: endpointInitState.nodeos, mongodbEndPoint: endpointInitState.mongodb});
                  setKey(Date.now());
                }}
              >RESET</ButtonSecondary>
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
