import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
  Card, CardBody, CardHeader,Row, Col, Form, FormGroup, FormFeedback, Label, Button,
  Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Input
} from 'reactstrap';

import { pollingStart, pollingStop, smartContractNameSearch, actionIdSet, updateActionToPush, actionPush } from './PushactionPageReducer';
import { CodeViewer, LoadingSpinner } from 'components';
import useForm from 'helpers/useForm';
import validate from './components/PushActionValidatorEngine/PushActionValidatorEngine';
import { StandardTemplate } from 'templates';
import { defaultSet } from 'reducers/permission';
import Actionhistory from './components/Actionhistory';

const updateAction = (name, action, value, callback) => {
  if (name === "smartContractName") { 
    action.act.account = value;
  } else if(name === "actionType") {
    action.act.name = value;
  } else if(name === "permission") {
    action.act.authorization = value;
  } else if (name === "payload") {
    action.payload = value;
  }
  callback(action);
};

function tryParseJSON (jsonString) {
  try {
      var o = JSON.parse(jsonString);
      if (o && typeof o === "object") {
          return o;
      }
  }
  catch (e) { }

  return false;
};

const validateAction = (action) => {
  let validation = {
    valid: true,
    errors: []
  };
  if(!action.act.account)
    validation.errors.push("Please add a smart contract name");
  if(!action.act.name)
    validation.errors.push("Please add an action type");
  
  if(!tryParseJSON(action.payload)) {
    console.log("Could not parse Payload JSON.");
    validation.errors.push("Please enter a valid JSON string");
  }

  validation.valid = validation.errors.length < 1;
  return validation;
};

