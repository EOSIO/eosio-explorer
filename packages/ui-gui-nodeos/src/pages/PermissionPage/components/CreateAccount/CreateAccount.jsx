import React, { useEffect }  from 'react';
import {
  Button, Form, FormGroup, Label, FormFeedback, FormText,
  Spinner, Col, UncontrolledAlert, CardBody
} from 'reactstrap';
import cogoToast from 'cogo-toast';

import { connect } from 'react-redux';

import { fetchStart } from './CreateAccountReducer';
import { createStart } from 'reducers/permission';
import useForm from 'helpers/useForm';
import validate from './CreateAccountValidatorEngine/CreateAccountValidatorEngine';
import { CardStyled, OverlayStyled, CardHeaderStyled, ButtonPrimary, InputStyled} from 'styled';

const CreateAccount = (props) => {

  const { values, handleChange, handleSubmit, errors } = useForm(createAccount, validate);

  useEffect(()=>{
    props.fetchStart();
  }, [])

  let { 
    createAccount: { isFetching, data, }, 
    permission
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
              <CardStyled>
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
                        <UncontrolledAlert className="text-white bg-danger text-center"> 
                          Error creating the account: {submitError}
                        </UncontrolledAlert>
                      : null
                  }
                  <Form onSubmit={
                    handleSubmit
                  }>
                    <FormGroup row>
                      <Label htmlFor="accountName" sm={2}>Account Name</Label>
                      <Col sm={10}>
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
                          The account name must start with a letter, must be 12 characters, and can only contain the characters:
                          . (period) [a-z] [1-5]
                        </FormText>
                      </Col>
                    </FormGroup>
                    <div><b>Owner</b></div>
                    <FormGroup row>
                      <Label htmlFor="ownerPublic" sm={2}>Public Key</Label>
                      <Col sm={10}>
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
                      <Label htmlFor="ownerPrivate" sm={2}>Private Key</Label>
                      <Col sm={10}>
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
                      <Label htmlFor="activePublic" sm={2}>Public Key</Label>
                      <Col sm={10}>
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
                      <Label htmlFor="activePrivate" sm={2}>Private Key</Label>
                      <Col sm={10}>
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
                        <ButtonPrimary className="float-right" 
                          disabled={!values.accountName || isSubmitting || creationSuccess}
                          block
                          >
                          Submit
                        </ButtonPrimary>
                      </Col>
                    </FormGroup>
                  </Form>
                </CardBody>
              </CardStyled>
              
              
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
    createStart
  }

)(CreateAccount);
