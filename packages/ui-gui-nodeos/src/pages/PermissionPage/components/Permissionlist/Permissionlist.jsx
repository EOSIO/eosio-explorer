import React, { useEffect } from 'react';
import {
  Form, FormGroup, Label, Button, Col
} from 'reactstrap';

import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { fetchStart, defaultSet } from 'reducers/permission';


const Permissionlist = (props) => {

  useEffect(()=>{
    props.fetchStart()
  }, [])

  let { permission: { isFetching, data }, defaultSet } = props;
  let { list,defaultId } = data;

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
                                      list.map(permission => 
                                        (
                                          permission.private_key &&                                         
                                          <FormGroup key={permission._id+'_editable'} row>
                                            <Label check htmlFor={permission._id} sm={8}>
                                              <span>{permission.account}@{permission.permission}</span>
                                            </Label>
                                            <Col sm={2}>
                                              <Button outline color="primary" block>Edit</Button>
                                            </Col>
                                            <Col sm={2}>
                                              <input type="radio" 
                                                  name={permission._id}
                                                  style={{
                                                    WebkitAppearance: 'radio'
                                                  }}
                                                  checked={permission._id === defaultId ? true : false}
                                                  onClick={() => defaultSet(permission.id)}
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
                                              <Button outline color="primary" block>Import</Button>
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
  ({ permission }) => ({
    permission
  }),
  {
    fetchStart,
    defaultSet,
  }

)(Permissionlist);
