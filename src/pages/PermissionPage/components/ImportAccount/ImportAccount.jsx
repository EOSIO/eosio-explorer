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
        keysData = [[], []],
        importSuccess,
        isSubmitting,
        creationSuccess,
        submitError
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
      ownerPrivate: values.ownerPrivate,
      activePrivate: values.activePrivate
    });
  }

  function editAccountKeys() {
    let accountData = {      
      accountName: (keysData) ? keysData[0].account : "Unknown",
      accountOwnerPrivateKey: (keysData && keysData[0].permission === 'owner') ? keysData[0].private_key : keysData[1].private_key
    };
    if (keysData) {
      let ownerDidNotChange = false;
      let activeDidNotChange = false;

      if (keysData[0].permission === 'owner') {
        ownerDidNotChange = keysData[0].private_key === values.ownerPrivate && keysData[0].public_key === values.ownerPublic;
        activeDidNotChange = keysData[1].private_key === values.activePrivate && keysData[1].public_key === values.activePublic;
      } else {
        ownerDidNotChange = keysData[1].private_key === values.ownerPrivate && keysData[1].public_key === values.ownerPublic;
        activeDidNotChange = keysData[0].private_key === values.activePrivate && keysData[0].public_key === values.activePublic;
      }

      if (ownerDidNotChange && activeDidNotChange) {
        cogoToast.info("Your keys did not change, canceling the action", {
          heading: 'Keys Did Not Change',
          position: 'bottom-center',
          hideAfter: 2
        });
      } else if (!ownerDidNotChange && activeDidNotChange) {
        accountData["ownerPublicKey"] = values.ownerPublic;
        accountData["ownerPrivate"] = values.ownerPrivate;
        accountData["activePrivate"] = values.activePrivate;
        accountEdit(accountData);
      } else if (ownerDidNotChange && !activeDidNotChange) {
        accountData["activePublicKey"] = values.activePublic;
        accountData["activePrivate"] = values.activePrivate;
        accountData["ownerPrivate"] = values.ownerPrivate;
        accountEdit(accountData);
      } else {
        accountData["ownerPublicKey"] = values.ownerPublic;
        accountData["ownerPrivate"] = values.ownerPrivate;
        accountData["activePublicKey"] = values.activePublic;
        accountData["activePrivate"] = values.activePrivate;
        accountEdit(accountData);
      }
    }
  }

  useEffect(() => {
    const vals = (keysData) ? [
      { name: "ownerPrivate", value: keysData[0].permission === "owner" ? keysData[0].private_key : keysData[1].private_key },
      { name: "activePrivate", value: keysData[1].permission === "active" ? keysData[1].private_key : keysData[0].private_key },
      { name: "ownerPublic", value: keysData[0].permission === "owner" ? keysData[0].public_key : keysData[1].public_key },
      { name: "activePublic", value: keysData[1].permission === "active" ? keysData[1].public_key : keysData[0].public_key }
    ] : [
        { name: "ownerPrivate", value: "No private key" },
        { name: "activePrivate", value: "No private key" },
        { name: "ownerPublic", value: "No public key" },
        { name: "activePublic", value: "No public key" }
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
                <div><b>Owner</b></div>
                <FormGroup row>
                  <Label htmlFor="ownerPublic" sm={1}>Public Key</Label>
                  <Col sm={11}>
                    <InputStyled type="text"
                      name="ownerPublic"
                      id="ownerPublic"
                      defaultValue={
                        keysData[0].permission === "owner" ?
                          keysData[0].public_key
                          : keysData[1].public_key
                          || ""
                      }
                      placeholder="Enter public key"
                      onChange={handleChange}
                      invalid={!!errors.ownerPublic}
                      readOnly={panel === 'import-account-importer'}
                    />
                    {
                      errors.ownerPublic &&
                      <FormFeedback invalid="true">
                        {errors.ownerPublic}
                      </FormFeedback>
                    }
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label htmlFor="ownerPrivate" sm={1}>Private Key</Label>
                  <Col sm={11}>
                    <InputStyled type="text"
                      name="ownerPrivate"
                      id="ownerPrivate"
                      defaultValue={
                        keysData[0].permission === "owner" ?
                          keysData[0].private_key
                          : keysData[1].private_key
                          || ""
                      }
                      placeholder="Enter private key"
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
                  <Label htmlFor="activePublic" sm={1}>Public Key</Label>
                  <Col sm={11}>
                    <InputStyled type="text"
                      name="activePublic"
                      id="activePublic"
                      defaultValue={
                        keysData[1].permission === "active" ?
                          keysData[1].public_key
                          : keysData[0].public_key
                          || ""
                      }
                      placeholder="Enter public key"
                      invalid={!!errors.activePublic}
                      onChange={handleChange}
                      readOnly={panel === 'import-account-importer'}
                    />
                  </Col>
                  {
                    errors.activePublic &&
                    <FormFeedback invalid="true">
                      {errors.activePublic}
                    </FormFeedback>
                  }
                </FormGroup>
                <FormGroup row>
                  <Label htmlFor="activePrivate" sm={1}>Private Key</Label>
                  <Col sm={11}>
                    <InputStyled type="text"
                      name="activePrivate"
                      id="activePrivate"
                      defaultValue={
                        keysData[1].permission === "active" ?
                          keysData[1].private_key
                          : keysData[0].private_key
                          || ""
                      }
                      placeholder="Enter private key"
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
                    <ButtonGroupSeperated className="float-right" >
                      <ButtonSecondary onClick={()=>{panelSelect("permission-list")}}
                        >
                        Back
                      </ButtonSecondary>
                      <ButtonPrimary className="float-right"
                        disabled={!(values.activePrivate && values.ownerPrivate)}
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
