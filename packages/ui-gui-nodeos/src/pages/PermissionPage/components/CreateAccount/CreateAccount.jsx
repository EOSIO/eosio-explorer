import React, { useEffect, useState }  from 'react';
import {
  Button, Form, FormGroup, Label, Input, FormFeedback, FormText,
  Spinner, Col
} from 'reactstrap';

import { connect } from 'react-redux';

import { fetchStart } from './CreateAccountReducer';
import useForm from '../../../../helpers/useForm';
import validate from './CreateAccountValidatorEngine/CreateAccountValidatorEngine';

const CreateAccount = (props) => {

  const [ isProcessing, setIsProcessing ] = useState(false);
  const { values, handleChange, handleSubmit, errors } = useForm(createAccount, validate);

  useEffect(()=>{
    props.fetchStart();
  }, [])

  let { createAccount: { isFetching, data, params } } = props;
  let { payload, error } = data;

  function createAccount () {
    console.log(values, isProcessing);
  }

  return (
    <div className="CreateAccount">
      <div>
        { 
          error         ? <Button onClick={props.fetchStart}>Retry Generation</Button>
          : isFetching  ? <Spinner style={{ width: '3rem', height: '3rem' }} />
          : <>
              <Form onSubmit={handleSubmit}>
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
                  <Col sm={8}></Col>
                  <Col sm={4} clearfix="true">
                    <Button className="float-right" 
                      color="primary" 
                      disabled={!values.accountName || isProcessing}
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
  ({ permissionPage: { createAccount }}) => ({
    createAccount,
  }),
  {
    fetchStart,
  }

)(CreateAccount);
