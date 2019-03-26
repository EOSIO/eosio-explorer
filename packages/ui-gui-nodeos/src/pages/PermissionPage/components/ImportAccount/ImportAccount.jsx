import React, { useEffect } from 'react';
import {
    Button, Form, FormGroup, Label, Input, FormFeedback, FormText,
    Spinner, Col
  } from 'reactstrap';

import { connect } from 'react-redux';

import { importStart } from './ImportAccountReducer';
import useForm from 'helpers/useForm';

const ImportAccount = (props) => {

    const { values, handleChange, handleSubmit, errors } = useForm(importAccount, null);

    let {
        permission: {
            account: {
                keysData
            }
        },
        importAccount: {
            importKeys
        }
    } = props;
    let { isSubmitting, origState, submitError } = importKeys;

    function importAccount() {
        console.log("OK!");
    }

    return (
        <div className="ImportAccount">
            <div>
                <>
                    <h3>
                        <u>Import/Edit Account</u>
                    </h3>
                    <Form onSubmit={
                        handleSubmit
                    }>
                        <FormGroup row>
                            <Label htmlFor="accountName" sm={2}>Account Name</Label>
                            <Col sm={10}>
                                <Input type="text"
                                    name="accountName"
                                    id="accountName"
                                    value={keysData[0].account}
                                    readOnly
                                    />
                            </Col>
                        </FormGroup>
                        <h4>Owner</h4>
                        <FormGroup row>
                            <Label htmlFor="ownerPublic" sm={2}>Public Key</Label>
                            <Col sm={10}>
                                <Input type="text"
                                name="ownerPublic"
                                id="ownerPublic"
                                value={
                                    keysData[0].permission === "owner" ? 
                                        keysData[0].public_key
                                        : keysData[1].public_key
                                }
                                onInput={handleChange}
                                readOnly
                                />
                            </Col> 
                        </FormGroup>
                        <FormGroup row>
                            <Label htmlFor="ownerPrivate" sm={2}>Private Key</Label>
                            <Col sm={10}>
                                <Input type="text"
                                    name="ownerPrivate"
                                    id="ownerPrivate"
                                    value={
                                        keysData[0].permission === "owner" ? 
                                            keysData[0].private_key
                                            : keysData[1].private_key
                                    }
                                    onInput={handleChange}
                                    />
                            </Col>
                        </FormGroup>
                        <h4>Active</h4>
                        <FormGroup row>
                            <Label htmlFor="activePublic" sm={2}>Public Key</Label>
                            <Col sm={10}>
                                <Input type="text"
                                    name="activePublic"
                                    id="activePublic"
                                    value={
                                        keysData[1].permission === "active" ? 
                                            keysData[1].public_key
                                            : keysData[0].public_key
                                    }
                                    onInput={handleChange}
                                    readOnly
                                />
                            </Col> 
                        </FormGroup>
                        <FormGroup row>
                            <Label htmlFor="activePrivate" sm={2}>Private Key</Label>
                            <Col sm={10}>
                                <Input type="text"
                                    name="activePrivate"
                                    id="activePrivate"
                                    value={
                                        keysData[1].permission === "active" ? 
                                            keysData[1].private_key
                                            : keysData[0].private_key
                                    }
                                    onInput={handleChange}
                                    />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Col sm={8}></Col>
                            <Col sm={4} clearfix="true">
                                <Button className="float-right" 
                                color="primary" 
                                disabled={!(values.activePrivate && values.ownerPrivate) || isSubmitting}
                                block
                                >
                                Submit
                                </Button>
                            </Col>
                        </FormGroup>
                    </Form>
                </>
            </div>
        </div>
    )

}

export default connect(
    ({ permission, permissionPage: { importAccount } }) => ({
        permission, importAccount
    }),
    {
        importStart
    }
)(ImportAccount);