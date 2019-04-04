import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
  Card, CardBody, CardHeader,Row, Col, Form, FormGroup, FormFeedback, Label, Button, Input, UncontrolledAlert
} from 'reactstrap';

import { pollingStart, pollingStop, actionIdSet, updateActionToPush, actionPush } from './PushactionPageReducer';
import { CodeViewer, LoadingSpinner } from 'components';
import useForm from 'helpers/useForm';
import validate from './components/PushActionValidatorEngine/PushActionValidatorEngine';
import { StandardTemplate } from 'templates';
import { defaultSet } from 'reducers/permission';
import Actionhistory from './components/Actionhistory';
import styled from 'styled-components';
import { PageTitleDivStyled, CardStyled,CardHeaderStyled, TableStyled, ButtonPrimary, CheckBoxDivStyled, InputStyled} from 'styled';

const FirstCardStyled = styled(CardStyled)`
  border-top: solid 2px #1173a4;
`
const DropdownInputStyled = styled(Input)`
  background-color: #f8f9fa;
  height: 40px;

  :focus{
    outline: none;
    box-shadow: none;
    border-color: #1173a4;
  }

`

let prevAction = undefined;

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

const PushactionPage = (props) => {

  useEffect(()=>{    
    props.pollingStart();
    return () => { props.pollingStop() }
  }, [])
  
  const [ validationErrors, setValidationErrors ] = useState([]);
  const { handleChange, handleSubmit, updateValues, errors } = useForm(function() { window.scrollTo(0, 0); props.actionPush(action); }, validate);

  let { permission: { isFetching, data }, defaultSet, pushactionPage: { action } } = props;
  let { list, defaultId } = data;
  
  let selectedPermission = list.find(permission => defaultId === permission._id);
  if(action.act.authorization)
    selectedPermission = list.find(p => p.account === action.act.authorization.actor && p.permission === action.act.authorization.permission) || selectedPermission;

  if(action !== prevAction) {
    prevAction = action;

    let vals = [
      { name: "smartContractName", value: action.act.account },
      { name: "actionType", value: action.act.name },
      { name: "payload", value: action.payload }
    ];
    
    updateValues(vals);
  }

  return (
    <StandardTemplate>
      <div className="PushactionPage animated fadeIn">
        <Row>
          <Col sm="12">
            <PageTitleDivStyled>Push Actions Page</PageTitleDivStyled>
          </Col>
        </Row>
        <Row>
          <Col xs="12">
            <FirstCardStyled>
              <CardHeaderStyled>
                Push Action
              </CardHeaderStyled>
              <CardBody>

              { isFetching ? (
                <LoadingSpinner />
              ) : (
              <Form className="form-horizontal" id="pushActionForm" onSubmit={ handleSubmit }>
              {
                  action.pushSuccess &&
                  <UncontrolledAlert color="success">
                    Action pushed successfully
                  </UncontrolledAlert>
                }
                { action.error &&
                <Card className="text-white bg-danger text-center">
                  <CardBody>
                    <p className="mb-1">Error(s)</p>
                    <p className="mb-1">{action.error.error}</p>
                  </CardBody>
                </Card>
                }
                { validationErrors && ( validationErrors.length > 0 && 
                  <Card className="text-white bg-danger text-center">
                    <CardBody>
                      <p className="mb-1">Error(s)</p>
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
                      <Label>Smart Contract Name:</Label>
                    </Col>
                    <Col xs="9">
                      <InputStyled type="text" id="smartContractName" name="smartContractName" placeholder="Smart Contract Name..."
                        value={action.act.account} onChange={(e) => { updateAction(e.target.name, action, e.target.value, props.updateActionToPush); handleChange(e); } } 
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
                      <Label>Action Type:</Label>
                    </Col>
                    <Col xs="9">
                      <InputStyled type="text" id="actionType" name="actionType" placeholder="Action Type..." value={action && (action.act && action.act.name)}
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
                      <Label>Permission:</Label>
                    </Col>
                    <Col xs="9">
                      <DropdownInputStyled type="select" name="permission" id="permission" value={selectedPermission._id}
                        onChange={(e) => { 
                          let newPermission = list.find(p => e.target.value === p._id); 
                          updateAction(e.target.name, action, { actor: newPermission.account, permission: newPermission.permission }, props.updateActionToPush);
                          defaultSet(newPermission._id);
                        }}>
                        { list.map((permission) =>  permission.private_key &&
                          <option key={permission._id} value={permission._id}>{permission.account}@{permission.permission}</option>
                        )}
                      </DropdownInputStyled>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col xs="12">
                      <Label>Payload:</Label>
                    </Col>
                    <Col xs="12">
                      <CodeViewer readOnly={false} height="250" value={action.payload} className={errors.payload && "invalid"}
                        onChange={(newVal) => { updateAction("payload", action, newVal, props.updateActionToPush); }} />
                      <Input type="hidden" id="payload" name="payload" value={action.payload || ""} onChange={(e) => { handleChange(e); } } invalid={!!errors.payload} />
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
                      <ButtonPrimary type="submit">Push</ButtonPrimary>
                    </Col>
                  </FormGroup>
                </Form>
              )}
              </CardBody>
            </FirstCardStyled>
          </Col>
        </Row>
        <Row>
          <Col xs="12">
            <CardStyled>
              <CardHeaderStyled>
                Action History Viewer
              </CardHeaderStyled>
              <CardBody>
                <Actionhistory prefillCallback={(act_id) => { props.actionIdSet(act_id); setValidationErrors([]); window.scrollTo(0, 0); }} />
              </CardBody>
            </CardStyled>
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
    actionIdSet,
    updateActionToPush,
    actionPush
  }

)(PushactionPage);
