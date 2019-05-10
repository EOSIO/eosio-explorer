import React, { useEffect }  from 'react';
import {
  Button, Form, FormGroup, Label, FormFeedback, FormText,
  Spinner, Col, UncontrolledAlert, CardBody
} from 'reactstrap';
import cogoToast from 'cogo-toast';

import { connect } from 'react-redux';

import { fetchStart } from './CreateAccountReducer';
import { createStart } from 'reducers/permission';
import { panelSelect } from 'pages/PermissionPage/PermissionPageReducer';
import useForm from 'helpers/useForm';
import validate from './CreateAccountValidatorEngine/CreateAccountValidatorEngine';
import { CardStyled, OverlayStyled, CardHeaderStyled, ButtonPrimary, ButtonSecondary, InputStyled, ButtonGroupSeperated } from 'styled';
import styled from 'styled-components';

const FirstCardStyled = styled(CardStyled)`
  border-top: solid 2px #1173a4;
`

const CreateAccount = (props) => {

  const { values, handleChange, handleSubmit, errors } = useForm(createAccount, validate);

  useEffect(()=>{
    props.fetchStart();
  }, [])

  let { 
    createAccount: { isFetching, data, }, 
    permission, panelSelect
  } = props;
  let { payload, error } = data;
  let { 
    data: { submitError, isSubmitting, creationSuccess }
  } = permission;

  function createAccount () {
    let msg = `Cannot make an account also named 'eosio', since 'eosio' owns the system contract 
      for creating new accounts.`
    if (values.accountName !== 'eosio')
      props.createStart({
        accountName: values.accountName,
        ownerPrivateKey: payload.ownerPrivateKey,
        ownerPublicKey: payload.ownerPublicKey,
        activePrivateKey: payload.activePrivateKey,
        activePublicKey: payload.activePublicKey
      });
    else 
      cogoToast.error(msg, {
        heading: 'Account Creation Denied',
        position: 'bottom-center',
        hideAfter: 2
      });
  }

  return (
    <div className="CreateAccount">
      <div>
        { 
          error         ? <Button onClick={props.fetchStart}>Retry Generation</Button>
          : <>
              <FirstCardStyled>
                <OverlayStyled isLoading={isFetching || isSubmitting}></OverlayStyled>
                {
                    (isSubmitting || isFetching) &&
                        <div style={{position:"fixed",top:"50%",left:"50%", zIndex:"1000"}}>
                            <Spinner color="primary"
                                style={{
                                    width: "5rem",
                                    height: "5rem"
                                }}
                            />
                        </div>
                }
                <CardHeaderStyled>
                  Create Account
                </CardHeaderStyled>
                <CardBody>
                  {
                    creationSuccess &&
                      <UncontrolledAlert color="success">
                        Account {values.accountName} successfully created
                      </UncontrolledAlert>
                  }
                  {
                    ((!creationSuccess) && submitError) ?
                        <UncontrolledAlert color="danger"> 
                          Error creating the account: {submitError}
                        </UncontrolledAlert>
                      : null
                  }
                  <Form onSubmit={
                    handleSubmit
                  }>
                    <FormGroup row>
                      <Label htmlFor="accountName" sm={1}>Account Name</Label>
                      <Col sm={11}>
                        <InputStyled type="text"
                          name="accountName"
                          id="accountName"
                          placeholder="Your account name"
                          value={values.accountName || ''}
                          onChange={handleChange}
                          invalid={!!errors.accountName}
                          readOnly={creationSuccess}
                          required
                          />
                        {
                          errors.accountName && 
                          <FormFeedback invalid="true">
                            {errors.accountName}
                          </FormFeedback>
                        }
                        <FormText>
                          <strong>An EOSIO account name cannot start with a capital letter or and cannot contain capital letters.
                          It also cannot start with a number or contain the numbers 6, 7, 8 or 9. The only special character you can use is '.'</strong>
                        </FormText>
                      </Col>
                    </FormGroup>
                    <div><b>Owner</b></div>
                    <FormGroup row>
                      <Label htmlFor="ownerPublic" sm={1}>Public Key</Label>
                      <Col sm={11}>
                        <InputStyled type="text"
                          name="ownerPublic"
                          id="ownerPublic"
                          placeholder="Generating keys..."
                          value={
                            values.ownerPublic 
                            || payload.ownerPublicKey
                          }
                          onInput={handleChange}
                          readOnly
                          />
                      </Col> 
                    </FormGroup>
                    <FormGroup row>
                      <Label htmlFor="ownerPrivate" sm={1}>Private Key</Label>
                      <Col sm={11}>
                        <InputStyled type="text"
                            name="ownerPrivate"
                            id="ownerPrivate"
                            placeholder="Generating keys..."
                            value={
                              values.ownerPrivate
                              || payload.ownerPrivateKey
                            }
                            onInput={handleChange}
                            readOnly
                            />
                      </Col>
                    </FormGroup>
                    <div><b>Active</b></div>
                    <FormGroup row>
                      <Label htmlFor="activePublic" sm={1}>Public Key</Label>
                      <Col sm={11}>
                        <InputStyled type="text"
                          name="activePublic"
                          id="activePublic"
                          placeholder="Generating keys..."
                          value={
                            values.activePublic
                            || payload.activePublicKey
                          }
                          onInput={handleChange}
                          readOnly
                          />
                      </Col> 
                    </FormGroup>
                    <FormGroup row>
                      <Label htmlFor="activePrivate" sm={1}>Private Key</Label>
                      <Col sm={11}>
                        <InputStyled type="text"
                            name="activePrivate"
                            id="activePrivate"
                            placeholder="Generating keys..."
                            value={
                              values.activePrivate
                              || payload.activePrivateKey
                            }
                            onInput={handleChange}
                            readOnly
                            />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col sm={8}>
                      </Col>
                      <Col sm={4} clearfix="true">
                        <ButtonGroupSeperated className="float-right" >
                          <ButtonSecondary onClick={()=>{panelSelect("permission-list")}}
                            >
                            Back
                          </ButtonSecondary>
                          <ButtonPrimary
                            disabled={!values.accountName || isSubmitting || creationSuccess}
                            block
                            >
                            Create
                          </ButtonPrimary>
                        </ButtonGroupSeperated>
                      </Col>
                    </FormGroup>
                  </Form>
                </CardBody>
              </FirstCardStyled>
              
              
            </>
        }
      </div>
    </div>
  )

}

export default connect(
  ({ permissionPage: { createAccount }, permission}) => ({
    createAccount, permission
  }),
  {
    fetchStart,
    createStart,
    panelSelect
  }

)(CreateAccount);
