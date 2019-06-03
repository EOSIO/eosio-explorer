import React, { useEffect } from 'react';
import {
  Form, FormGroup, Label, FormFeedback,
  Col, UncontrolledAlert, CardBody, Spinner
} from 'reactstrap';
import cogoToast from 'cogo-toast';

import { connect } from 'react-redux';

import { accountAdd, accountEdit } from 'reducers/permission';
import { panelSelect } from 'pages/PermissionPage/PermissionPageReducer';
import importValidate from './ImportAccountValidatorEngine/ImportAccountValidatorEngine';
import editValidate from './EditAccountValidatorEngine/EditAccountValidatorEngine';
import useForm from 'helpers/useForm';
import { CardStyled, CardHeaderStyled, ButtonPrimary, ButtonSecondary, InputStyled, 
  OverlayStyled, InfoDivStyled, ButtonGroupSeperated } from 'styled';
import styled from 'styled-components';

const FirstCardStyled = styled(CardStyled)`
  border-top: solid 2px #1173a4;
`

const ImportAccount = (props) => {

  let {
    permission: {
      data: {
        keysData = [],
        importSuccess,
        isSubmitting,
        creationSuccess,
        submitError,
        list
      }
    },
    panel,
    accountAdd,
    accountEdit,
    panelSelect
  } = props;

  const { values, handleChange, handleSubmit, updateValues, errors } = (panel === 'import-account-importer')
    ? useForm(importAccount, importValidate) : useForm(editAccountKeys, editValidate);

  function importAccount() {
    accountAdd({
      accountName: (keysData) ? keysData[0].account : "Unknown",
      privateKey: values.privateKey,
      permission: keysData[0].permission
    });
    window.scrollTo(0,0);
  }

  function editAccountKeys() {
    let accountObj = list.filter(acct => acct["account"] === keysData[0].account);
    let ownerObj = accountObj.filter(eachPermission => eachPermission.permission === "owner" );

    let accountData = {      
      accountName: (keysData) ? keysData[0].account : "Unknown",
      accountOwnerPrivateKey: ownerObj[0].private_key,
      permission: keysData[0].permission
    };

    if (keysData) {     
      let keyNotChanged = keysData[0].private_key === values.privateKey && keysData[0].public_key === values.publicKey;
      
      if(keyNotChanged){
        cogoToast.info("Your keys did not change, canceling the action", {
          heading: 'Keys Did Not Change',
          position: 'bottom-center',
          hideAfter: 2
        });
      }else{
        accountData["publicKey"] = values.publicKey;
        accountData["privateKey"] = values.privateKey;
        console.log("accountData ",accountData);
        accountEdit(accountData);
        
      }      
    }
    window.scrollTo(0,0);
  }

  useEffect(() => {
    const vals = (keysData) ? [
      { name: "privateKey", value: keysData[0].private_key },      
      { name: "publicKey", value: keysData[0].public_key }
    ] : [
        { name: "privateKey", value: "No private key" },
        { name: "publicKey", value: "No public key" }
      ]
    updateValues(vals);
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="ImportAccount">
      <div>
        <>
          <FirstCardStyled>
            <OverlayStyled isLoading={isSubmitting}></OverlayStyled>
            {
              isSubmitting &&
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
              {
                panel === 'import-account-edit' ? "Edit Account Details" : "Import Account Keys"
              }
            </CardHeaderStyled>
            <CardBody>
              {
                creationSuccess &&
                <UncontrolledAlert color="success">
                  Keys for {keysData[0].account || "unknown account"} successfully updated
                </UncontrolledAlert>
              }
              {
                ((!creationSuccess) && submitError) ?
                  <UncontrolledAlert color="danger"> 
                    Error updating the account keys: {submitError}
                  </UncontrolledAlert>
                : null
              }
              {
                importSuccess &&
                <UncontrolledAlert color="success">
                  Private keys for {keysData[0].account || "unknown account"} successfully imported
                </UncontrolledAlert>
              }
              <InfoDivStyled>
                <p className="infoHeader">
                  { panel === 'import-account-importer' ? "Before you import your private keys..." : "Before you update your keys..."}
                </p>
                <p>
                  Ensure that the private keys you use are <code>base58 WIF</code> compliant. <b>WIF</b> stands for
                  "Wallet Import Format" and is a convenience specification for copying and pasting private keys.
                  The form will notify you if any of your keys are invalid upon submission. Please also ensure
                  the private keys you import <b>properly match</b> the public keys listed here. Otherwise,
                  you will not be able to authorize any actions with this account since the blockchain will not
                  have the correct signatures for the declared authorization.
                </p>
                {
                  panel === 'import-account-edit' ? (<p>
                    If you plan to update your public keys, ensure that your new public keys are in valid <code>EOSKey</code> format. 
                    This is a form of public key which is prefixed with <code>EOS</code>. 
                    This form will automatically validate your private keys if they match the new public keys.
                  </p>) : null
                }
                <hr />
                <p className="mb-0">
                  Your private keys will be saved locally in your browser. However, please be sure NEVER to share
                  your private key to anybody. If someone asks you for your private key, please do not give it
                  to them. Private keys are very sensitive information and should be kept to yourself as much
                  as possible.
                </p>
              </InfoDivStyled>
              <Form onSubmit={
                handleSubmit
              }>
              <FormGroup row>
                  <Label htmlFor="accountName" sm={1}>Account Name</Label>
                  <Col sm={11}>
                    <InputStyled type="text"
                      name="accountName"
                      id="accountName"
                      defaultValue={keysData[0].account || "Unknown"}
                      readOnly
                    />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label htmlFor="permissionName" sm={1}>Permission</Label>
                  <Col sm={11}>
                    <InputStyled type="text"
                      name="permissionName"
                      id="permissionName"
                      defaultValue={keysData[0].permission || "Unknown"}
                      readOnly
                    />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label htmlFor="publicKey" sm={1}>Public Key</Label>
                  <Col sm={11}>
                    <InputStyled type="text"
                      name="publicKey"
                      id="publicKey"
                      defaultValue={ keysData[0].public_key }
                      placeholder="Enter public key"
                      onChange={handleChange}
                      invalid={!!errors.publicKey}
                      readOnly={panel === 'import-account-importer'}
                      required={panel === 'import-account-edit'}
                    />
                    {
                      errors.publicKey &&
                      <FormFeedback invalid="true">
                        {errors.publicKey}
                      </FormFeedback>
                    }
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label htmlFor="privateKey" sm={1}>Private Key</Label>
                  <Col sm={11}>
                    <InputStyled type="text"
                      name="privateKey"
                      id="privateKey"
                      defaultValue={ keysData[0].private_key }
                      placeholder="Enter private key"
                      onChange={handleChange}
                      invalid={!!errors.privateKey}
                      required
                    />
                    {
                      errors.privateKey &&
                      <FormFeedback invalid="true">
                        {errors.privateKey}
                      </FormFeedback>
                    }
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
                      <ButtonPrimary className="float-right"
                        disabled={!(values.privateKey)}
                        block>
                        Submit
                      </ButtonPrimary>
                    </ButtonGroupSeperated>
                  </Col>
                </FormGroup>
              </Form>
            </CardBody>
          </FirstCardStyled>
        </>
      </div>
    </div>
  )

}

export default connect(
  ({ permission, permissionPage: { panel } }) => ({
    permission, panel
  }),
  {
    accountAdd,
    accountEdit,
    panelSelect
  }
)(ImportAccount);