const PushactionPage = (props) => {

  useEffect(()=>{
    props.pollingStart();
    return () => { props.pollingStop() }
  }, [])

  const [ validationErrors, setValidationErrors ] = useState([]);
  const { values, handleChange, handleSubmit, errors } = useForm(actionToPush, validate);
  console.log("Errors: " + JSON.stringify(errors));
  
  let { permission: { isFetching, data }, defaultSet, pushactionPage: { data: { actionToPush, error }, action } } = props;
  let { list, defaultId } = data;
  
  let selectedPermission = list.find(permission => defaultId === permission._id);
  if(action.act.authorization)
    selectedPermission = list.find(p => p.account === action.act.authorization.actor && p.permission === action.act.authorization.permission) || selectedPermission;

  return (
    <StandardTemplate>
      <div className="PushactionPage animated fadeIn">
        <Row>
          <Col xs="12">
            <h2 className="pageTitle text-center mb-4">Push Action Page</h2>
          </Col>
        </Row>
        <Row>
          <Col xs="12">
            <Card>
              <CardHeader>
                Push Action
              </CardHeader>
              <CardBody>

              { isFetching ? (
                <LoadingSpinner />
              ) : (
              <Form className="form-horizontal" 
                onSubmit={(e) => { e.preventDefault();
                  let validation = validateAction(action);
                  if(validation.valid) {
                    props.actionPush(action);
                  }
                  else {
                    console.log("Validation Failed");
                    setValidationErrors(validation.errors);
                  }
                  window.scrollTo(0, 0);
                }}
                // onSubmit={ handleSubmit }
              >
                { action.error &&
                <Card className="text-white bg-danger text-center">
                  <CardBody>
                    <p className="mb-1"><strong>Error(s)</strong></p>
                    <p className="mb-1">{action.error.error}</p>
                  </CardBody>
                </Card>
                }
                { validationErrors && ( validationErrors.length > 0 && 
                  <Card className="text-white bg-danger text-center">
                    <CardBody>
                      <p className="mb-1"><strong>Error(s)</strong></p>
                      <ul className="list-unstyled mb-0">
                        {validationErrors.map((error, index) => 
                          <li key={index}>{error}</li>
                        )}
                      </ul>
                    </CardBody>
                  </Card>
                )}
                <FormGroup row>
                    <Col xs="3">
                      <Label><strong>Smart Contract Name</strong></Label>
                    </Col>
                    <Col xs="9">
                      <Input type="text" id="smartContractName" name="smartContractName" placeholder="Smart Contract Name..."
                        value={action.act.account} onChange={(e) => { console.log("Change"); updateAction(e.target.name, action, e.target.value, props.updateActionToPush); handleChange(e); } } 
                        invalid={!!errors.smartContractName}
                        />
                      {
                        errors.smartContractName && 
                        <FormFeedback invalid="true">
                          {errors.smartContractName}
                        </FormFeedback>
                      }
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col xs="3">
                      <Label><strong>Action Type</strong></Label>
                    </Col>
                    <Col xs="9">
                      <Input type="text" id="actionType" name="actionType" placeholder="Action Type..." value={action && (action.act && action.act.name)}
                      onChange={(e) => { updateAction(e.target.name, action, e.target.value, props.updateActionToPush); handleChange(e); } }
                      invalid={!!errors.actionType}
                      />
                      {
                        errors.actionType && 
                        <FormFeedback invalid="true">
                          {errors.actionType}
                        </FormFeedback>
                      }
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col xs="3">
                      <Label><strong>Permission</strong></Label>
                    </Col>
                    <Col xs="9">
                      <Input type="select" name="permission" id="permission" value={selectedPermission._id}
                        onChange={(e) => { 
                          let newPermission = list.find(p => e.target.value === p._id); 
                          updateAction(e.target.name, action, { actor: newPermission.account, permission: newPermission.permission }, props.updateActionToPush);
                          defaultSet(newPermission._id);
                        }}>
                        { list.map((permission) =>  permission.private_key &&
                          <option key={permission._id} value={permission._id}>{permission.account}@{permission.permission}</option>
                        )}
                      </Input>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col xs="12">
                      <Label><strong>Payload</strong></Label>
                    </Col>
                    <Col xs="12">
                    {/* <Input type="text" id="actionType" name="actionType" placeholder="Action Type..." value={action && (action.act && action.act.name)}
                      onChange={(e) => { updateAction(e.target.name, action, e.target.value, props.updateActionToPush); handleChange(e); } }
                      invalid={!!errors.actionType}
                      />
                      {
                        errors.actionType && 
                        <FormFeedback invalid="true">
                          {errors.actionType}
                        </FormFeedback>
                      } */}
                      <CodeViewer readOnly={false} height="300" value={action.payload} className={errors.payload && "invalid"}
                        onChange={(newVal) => { updateAction("payload", action, newVal, props.updateActionToPush); }} />
                      <Input type="text" id="payload" name="payload" value={action.payload || ""} onChange={(e) => { handleChange(e); } } invalid={!!errors.payload} />
                      {
                        errors.payload && 
                        <FormFeedback invalid="true">
                          {errors.payload}
                        </FormFeedback>
                      }
                    </Col>
                  </FormGroup>
                  <FormGroup row className="mb-0">
                    <Col xs="12" className="text-right">
                      <Button type="submit" color="primary">Push</Button>
                    </Col>
                  </FormGroup>
                </Form>
              )}
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col xs="12">
            <Card>
              <CardHeader>
                Action History Viewer
              </CardHeader>
              <CardBody>
                <Actionhistory prefillCallback={(act_id) => { 
                  props.actionIdSet(act_id);
                  
                  // let e = new Event('input', { bubbles: true });
                  // let input = document.querySelector('#smartContractName');

                  // setTimeout(function(){ 
                  //   let val = input.value;
                  //   setNativeValue(input, val);
                  //   input.dispatchEvent(e);
                  // }, 1000);

                  setValidationErrors([]); 
                  window.scrollTo(0, 0); 
                } } />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </StandardTemplate>
  );
}

function setNativeValue(element, value) {
  const valueSetter = Object.getOwnPropertyDescriptor(element, 'value').set;
  const prototype = Object.getPrototypeOf(element);
  const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value').set;
  
  if (valueSetter && valueSetter !== prototypeValueSetter) {
  	prototypeValueSetter.call(element, value);
  } else {
    valueSetter.call(element, value);
  }
}

export default connect(
  ({ permission, pushactionPage }) => ({
    permission,
    pushactionPage
  }),
  {
    defaultSet,
    pollingStart,
    pollingStop,
    smartContractNameSearch,
    actionIdSet,
    updateActionToPush,
    actionPush
  }

)(PushactionPage);
