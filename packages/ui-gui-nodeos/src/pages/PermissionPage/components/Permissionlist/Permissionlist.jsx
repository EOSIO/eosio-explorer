import React, { useEffect } from 'react';
import {
  Form, FormGroup, Label, Button, Col
} from 'reactstrap';

import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { fetchStart, accountImport, defaultSet } from 'reducers/permission';
import { panelSelect } from 'pages/PermissionPage/PermissionPageReducer';

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
                                <h3>
                                  <u>Default Signature Account</u>
                                </h3>
                                <Form>
                                  <FormGroup>
                                    {                                    
                                      list.map((permission) => 
                                        (
                                          permission.private_key &&                                         
                                          <FormGroup key={permission._id+'_editable'} row>
                                            <Label check htmlFor={permission._id} sm={8}>
                                              <span>{permission.account}@{permission.permission}</span>
                                            </Label>
                                            <Col sm={2}>
                                              <Button outline 
                                                color="primary" 
                                                onClick={() => getKeysData(permission.account, list)}
                                                block
                                                >
                                                Edit
                                              </Button>
                                            </Col>
                                            <Col sm={2}>
                                              <input type="radio" 
                                                  name={permission._id}
                                                  style={{
                                                    WebkitAppearance: 'radio'
                                                  }}
                                                  checked={permission._id === defaultId ? true : false}
                                                  onClick={() => defaultSet(permission._id)}
                                                  readOnly
                                                  />
                                              </Col>
                                        </FormGroup>
                                        )
                                    )}
                                  </FormGroup>
                                </Form>
                                <hr />
                                <Form>
                                  <FormGroup>
                                    {                                    
                                      list.map(permission => 
                                        (
                                          !permission.private_key &&                                         
                                          <FormGroup key={permission._id+'_importable'} row>
                                            <Label check htmlFor={permission._id} sm={8}>
                                              <span>{permission.account}@{permission.permission}</span>
                                            </Label>
                                            <Col sm={2}>
                                              <Button outline 
                                                color="primary" 
                                                onClick={() => getKeysData(permission.account, list)}
                                                block
                                                >
                                                Import
                                              </Button>
                                            </Col>
                                            <Col sm={2}>

                                            </Col>
                                        </FormGroup>
                                        )
                                    )}
                                  </FormGroup>
                                </Form>
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
