import React, { useEffect } from 'react';

import { connect } from 'react-redux';

import { Button, Col, Form, FormGroup, Input, Label, FormFeedback } from 'reactstrap';
import styled from 'styled-components';

import { connectStart } from 'reducers/endpoint';
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
          <Col xs="2">
            <CenteredLabel htmlFor="nodeosEndPoint">Connected Nodeos</CenteredLabel>
          </Col>
          <Col xs="4">
            <Input
              type="text"
              id="nodeosEndPoint"
              name="nodeosEndPoint"
              placeholder="Enter nodeos endpoint..."
              value={values.nodeosEndPoint}
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
          <Col xs="2">
            <CenteredLabel htmlFor="mongodbEndPoint">Connected MongoDB</CenteredLabel>
          </Col>
          <Col xs="4">
            <Input
              type="text"
              id="mongodbEndPoint"
              name="mongodbEndPoint"
              placeholder="Enter mongodb endpoint..."
              value={values.mongodbEndPoint}
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
            <Button type="submit" color="primary" size="sm" disabled={ !isDirtyForm }>Connect</Button>
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
    connectStart
  }

)(Nodeswitch);
