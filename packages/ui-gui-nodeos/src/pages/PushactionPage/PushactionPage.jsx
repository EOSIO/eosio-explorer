import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
  Card, CardBody, CardHeader,Row, Col, Form, FormGroup, Label, Button,
  Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Input
} from 'reactstrap';

import { pollingStart, pollingStop, smartContractNameSearch, actionIdSet, updateActionToPush, actionPush } from './PushactionPageReducer';
import { CodeViewer, LoadingSpinner } from 'components';
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
  if(!action.act.account)
    validation.errors.push("Please add an action type");
  if(!action.act.authorization.actor || !action.act.authorization.permission)
    validation.errors.push("Please select a permission");

  if(action.payload) {
    if(!tryParseJSON(action.payload)) {
      console.log("Could not parse Payload JSON.");
      validation.errors.push("Please enter a valid JSON string");
    }
  }

  console.log("Errors: " + JSON.stringify(validation.errors));

  validation.valid = validation.errors.length < 1;
  return validation;
};

const PushactionPage = (props) => {

  useEffect(()=>{
    props.pollingStart();
    return () => { props.pollingStop() }
  }, [])

  const [ validationErrors, setValidationErrors ] = useState([]);
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
              <Form className="form-horizontal">
                { error &&
                  <div className="text-center">
                    <p className="text-danger"><strong>Error(s)</strong></p>
                    <p className="text-danger">{JSON.stringify(error)}</p>
                  </div>
                }
                { validationErrors && ( validationErrors.length > 0 && 
                  <div className="text-center">
                    <p className="text-danger"><strong>Error(s)</strong></p>
                    <p className="text-danger">{JSON.stringify(validationErrors)}</p>
                  </div>
                )}
                <FormGroup row>
                    <Col xs="3">
                      <Label><strong>Smart Contract Name</strong></Label>
                    </Col>
                    <Col xs="9">
                      <Input type="text" id="smartContractName" name="smartContractName" placeholder="Smart Contract Name..."  value={action.act.account}
                      onChange={(e) => { updateAction(e.target.name, action, e.target.value, props.updateActionToPush) } } />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col xs="3">
                      <Label><strong>Action Type</strong></Label>
                    </Col>
                    <Col xs="9">
                      <Input type="text" id="actionType" name="actionType" placeholder="Action Type..." value={action && (action.act && action.act.name)}
                      onChange={(e) => { updateAction(e.target.name, action, e.target.value, props.updateActionToPush); } } />
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
                        }}>
                        { list.map((permission) =>
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
                      <CodeViewer readOnly={false} height="300" value={action.payload}
                        onChange={(newVal) => {
                          updateAction("payload", action, newVal, props.updateActionToPush);
                        }} />
                    </Col>
                  </FormGroup>
                  <FormGroup row className="mb-0">
                    <Col xs="12" className="text-right">
                      <Button onClick={(e) => {
                        let validation = validateAction(action);
                        if(validation.valid) 
                          props.actionPush(action); 
                        else {
                          console.log("Validation Failed");
                          setValidationErrors(validation.errors);
                          console.log(validationErrors);
                        }
                      }} color="primary">Push</Button>
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
                <Actionhistory prefillCallback={(act_id) => { props.actionIdSet(act_id); window.scrollTo(0, 0); } } />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </StandardTemplate>
  );
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
