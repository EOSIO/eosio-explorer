import React, { useEffect } from 'react';
import {
  Form, FormGroup, Label, Button, Col, CardBody
} from 'reactstrap';

import { connect } from 'react-redux';
import { fetchStart, accountImport, defaultSet } from 'reducers/permission';
import { panelSelect } from 'pages/PermissionPage/PermissionPageReducer';
import styled from 'styled-components';
import { RadioButtonDivStyled, CardStyled, CardHeaderStyled, ButtonPrimary, InputStyled} from 'styled';

const InfoDiv = styled.div`
  color: #181c1e;
  background-color: #d5d7d8;
  border-color: #c5c6c8;
  padding: 20px;  
  margin-bottom: 20px;
  border-radius: 3px;
`
const Permissionlist = (props) => {

  useEffect(()=>{
    props.fetchStart()
  }, [])

  let { 
    permission: { isFetching, data, account }, 
    panel, panelSelect, defaultSet 
  } = props;
  let { list, defaultId } = data;

  function getKeysData (accName, list) {
    const keysData = list.filter(acct => acct["account"] === accName);
    props.accountImport(keysData);
    panelSelect("import-account");
  }

  return (
    <div className="Permissionlist">
      <div>{ isFetching   ? `loading...`
                          : <div>
                              <CardStyled>
                                <CardHeaderStyled>
                                  Default Signature Account
                                </CardHeaderStyled>
                                <CardBody>
                                  <InfoDiv>Instruction goes here </InfoDiv>
                                  <Form>
                                    <FormGroup>
                                      {                                    
                                        list.map((permission) => 
                                          (
                                            permission.private_key &&                                         
                                            <FormGroup key={permission._id+'_editable'} row>
                                              
                                              <Label check htmlFor={permission._id} sm={7}>
                                                <span>{permission.account}@{permission.permission}</span>
                                              </Label>
                                              <Col sm={3}>
                                                <ButtonPrimary 
                                                  onClick={() => getKeysData(permission.account, list)}
                                                  block
                                                  >
                                                  Edit
                                                </ButtonPrimary>
                                              </Col>
                                              <Col sm={2}>
                                                <RadioButtonDivStyled>
                                                  <label className="radioContainer">
                                                    <input name={permission._id}
                                                      type="radio"
                                                      checked={permission._id === defaultId ? true : false}
                                                      onClick={() => defaultSet(permission._id)}
                                                      readOnly />
                                                    <span className="checkmark"></span>
                                                  </label>
                                                </RadioButtonDivStyled>
                                              </Col>
                                          </FormGroup>
                                          )
                                      )}
                                    </FormGroup>
                                  </Form>
                                </CardBody>
                              </CardStyled>
                               
                                
                                <CardStyled>
                                  <CardHeaderStyled>Import Account</CardHeaderStyled>
                                  <CardBody>
                                  <Form>
                                  <FormGroup>
                                    {                                    
                                      list.map(permission => 
                                        (
                                          !permission.private_key &&                                         
                                          <FormGroup key={permission._id+'_importable'} row>
                                            <Label check htmlFor={permission._id} sm={7}>
                                              <span>{permission.account}@{permission.permission}</span>
                                            </Label>
                                            <Col sm={3}>
                                              <ButtonPrimary 
                                                onClick={() => getKeysData(permission.account, list)}
                                                block
                                                >
                                                Import keys
                                              </ButtonPrimary>
                                            </Col>
                                            <Col sm={2}>

                                            </Col>
                                        </FormGroup>
                                        )
                                    )}
                                  </FormGroup>
                                </Form>                   
                                  </CardBody>
                                </CardStyled>
                                
                              </div>
              }
      </div>
    </div>
  );
}

export default connect(
  ({ permission, permissionPage: { panel }}) => ({
    permission, panel
  }),
  {
    fetchStart,
    defaultSet,
    accountImport,
    panelSelect
  }
)(Permissionlist);
