import React, { useState, useEffect } from 'react';

import { connect } from 'react-redux';

import { Col, Form, FormGroup, UncontrolledTooltip, Label, FormFeedback } from 'reactstrap';
import BasicModal from 'components/BasicModal';
import styled from 'styled-components';

import { connectSwitch, connectReset, pathInitState, errorReset } from 'reducers/endpoint';
import useForm from 'helpers/useForm';
import { useToggle } from 'helpers/useToggle';
import validate from './NodeswitchValidatorEngine';
import { InputStyled, ButtonGroupSeperated, ButtonPrimary, ButtonSecondary } from 'styled';
import { accountClear } from 'reducers/permission';

const CenteredLabel = styled(Label)`
  margin-top: 6px;
`

const Nodeswitch = (props) => {

  const { values, handleChange, setValues, errors } = useForm(()=>{
    props.errorReset();
    props.accountClear();
    props.connectStart(values.nodeos, values.mongodb);
  }, validate);

  const [key, setKey] = useState(Date.now());
  const [connectModal, toggleConnectModal] = useToggle(false);
  const [resetModal, toggleResetModal] = useToggle(false);

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
      <Form key={key}>
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
            <ButtonGroupSeperated className="float-right">
              <ButtonPrimary
                disabled={ !isDirtyForm }
                onClick={()=>toggleConnectModal(true)}
                >
                CONNECT
              </ButtonPrimary>
              <ButtonSecondary
                id="ResetCxn"
                onClick={()=>toggleResetModal(true)}
              >RESET</ButtonSecondary>
            </ButtonGroupSeperated>
            <UncontrolledTooltip placement="top" target="ResetCxn"
                delay={{show: 0, hide: 0}}
                trigger="hover"
                autohide={true}
                >
                Clicking this button will reset the input endpoints for both Nodeos and MongoDB
                URLs to the default ones.
            </UncontrolledTooltip>
          </Col>
        </FormGroup>
      </Form>
      {
        connectModal && (
          <BasicModal header="Confirmation to Connect to New Nodeos"
            toggle={toggleConnectModal}
            open={connectModal}
            handleConfirm={()=>{
              toggleConnectModal(false); 
              props.errorReset();
              props.connectSwitch(values.nodeos, values.mongodb);
            }}
            >
            Are you sure you want to connect to the new Nodeos instance at {values.nodeos}? 
            You will <b>permanently</b> lose all private keys stored in your local storage. 
            <b> Please ensure that your Connected MongoDB endpoint matches the new Nodeos instance
              or you will encounter account and permission issues.
            </b>
          </BasicModal>
        )
      }
      {
        resetModal && (
          <BasicModal header="Confirmation to Reset Nodeos Connection"
            toggle={toggleResetModal}
            open={resetModal}
            handleConfirm={() => {
              toggleResetModal(false);
              props.errorReset();
              props.connectReset();
              setValues(pathInitState);
              setKey(Date.now());
              props.accountClear();
            }}
            >
            Are you sure you want to restart the Nodeos connection to its initial state? 
            You will <b>permanently</b> lose all private keys stored in your local storage. 
          </BasicModal>
        )
      }
    </div>
  );
}

export default connect(
  ({ endpoint }) => ({
    endpoint
  }),
  {
    connectSwitch,
    connectReset,
    errorReset,
    accountClear
  }

)(Nodeswitch);
