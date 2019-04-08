import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
  Card, CardBody, CardHeader,Row, Col, Form, FormGroup, FormFeedback, Label, Button, Input, UncontrolledAlert,
  DropdownToggle, DropdownMenu, DropdownItem
} from 'reactstrap';

import { pollingStart, pollingStop, actionIdSet, updateActionToPush, actionPush, fetchSmartContracts } from './PushactionPageReducer';
import { CodeViewer, LoadingSpinner } from 'components';
import useForm from 'helpers/useForm';
import validate from './components/PushActionValidatorEngine/PushActionValidatorEngine';
import { StandardTemplate } from 'templates';
import { defaultSet } from 'reducers/permission';
import Actionhistory from './components/Actionhistory';
import styled from 'styled-components';
import { PageTitleDivStyled, CardStyled,CardHeaderStyled, ButtonPrimary, InputStyled, DropdownStyled } from 'styled';

const FirstCardStyled = styled(CardStyled)`
  border-top: solid 2px #1173a4;
`

const CustomDropdown = styled(DropdownStyled)`
  .btn-secondary {
    width: 100%;    
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
    props.fetchSmartContracts();
    return () => { props.pollingStop() }
  }, [])

  let { permission: { isFetching, data }, defaultSet, pushactionPage: { action, smartContracts: { smartContractsList = [] } } } = props;
  let { list, defaultId } = data;  
  
  let selectedPermission = list.find(permission => defaultId === permission._id);
  if(action.act.authorization)
    selectedPermission = list.find(p => p.account === action.act.authorization.actor && p.permission === action.act.authorization.permission) || selectedPermission;
  
  const [ validationErrors, setValidationErrors ] = useState([]);
  const { handleChange, handleSubmit, updateValues, errors } = useForm(function() { window.scrollTo(0, 0); props.actionPush(action); }, validate);
  const [ dropDownSelctedValueSmartContract, setSelectedValueSmartContract ] = useState("Select Smart Contract");
  const [ isOpenDropDownSmartContract, toggleDropDownSmartContract ] = useState(false);  
  const [ dropDownSelctedValueActionType, setSelectedValueActionType ] = useState("Select Action Type");
  const [ isOpenDropDownActionType, toggleDropDownActionType ] = useState(false);  
  const [ dropDownSelctedValuePermission, setSelectedValuePermission ] = useState(selectedPermission.account + "@" + selectedPermission.permission);
  const [ isOpenDropDownPermission, toggleDropDownPermission ] = useState(false);  
  const [ actionList, setActionList ] = useState([]);

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
                      <CustomDropdown isOpen={isOpenDropDownSmartContract} toggle={()=>{toggleDropDownSmartContract(!isOpenDropDownSmartContract)}}>
                        <DropdownToggle caret className={errors.smartContractName && "invalid"}>{dropDownSelctedValueSmartContract}</DropdownToggle>
                        <DropdownMenu modifiers={{
                            setMaxHeight: {
                              enabled: true,
                              fn: (data) => {
                                return {
                                  ...data,
                                  styles: {
                                    ...data.styles,
                                    overflow: 'auto',
                                    maxHeight: 250,
                                  },
                                };
                              },
                            },
                          }}>
                          {smartContractsList &&
                            (smartContractsList).map((smartContract)=>
                              <DropdownItem 
                                key={smartContract._id} 
                                onClick={(e) => { 
                                  setSelectedValueSmartContract(smartContract.name);
                                  setActionList(smartContract.abi.actions); 
                                  updateAction("smartContractName", action, smartContract.name, props.updateActionToPush); 
                                  handleChange(e);
                                }}>
                              {smartContract.name}</DropdownItem>)}
                        </DropdownMenu>     
                      </CustomDropdown>
                      {/* Hidden inputs for validation and to make sure validation messages are shown by Bootstrap  */}
                      <Input type="hidden" id="smartContractName" name="smartContractName" value={dropDownSelctedValueSmartContract} onChange={(e) => { handleChange(e); } } invalid={!!errors.smartContractName} />
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
                      <CustomDropdown isOpen={isOpenDropDownActionType} toggle={()=>{toggleDropDownActionType(!isOpenDropDownActionType)}} >
                        <DropdownToggle disabled={dropDownSelctedValueSmartContract === "Select Smart Contract" ? true : false}  className={errors.actionType && "invalid"} caret>
                          {dropDownSelctedValueActionType}
                        </DropdownToggle>
                        <DropdownMenu modifiers={{
                            setMaxHeight: {
                              enabled: true,
                              fn: (data) => {
                                return {
                                  ...data,
                                  styles: {
                                    ...data.styles,
                                    overflow: 'auto',
                                    maxHeight: 250,
                                  },
                                };
                              },
                            },
                          }}>
                          { actionList.length > 0 &&
                            (actionList).map((actionType)=>
                              <DropdownItem 
                                key={actionType.name} 
                                onClick={(e) => {
                                  setSelectedValueActionType(actionType.name);
                                  updateAction("actionType", action, actionType.name, props.updateActionToPush); 
                                  handleChange(e); 
                                }}>
                              {actionType.name}</DropdownItem>)}
                        </DropdownMenu>     
                      </CustomDropdown>
                      {/* Hidden inputs for validation and to make sure validation messages are shown by Bootstrap  */}
                      <Input type="hidden" id="actionType" name="actionType" value={dropDownSelctedValueActionType} onChange={(e) => { handleChange(e); } } invalid={!!errors.actionType} />
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
                      <CustomDropdown isOpen={isOpenDropDownPermission} toggle={()=>{toggleDropDownPermission(!isOpenDropDownPermission)}}>
                        <DropdownToggle caret>{dropDownSelctedValuePermission}</DropdownToggle>
                        <DropdownMenu modifiers={{
                            setMaxHeight: {
                              enabled: true,
                              fn: (data) => {
                                return {
                                  ...data,
                                  styles: {
                                    ...data.styles,
                                    overflow: 'auto',
                                    maxHeight: 250,
                                  },
                                };
                              },
                            },
                          }}>
                          {(list).map((permission)=> permission.private_key &&
                              <DropdownItem 
                                key={permission._id} 
                                onClick={(e) => { 
                                  updateAction("permission", action, { actor: permission.account, permission: permission.permission }, props.updateActionToPush);
                                  setSelectedValuePermission(permission.account + "@" + permission.permission);
                                  defaultSet(permission._id);
                                }}>
                              {permission.account}@{permission.permission}</DropdownItem>)}
                        </DropdownMenu>     
                      </CustomDropdown>  
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
                <Actionhistory prefillCallback={(action) => { 
                  props.actionIdSet(action.receipt.global_sequence); 
                  setSelectedValueSmartContract(action.act.account);
                  setActionList(smartContractsList.find(smartContract => smartContract.name === action.act.account).abi.actions);                
                  setSelectedValueActionType(action.act.name);
                  setValidationErrors([]); 
                  window.scrollTo(0, 0);
                }} />
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
    actionPush,
    fetchSmartContracts
  }

)(PushactionPage );
