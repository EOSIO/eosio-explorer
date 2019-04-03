import React, { useState, useEffect } from 'react';

import { connect } from 'react-redux';

import { Button, ButtonGroup, Col, Form, FormGroup, Input, Label, FormFeedback } from 'reactstrap';
import styled from 'styled-components';

import { connectStart, connectReset, pathInitState, errorReset } from 'reducers/endpoint';
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
    props.errorReset();
    props.connectStart(values.nodeos, values.mongodb);
  }, validate);

  const [key, setKey] = useState(Date.now());

  let { endpoint: { path : { nodeos, mongodb }, error: mongodb_endpoint_error}} = props;

  useEffect(()=>{
    setValues({
      nodeos, mongodb,
    })
    return () => { }
  }, [])

  const isDirtyForm = nodeos !== values.nodeos || mongodb !== values.mongodb;

  return (
    <div className="Nodeswitch">
      <Form key={key} onSubmit={ handleSubmit }>
        <FormGroup row className="mb-0">
          <Col xs="3">
            <CenteredLabel htmlFor="nodeos">Connected Nodeos:</CenteredLabel>
          </Col>
          <Col xs="9">
            <InputStyled
              type="text"
              id="nodeos"
              name="nodeos"
              placeholder="Please enter your end point"
              defaultValue={values.nodeos}
              onChange={handleChange}
              invalid={!!errors.nodeos}
              />
              {
                errors.nodeos &&
                <FormFeedback invalid="true">
                  {errors.nodeos}
                </FormFeedback>
              }
          </Col>
          <Col xs="3" style={{marginTop: "10px"}}>
            <CenteredLabel htmlFor="mongodb">Connected MongoDB</CenteredLabel>
          </Col>
          <Col xs="9" style={{marginTop: "10px"}}>
            <InputStyled
              type="text"
              id="mongodb"
              name="mongodb"
              placeholder="Enter mongodb endpoint..."
              defaultValue={values.mongodb}
              onChange={handleChange}
              invalid={!!errors.mongodb || !!mongodb_endpoint_error}
            />
            {
              (errors.mongodb || mongodb_endpoint_error) &&
              <FormFeedback invalid="true">
                { errors.mongodb || mongodb_endpoint_error}
              </FormFeedback>
            }
          </Col>
          <Col xs="12" className="text-right mt-3">
            <ButtonGroup className="float-right">
              <ButtonPrimary type="submit" disabled={ !isDirtyForm }>CONNECT</ButtonPrimary>
              <ButtonSecondary
                onClick={()=>{
                  props.errorReset();
                  props.connectReset();
                  setValues(pathInitState);
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
    connectReset,
    errorReset
  }

)(Nodeswitch);
