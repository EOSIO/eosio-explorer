import React from 'react';
import {
    Button, Form, FormGroup, Label, Input, FormFeedback,
    Col, Alert, UncontrolledAlert, CardBody
  } from 'reactstrap';

import { connect } from 'react-redux';

import { accountAdd } from 'reducers/permission';
import validate from './ImportAccountValidatorEngine/ImportAccountValidatorEngine';
import useForm from 'helpers/useForm';
import styled from 'styled-components';
import { RadioButtonDivStyled, CardStyled, CardHeaderStyled, ButtonPrimary, InputStyled} from 'styled';

const ImportAccount = (props) => {

    const { values, handleChange, handleSubmit, errors } = useForm(importAccount, validate);

    let {
        permission: {
            data: {
                keysData,
                importSuccess
            }
        },
        accountAdd
    } = props;

    function importAccount() {
        accountAdd({
            accountName: keysData[0].account,
            ownerPrivate: values.ownerPrivate,
            activePrivate: values.activePrivate
        });
    }

    return (
        <div className="ImportAccount">
            <div>
                <>
                    <CardStyled>
                        <CardHeaderStyled>
                            Import/Edit Account
                        </CardHeaderStyled>
                        <CardBody>
                            {
                                importSuccess &&
                                <UncontrolledAlert color="success">
                                    Private keys for {keysData[0].account} successfully updated
                                </UncontrolledAlert>
                            }
                            <Alert color="dark">
                                <h5 className="alert-heading">Before you update your private keys...</h5>
                                <p>
                                    Ensure that the private keys you use are <code>base58 WIF</code> compliant! The form will 
                                    notify you if any of your keys are invalid upon submission.
                                </p>
                                <hr />
                                <p className="mb-0">
                                    Your private keys will be saved locally in your browser. However, please be sure NEVER to share
                                    your private key to anybody. If someone asks you for your private key, please do not give it
                                    to them. Private keys are very sensitive information and should be kept to yourself as much
                                    as possible.
                                </p>
                            </Alert>
                            <Form onSubmit={
                                handleSubmit
                            }>                    
                                <FormGroup row>
                                    <Label htmlFor="accountName" sm={2}>Account Name</Label>
                                    <Col sm={10}>
                                        <InputStyled type="text"
                                            name="accountName"
                                            id="accountName"
                                            defaultValue={keysData[0].account}
                                            readOnly
                                            />
                                    </Col>
                                </FormGroup>
                                <div><b>Owner</b></div>
                                <FormGroup row>
                                    <Label htmlFor="ownerPublic" sm={2}>Public Key</Label>
                                    <Col sm={10}>
                                        <InputStyled type="text"
                                        name="ownerPublic"
                                        id="ownerPublic"
                                        value={
                                            keysData[0].permission === "owner" ? 
                                                keysData[0].public_key
                                                : keysData[1].public_key
                                        }
                                        onChange={handleChange}
                                        readOnly
                                        />
                                    </Col> 
                                </FormGroup>
                                <FormGroup row>
                                    <Label htmlFor="ownerPrivate" sm={2}>Private Key</Label>
                                    <Col sm={10}>
                                        <InputStyled type="text"
                                            name="ownerPrivate"
                                            id="ownerPrivate"
                                            defaultValue={
                                                keysData[0].permission === "owner" ? 
                                                    keysData[0].private_key
                                                    : keysData[1].private_key
                                            }
                                            onChange={handleChange}
                                            invalid={!!errors.ownerPrivate}
                                            required
                                            />
                                        {
                                            errors.ownerPrivate && 
                                            <FormFeedback invalid="true">
                                                {errors.ownerPrivate}
                                            </FormFeedback>
                                        }
                                    </Col>
                                </FormGroup>
                                <div><b>Active</b></div>
                                <FormGroup row>
                                    <Label htmlFor="activePublic" sm={2}>Public Key</Label>
                                    <Col sm={10}>
                                        <InputStyled type="text"
                                            name="activePublic"
                                            id="activePublic"
                                            value={
                                                keysData[1].permission === "active" ? 
                                                    keysData[1].public_key
                                                    : keysData[0].public_key
                                            }
                                            onChange={handleChange}
                                            readOnly
                                        />
                                    </Col> 
                                </FormGroup>
                                <FormGroup row>
                                    <Label htmlFor="activePrivate" sm={2}>Private Key</Label>
                                    <Col sm={10}>
                                        <InputStyled type="text"
                                            name="activePrivate"
                                            id="activePrivate"
                                            defaultValue={
                                                keysData[1].permission === "active" ? 
                                                    keysData[1].private_key
                                                    : keysData[0].private_key
                                            }
                                            onChange={handleChange}
                                            invalid={!!errors.activePrivate}
                                            required
                                            />
                                        {
                                            errors.activePrivate && 
                                            <FormFeedback invalid="true">
                                                {errors.activePrivate}
                                            </FormFeedback>
                                        }
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col sm={8}>

                                    </Col>
                                    <Col sm={4} clearfix="true">
                                        <ButtonPrimary className="float-right" 
                                            disabled={!(values.activePrivate && values.ownerPrivate)}
                                            block>
                                        Submit
                                        </ButtonPrimary>
                                    </Col>
                                </FormGroup>
                            </Form>
                        </CardBody>
                    </CardStyled>
                    
                    
                </>
            </div>
        </div>
    )

}

export default connect(
    ({ permission, permissionPage: { importAccount } }) => ({
        permission
    }),
    {
        accountAdd
    }
)(ImportAccount);
