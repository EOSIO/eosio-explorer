import React, { useEffect }  from 'react';
import {
  Button, Form, FormGroup, Label, Input, FormFeedback, FormText,
  Spinner, Col
} from 'reactstrap';

import { connect } from 'react-redux';

import { fetchStart } from './CreateAccountReducer';
import { createStart } from 'reducers/permission';
import useForm from 'helpers/useForm';
import validate from './CreateAccountValidatorEngine/CreateAccountValidatorEngine';

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
    data: { list, submitError, isSubmitting, creationSuccess }
  } = permission;

  function createAccount () {
    props.createStart({
      accountName: values.accountName,
      ownerPrivateKey: payload.ownerPrivateKey,
      ownerPublicKey: payload.ownerPublicKey,
      activePrivateKey: payload.activePrivateKey,
      activePublicKey: payload.activePublicKey
    });
  }

  return (
    <div className="CreateAccount">
      <div>
        { 
          error         ? <Button onClick={props.fetchStart}>Retry Generation</Button>
          : isFetching  ? <Spinner style={{ width: '3rem', height: '3rem' }} />
          : <>
              <h3>
                <u>Generate Account</u>
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
                      placeholder="Your account name"
                      value={values.accountName || ''}
                      onChange={handleChange}
                      invalid={!!errors.accountName}
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
                <h4>Owner</h4>
                <FormGroup row>
                  <Label htmlFor="ownerPublic" sm={2}>Public Key</Label>
                  <Col sm={10}>
                    <Input type="text"
                      name="ownerPublic"
                      id="ownerPublic"
                      value={values.ownerPublic || payload.ownerPublicKey}
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
                        value={values.ownerPrivate || payload.ownerPrivateKey}
                        onInput={handleChange}
                        readOnly
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
                      value={values.activePublic || payload.activePublicKey}
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
                        value={values.activePrivate || payload.activePrivateKey}
                        onInput={handleChange}
                        readOnly
                        />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Col sm={8}>
                    {
                      creationSuccess &&
                      <h4>Account {values.accountName} successfully created</h4>
                    }
                    {
                      ((!creationSuccess) && submitError) ?
                        <h4>{submitError}</h4>
                      : null
                    }
                  </Col>
                  <Col sm={4} clearfix="true">
                    <Button className="float-right" 
                      color="primary" 
                      disabled={!values.accountName || isSubmitting}
                      block
                      >
                      Submit
                    </Button>
                  </Col>
                </FormGroup>
              </Form>
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
