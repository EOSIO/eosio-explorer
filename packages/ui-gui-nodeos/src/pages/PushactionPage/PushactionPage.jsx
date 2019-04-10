import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
  Card, CardBody, Row, Col, Form, FormGroup, FormFeedback, Label, Input, UncontrolledAlert,
  DropdownToggle, DropdownMenu, DropdownItem, Spinner
} from 'reactstrap';

import { actionIdSet, updateActionToPush, actionPush, fetchStart, fetchSmartContracts } from './PushactionPageReducer';
import { CodeViewer, LoadingSpinner } from 'components';
import useForm from 'helpers/useForm';
import validate from './components/PushActionValidatorEngine/PushActionValidatorEngine';
import { StandardTemplate } from 'templates';
import { defaultSet } from 'reducers/permission';
import Actionhistory from './components/Actionhistory';
import styled from 'styled-components';
import { PageTitleDivStyled, CardStyled,CardHeaderStyled, ButtonPrimary, DropdownStyled, OverlayStyled } from 'styled';

const FirstCardStyled = styled(CardStyled)`
  border-top: solid 2px #1173a4;
`
const CustomDropdown = styled(DropdownStyled)`
  .btn-secondary {
    width: 100%;    
  }  
`

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

  useEffect(() => {
    let vals = [
      { name: "smartContractName", value: action.act.account },
      { name: "actionType", value: action.act.name },
      { name: "payload", value: action.payload },
      { name: "permission", value: selectedPermission._id }
    ];
    updateValues(vals);
  }, [props.pushactionPage.action])

  useEffect(()=>{    
    props.fetchStart();
    props.fetchSmartContracts();
    setAdditionalValues(list);
    updateAction("", action, null, props.updateActionToPush); 
  }, [])

  let { permission: { data }, pushactionPage: { action, isPushingAction, smartContracts: { smartContractsList = [] }, isFetchingSmartContract } } = props;
  let { list, defaultId } = data;  
  
  let selectedPermission = list.find(permission => defaultId === permission._id);
  if(action.act.authorization)
    selectedPermission = list.find(p => p.account === action.act.authorization.actor && p.permission === action.act.authorization.permission) || selectedPermission;
  
  const { handleChange, handleSubmit, updateValues, resetValidation, setAdditionalValues, errors } = useForm(function() { window.scrollTo(0, 0); props.actionPush(action); }, validate);

  const [ isOpenDropDownSmartContract, toggleDropDownSmartContract ] = useState(false);  
  const [ isOpenDropDownActionType, toggleDropDownActionType ] = useState(false);  
  const [ isOpenDropDownPermission, toggleDropDownPermission ] = useState(false);  

  const [ actionList, setActionList ] = useState([]);

  return (
    <StandardTemplate>
      <OverlayStyled display={isPushingAction ? 'block' : 'none'}></OverlayStyled>
      {
        isPushingAction && 
        <div style={{position:"fixed",top:"50%",left:"50%", zIndex:"1000"}}>
            <Spinner color="primary"
                style={{
                    width: "5rem",
                    height: "5rem"
                }}
            />
        </div>
      }
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

              { isFetchingSmartContract ? (
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
                <FormGroup row>
                    <Col xs="3">
                      <Label>Smart Contract Name:</Label>
                    </Col>
                    <Col xs="9">
                      <CustomDropdown isOpen={isOpenDropDownSmartContract} toggle={()=>{toggleDropDownSmartContract(!isOpenDropDownSmartContract)}}>
                        <DropdownToggle caret className={errors.smartContractName && "invalid"}>{action.act.account || "Select Smart Contract"}</DropdownToggle>
                        <DropdownMenu modifiers={{
                            setMaxHeight: {
                              enabled: true,
                              fn: (data) => {
                                return {
                                  ...data,
                                  styles: {
                                    ...data.styles,
                                    overflow: 'auto',
                                    maxHeight: 300,
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
                                  setActionList(smartContract.abi.actions); 
                                  updateAction("smartContractName", action, smartContract.name, props.updateActionToPush); 
                                  updateAction("actionType", action, "", props.updateActionToPush); 
                                  handleChange(e);
                                  resetValidation(e);
                                }}>
                              {smartContract.name}</DropdownItem>)}
                        </DropdownMenu>     
                      </CustomDropdown>
                      
                      {/* Hidden inputs for validation and to make sure validation messages are shown by Bootstrap  */}
                      <Input type="hidden" id="smartContractName" name="smartContractName" value={action.act.account} onChange={(e) => { handleChange(e); } } invalid={!!errors.smartContractName} />
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
                        <DropdownToggle disabled={action.act.account === "" ? true : false}  className={errors.actionType && "invalid"} caret>
                          {action.act.name || "Select Action Type"}
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
                                    maxHeight: 300,
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
                                  updateAction("actionType", action, actionType.name, props.updateActionToPush); 
                                  handleChange(e); 
                                  resetValidation(e);
                                }}>
                              {actionType.name}</DropdownItem>)}
                        </DropdownMenu>     
                      </CustomDropdown>
                      {/* Hidden inputs for validation and to make sure validation messages are shown by Bootstrap  */}
                      <Input type="hidden" id="actionType" name="actionType" value={action.act.name} onChange={(e) => { handleChange(e); } } invalid={!!errors.actionType} />
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
                        <DropdownToggle className={errors.permission && "invalid"} caret>                        
                          {(selectedPermission.account + "@" + selectedPermission.permission)}
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
                                    maxHeight: 300,
                                  },
                                };
                              },
                            },
                          }}>
                          {(list).map((permission)=> permission.private_key &&
                              <DropdownItem 
                                key={permission._id} 
                                onClick={(e) => { 
                                  selectedPermission = list.find(p => p.account === action.act.authorization.actor && p.permission === action.act.authorization.permission) || selectedPermission;
                                  updateAction("permission", action, { actor: permission.account, permission: permission.permission }, props.updateActionToPush);
                                  resetValidation(e);
                                }}>
                              {permission.account}@{permission.permission}</DropdownItem>)}
                        </DropdownMenu>     
                      </CustomDropdown>  
                      {/* Hidden inputs for validation and to make sure validation messages are shown by Bootstrap  */}
                      <Input type="hidden" id="permission" name="permission" value={selectedPermission._id} onChange={(e) => { handleChange(e); } } invalid={!!errors.permission} />
                      {
                        errors.permission && 
                        <FormFeedback invalid="true">
                          {errors.permission}
                        </FormFeedback>
                      }
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
                  props.actionIdSet(action._id);                  
                  setActionList(smartContractsList.find(smartContract => smartContract.name === action.act.account).abi.actions);   
                  resetValidation();
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
    fetchStart,
    actionIdSet,
    updateActionToPush,
    actionPush,
    fetchSmartContracts
  }

)(PushactionPage );
