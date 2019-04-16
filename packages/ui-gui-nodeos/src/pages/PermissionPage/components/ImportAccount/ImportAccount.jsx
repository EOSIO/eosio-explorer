import React, { useEffect } from 'react';
import {
    Form, FormGroup, Label, FormFeedback,
    Col, UncontrolledAlert, CardBody
  } from 'reactstrap';

import { connect } from 'react-redux';

import { accountAdd } from 'reducers/permission';
import validate from './ImportAccountValidatorEngine/ImportAccountValidatorEngine';
import useForm from 'helpers/useForm';
import styled from 'styled-components';
import { CardStyled, CardHeaderStyled, ButtonPrimary, InputStyled} from 'styled';

const InfoDiv = styled.div`
  color: #181c1e;
  background-color: #d5d7d8;
  border-color: #c5c6c8;
  padding: 20px;  
  margin-bottom: 20px;
  border-radius: 3px;
`

const ImportAccount = (props) => {

    const { values, handleChange, handleSubmit, updateValues, errors } = useForm(importAccount, validate);

    let {
        permission: {
            data: {
                keysData = [[],[]],
                importSuccess
            }
        },
        accountAdd
    } = props;

    function importAccount() {
        accountAdd({
            accountName: (keysData) ? keysData[0].account : "Unknown",
            ownerPrivate: values.ownerPrivate,
            activePrivate: values.activePrivate
        });
    }

    useEffect(()=>{
        const vals = (keysData) ? [
            {name: "ownerPrivate", value: keysData[0].permission === "owner" ? keysData[0].private_key : keysData[1].private_key},
            {name: "activePrivate", value: keysData[1].permission === "active" ? keysData[1].private_key : keysData[0].private_key},
            {name: "ownerPublic", value: keysData[0].permission === "owner" ? keysData[0].public_key : keysData[1].public_key},
            {name: "activePublic", value: keysData[1].permission === "active" ? keysData[1].public_key : keysData[0].public_key}
        ] : [
            {name: "ownerPrivate", value: "No private key"},
            {name: "activePrivate", value: "No private key"},
            {name: "ownerPublic", value: "No public key"},
            {name: "activePublic", value: "No public key"}
        ]
        updateValues(vals);
        window.scrollTo(0, 0);
    }, []);

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
                                    Private keys for {keysData[0].account || "unknown account"} successfully updated
                                </UncontrolledAlert>
                            }
                            <InfoDiv>
                                <h5 className="alert-heading">Before you update your private keys...</h5>
                                <p>
                                    Ensure that the private keys you use are <code>base58 WIF</code> compliant. <b>WIF</b> stands for 
                                    "Wallet Import Format" and is a convenience specification for copying and pasting private keys.
                                    The form will notify you if any of your keys are invalid upon submission. Please also ensure 
                                    the private keys you import <b>properly match</b> the public keys listed here. Otherwise, 
                                    you will not be able to authorize any actions with this account since the blockchain will not
                                    have the correct signatures for the declared authorization.
                                </p>
                                <hr />
                                <p className="mb-0">
                                    Your private keys will be saved locally in your browser. However, please be sure NEVER to share
                                    your private key to anybody. If someone asks you for your private key, please do not give it
                                    to them. Private keys are very sensitive information and should be kept to yourself as much
                                    as possible.
                                </p>
                            </InfoDiv>
                            <Form onSubmit={
                                handleSubmit
                            }>                    
                                <FormGroup row>
                                    <Label htmlFor="accountName" sm={2}>Account Name</Label>
                                    <Col sm={10}>
                                        <InputStyled type="text"
                                            name="accountName"
                                            id="accountName"
                                            defaultValue={keysData[0].account || "Unknown"}
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
                                                || "No public key"
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
                                                    || "No private key"
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
                                                    || "No public key"
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
                                                    || "No private key"
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
